import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Hls from "hls.js";
import api from "../api";
import { getSession } from "../lib/auth";
import * as vh from "../features/viewHistory";
import * as ratings from "../features/ratings";
import StarInput from "../components/ui/StarInput";

/* ========= Types ========= */
type MediaAsset = {
  public_id?: string;
  movie_id?: number;
  type: string;                // 'full' | 'trailer'
  quality?: string;            // 'SD' | 'HD' | ...
  url: string;
  created_at?: string;
};
type Movie = {
  id: number;
  title: string;
  description?: string;
  release_year?: number;
  duration_min?: number;
  poster_url?: string;
  link_ytb?: string;
  video_url?: string;          // direct file / HLS
  mediaAsset?: MediaAsset[];
};

/* ========= Utils ========= */
function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1];
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}
function isHls(url: string) {
  return /\.m3u8($|\?)/i.test(url);
}
function isMp4(url: string) {
  return /\.mp4($|\?)/i.test(url);
}

/* ========= SmartPlayer ========= */
type SmartPlayerProps = {
  source: { kind: "hls" | "mp4" | "youtube" | "none"; url: string };
  poster?: string;
  title?: string;
  canPersist?: boolean;          // user signed in?
  movieId: number;
};

function SmartPlayer({ source, poster, title, canPersist, movieId }: SmartPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastSaved = useRef(0);
  const [resumeAt, setResumeAt] = useState<number>(0);

  const clearHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  // Load last position to resume
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canPersist) { setResumeAt(0); return; }
      try {
        const r = await vh.getPosition(movieId); // expect { position_sec?: number }
        const sec = Math.max(0, Number(r?.data?.position_sec ?? r?.position_sec ?? 0));
        if (mounted) setResumeAt(sec);
      } catch {
        if (mounted) setResumeAt(0);
      }
    })();
    return () => { mounted = false; };
  }, [movieId, canPersist]);

  // Attach player by source
  useEffect(() => {
    const el = videoRef.current;
    clearHls();

    if (!el) return;

    if (source.kind === "hls") {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferLength: 30,
        });
        hlsRef.current = hls;
        hls.on(Hls.Events.ERROR, (_e, data) => {
          // try fallback for fatal errors
          if (data?.fatal) {
            try {
              hls.destroy();
              hlsRef.current = null;
              if (el.canPlayType("application/vnd.apple.mpegurl")) {
                el.src = source.url;
              }
            } catch {}
          }
        });
        hls.loadSource(source.url);
        hls.attachMedia(el);
      } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = source.url; // Safari
      } else {
        // fallback: show poster
        el.removeAttribute("src");
      }
    } else if (source.kind === "mp4") {
      el.src = source.url;
    } else {
      el.removeAttribute("src"); // youtube/none → do nothing for <video>
    }

    return clearHls;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.url, source.kind]);

  // Seek to resume point when metadata loaded
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onLoaded = () => {
      if (resumeAt > 0 && resumeAt < (el.duration || Number.MAX_SAFE_INTEGER)) {
        try { el.currentTime = resumeAt; } catch {}
      }
    };
    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [resumeAt]);

  // Throttled save progress
  const saveProgress = useCallback(async () => {
    if (!canPersist || !videoRef.current) return;
    const now = Date.now();
    if (now - lastSaved.current < 10_000) return; // throttle 10s
    lastSaved.current = now;
    try {
      const pos = Math.floor(videoRef.current.currentTime);
      if (pos >= 0) await vh.upsertPosition(movieId, pos);
    } catch { /* ignore */ }
  }, [canPersist, movieId]);

  // Timer auto-save
  useEffect(() => {
    if (!canPersist) return;
    saveTimer.current && window.clearInterval(saveTimer.current);
    saveTimer.current = window.setInterval(() => { void saveProgress(); }, 10_000);
    return () => { if (saveTimer.current) window.clearInterval(saveTimer.current); };
  }, [canPersist, saveProgress]);

  // Save on pause/ended & when tab hidden
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !canPersist) return;
    const onPause = () => { void saveProgress(); };
    const onEnded = () => { void saveProgress(); };
    const onVis = () => { if (document.hidden) void saveProgress(); };
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [canPersist, saveProgress]);

  if (source.kind === "youtube") {
    const ytId = getYouTubeId(source.url);
    // add ?start=resumeAt when user presses play; simple approach: include it in URL directly
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      controls: "1",
      start: String(Math.max(0, resumeAt || 0)),
    });
    const embedUrl = ytId
      ? `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`
      : "";

    // srcdoc trick for faster first paint
    const posterHtml = poster
      ? `<img src="${poster}" alt="${title || "Poster"}" style="width:100%;height:100%;object-fit:cover"/>`
      : "";

    return (
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full rounded-none"
          src={embedUrl}
          title={title || "YouTube"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          srcDoc={`<style>*{padding:0;margin:0}html,body{height:100%} .c{position:absolute;inset:0;display:grid;place-items:center;background:#000}</style><a class="c" href='${embedUrl}'><svg width="68" height="48" viewBox="0 0 68 48"><path d="M66.52,7.74a8,8,0,0,0-5.61-5.61C56.73,1,34,1,34,1S11.27,1,7.09,2.13A8,8,0,0,0,1.48,7.74,84.7,84.7,0,0,0,0,24a84.7,84.7,0,0,0,1.48,16.26,8,8,0,0,0,5.61,5.61C11.27,47,34,47,34,47s22.73,0,26.91-1.13a8,8,0,0,0,5.61-5.61A84.7,84.7,0,0,0,68,24,84.7,84.7,0,0,0,66.52,7.74Z" fill="#f00"/><path d="M45,24 27,14 27,34" fill="#fff"/></svg>${posterHtml}</a>`}
        />
      </div>
    );
  }

  if (source.kind === "none") {
    return (
      <img className="aspect-video w-full object-cover" src={poster || "/placeholder.png"} alt={title || "Poster"} />
    );
  }

  // HLS / MP4 by <video>
  return (
    <video
      ref={videoRef}
      className="aspect-video w-full"
      controls
      playsInline
      preload="metadata"
      poster={poster}
    />
  );
}

