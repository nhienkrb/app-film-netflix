export default function VideoPlayer({
  source,
}: {
  source: { kind: 'file' | 'youtube'; url: string }
}) {
  if (source.kind === 'youtube') {
    // nhận cả dạng full URL
    const url = source.url.includes('embed')
      ? source.url
      : source.url.replace('watch?v=', 'embed/')
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-800">
        <iframe
          src={url}
          title="trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }
  return (
    <video
      controls
      className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-800"
      src={source.url}
    />
  )
}