/* ========= Page ========= */
export default function Watch() {
  const { id } = useParams();
  const movieId = Number(id);
  const nav = useNavigate();

  const { isAuthenticated, payload } = getSession();
  const myUserId = (payload?.id as number | undefined) || undefined;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  // ratings
  const [list, setList] = useState<ratings.Rating[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [myStars, setMyStars] = useState(0);
  const [myComment, setMyComment] = useState("");

  // chọn nguồn phát: mediaAsset (full>trailer) > video_url > link_ytb
  const source = useMemo(() => {
    if (!movie) return { kind: "none" as const, url: "" };
    const assets = movie.mediaAsset || [];
    const full = assets.find(a => a.type?.toLowerCase() === "full");
    const trailer = assets.find(a => a.type?.toLowerCase() === "trailer");
    const chosen = full || trailer;

    const url = chosen?.url || movie.video_url || movie.link_ytb || "";
    if (!url) return { kind: "none" as const, url: "" };
    if (isHls(url)) return { kind: "hls" as const, url };
    if (isMp4(url)) return { kind: "mp4" as const, url };
    if (getYouTubeId(url)) return { kind: "youtube" as const, url };
    return { kind: "none" as const, url: "" };
  }, [movie]);

  async function loadMovie() {
    setLoading(true);
    try {
      const r = await api.getApiV1MoviesById(movieId);
      setMovie(r?.data ?? r);
    } finally {
      setLoading(false);
    }
  }

  async function loadRatings() {
    const r = await ratings.listByMovie(movieId);
    const arr: ratings.Rating[] = (r?.data ?? r) || [];
    setList(arr);
    setCount(arr.length);
    setAvg(arr.length ? arr.reduce((s, x) => s + (x.stars || 0), 0) / arr.length : 0);
    const mine = arr.find(x => x.user_id === myUserId);
    setMyStars(mine?.stars || 0);
    setMyComment(mine?.comment || "");
  }

  async function submitRating() {
    if (!isAuthenticated) return nav("/login", { replace: true });
    if (!myStars) return alert("Chọn số sao");
    try {
      const mine = list.find(x => x.user_id === myUserId);
      if (mine) {
        await ratings.updateRating({ movie_id: movieId, stars: myStars, comment: myComment });
      } else {
        await ratings.createRating({ movie_id: movieId, stars: myStars, comment: myComment });
      }
      await loadRatings();
    } catch (e: any) {
      alert(e?.body?.message || "Không gửi được đánh giá");
    }
  }

  useEffect(() => {
    void loadMovie();
    void loadRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  if (loading) return <div className="p-6">Đang tải…</div>;
  if (!movie) return <div className="p-6">Không tìm thấy phim</div>;

  return (
    <div className="space-y-8 px-6">
      {/* Player */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
        <SmartPlayer
          source={source}
          poster={movie.poster_url || "/placeholder.png"}
          title={movie.title}
          canPersist={Boolean(isAuthenticated)}
          movieId={movie.id}
        />
      </div>

      {/* Info + quick actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-zinc-400">
            {movie.release_year || "—"} • {movie.duration_min ?? "—"} phút
          </p>
          <p className="whitespace-pre-wrap text-zinc-300">
            {movie.description || "Không có mô tả."}
          </p>
          <div className="pt-2 text-sm text-zinc-400">
            Trung bình: <span className="font-medium text-white">{avg.toFixed(1)}</span> / 5 • {count} lượt
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-3 text-lg font-semibold">Đánh giá của bạn</h2>
          <StarInput value={myStars} onChange={setMyStars} />
          <textarea
            className="mt-3 h-20 w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm"
            placeholder="Bình luận… (tuỳ chọn)"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
          />
          <button
            onClick={submitRating}
            className="mt-3 rounded bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
          >
            Gửi đánh giá
          </button>
          {!isAuthenticated && (
            <p className="mt-2 text-xs text-zinc-500">
              <Link className="underline" to="/login">Đăng nhập</Link> để lưu tiến độ xem và gửi đánh giá.
            </p>
          )}
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-lg font-semibold">Đánh giá</h2>
        {list.length === 0 ? (
          <p className="text-sm text-zinc-400">Chưa có đánh giá.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.id} className="rounded border border-zinc-700 p-3">
                <div className="flex items-center justify-between">
                  <StarInput value={r.stars} readOnly size="sm" />
                  <span className="text-xs text-zinc-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-zinc-300">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gợi ý */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Có thể bạn sẽ thích</h2>
        <Recommendations />
      </div>
    </div>
  );
}

/** Gợi ý đơn giản: lấy /movies/top10 */
function Recommendations() {
  const [items, setItems] = useState<Movie[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await api.getApiV1MoviesTop10();
        const arr: Movie[] = (r?.data ?? r) || [];
        setItems(Array.isArray(arr) ? arr : []);
      } catch {}
    })();
  }, []);
  if (items.length === 0) return <div className="text-sm text-zinc-400">—</div>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {items.map((m) => (
        <Link
          to={`/movie/${m.id}`}
          key={m.id}
          className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
        >
          <img
            src={m.poster_url || "/placeholder.png"}
            alt={m.title}
            className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-2 text-sm font-medium">{m.title}</div>
        </Link>
      ))}
    </div>
  );
}
