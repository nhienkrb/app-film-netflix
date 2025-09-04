const db = require("../models");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { Op } = require("sequelize");

const getAll = async () => {
  try {
    const movies = await db.Movie.findAll({
      include: [{ model: db.MediaAsset, as: "mediaAsset" }],
    });
    return movies;
  } catch (error) {
    console.error(
      "Error fetching movies at getAll movie-service.js:",
      error.message
    );
  }
};

const getOneById = async (movieId) => {
  try {
    const movie = await db.Movie.findByPk(movieId, {
      include: [{ model: db.MediaAsset, as: "mediaAsset" }],
    });
    return movie ? movie : null;
  } catch (error) {
    console.error(
      "Error fetching movies at getOneById movie-service.js:",
      error.message
    );
  }
};

const getOneByName = async (movieName) => {
  try {
    const movies = await db.Movie.findAll({
      where: {
        title: db.sequelize.where(
          db.sequelize.fn("LOWER", db.sequelize.col("title")),
          { [Op.like]: `${movieName.toLowerCase()}%` }
        ),
      },
    });
    return movies.length > 0 ? movies : null;
  } catch (error) {
    console.error(
      "Error fetching movies at getOneByName movie-service.js:",
      error.message
    );
    throw error;
  }
};

// const create = async (movieData) => {
//   const t = await db.sequelize.transaction();
//   let uploadedFiles = []; // lưu danh sách file đã upload để rollback nếu lỗi

//   try {
//     // === Upload poster (bắt buộc) ===
//     const posterUpload = await cloudinary.uploader.upload(movieData.poster_url, {
//       folder: "movies/posters",
//       resource_type: "image",
//     });
//     uploadedFiles.push({ public_id: posterUpload.public_id, resource_type: "image" });

//     // === Tạo Movie ===
//     const newMovie = await db.Movie.create(
//       {
//         title: movieData.title,
//         description: movieData.description,
//         duration_min: movieData.duration_min,
//         release_year: movieData.release_year,
//         age_rating: movieData.age_rating,
//         link_ytb: movieData.link_ytb,
//         poster_url: posterUpload.secure_url,
//         public_id_poster: posterUpload.public_id,
//       },
//       { transaction: t }
//     );

//     // === Upload video (nếu có) ===
//     if (movieData.movie_url && movieData.type) {
//       const movieUpload = await cloudinary.uploader.upload(movieData.movie_url, {
//         folder: `movies/videos/${movieData.type}`,
//         resource_type: "video",
//       });
//       uploadedFiles.push({ public_id: movieUpload.public_id, resource_type: "video" });

//       await db.MediaAsset.create(
//         {
//           movie_id: newMovie.id,
//           type: movieData.type,
//           quality: movieData.quality || "HD",
//           url: movieUpload.secure_url,
//           public_id: movieUpload.public_id,
//         },
//         { transaction: t }
//       );
//     }

//     // === Insert MovieGenre (nếu có) ===
//     if (movieData.genre_id) {
//       await db.MovieGenre.create(
//         {
//           movie_id: newMovie.id,
//           genre_id: movieData.genre_id,
//         },
//         { transaction: t }
//       );
//     }

//     await t.commit();
//     return newMovie;
//   } catch (error) {
//     await t.rollback();

//     // rollback Cloudinary upload nếu lỗi
//     for (const file of uploadedFiles) {
//       await cloudinary.uploader.destroy(file.public_id, {
//         resource_type: file.resource_type,
//       });
//     }

//     throw error;
//   }
// };

const create = async (movieData) => {
  const t = await db.sequelize.transaction();
  let uploadedFiles = []; // lưu file đã upload Cloudinary
  let localFiles = []; // lưu file local để xóa sau khi xong

  try {
    // === Upload poster (bắt buộc) ===
    const posterUpload = await cloudinary.uploader.upload(
      movieData.poster_url,
      {
        folder: "movies/posters",
        resource_type: "image",
      }
    );
    uploadedFiles.push({
      public_id: posterUpload.public_id,
      resource_type: "image",
    });
    localFiles.push(movieData.poster_url); // thêm vào danh sách local để xóa

    // === Tạo Movie ===
    const newMovie = await db.Movie.create(
      {
        title: movieData.title,
        description: movieData.description,
        duration_min: movieData.duration_min,
        release_year: movieData.release_year,
        age_rating: movieData.age_rating,
        link_ytb: movieData.link_ytb,
        poster_url: posterUpload.secure_url,
        public_id_poster: posterUpload.public_id,
      },
      { transaction: t }
    );

    // === Upload video (nếu có) ===
    if (movieData.movie_url && movieData.type) {
      const movieUpload = await cloudinary.uploader.upload(
        movieData.movie_url,
        {
          folder: `movies/videos/${movieData.type}`,
          resource_type: "video",
        }
      );
      uploadedFiles.push({
        public_id: movieUpload.public_id,
        resource_type: "video",
      });
      localFiles.push(movieData.movie_url);

      await db.MediaAsset.create(
        {
          movie_id: newMovie.id,
          type: movieData.type,
          quality: movieData.quality || "HD",
          url: movieUpload.secure_url,
          public_id: movieUpload.public_id,
        },
        { transaction: t }
      );
    }

    // === Insert MovieGenre (nếu có) ===
    if (movieData.genre_id) {
      await db.MovieGenre.create(
        {
          movie_id: newMovie.id,
          genre_id: movieData.genre_id,
        },
        { transaction: t }
      );
    }

    await t.commit();

    // === Xóa file local sau khi commit thành công ===
    for (const file of localFiles) {
      fs.unlink(file, (err) => {
        if (err) console.error("Xóa file local thất bại:", file, err);
      });
    }

    return newMovie;
  } catch (error) {
    await t.rollback();

    // rollback Cloudinary upload nếu lỗi
    for (const file of uploadedFiles) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.resource_type,
      });
    }

    // rollback file local (xóa luôn)
    for (const file of localFiles) {
      fs.unlink(file, (err) => {
        if (err) console.error("Xóa file local thất bại:", file, err);
      });
    }

    throw error;
  }
};

const update = async (movieId, movieData) => {
  const t = await db.sequelize.transaction();
  let uploadedFiles = []; // lưu file mới để rollback nếu lỗi

  try {
    const movie = await db.Movie.findByPk(movieId, { transaction: t });
    if (!movie) throw new Error(`Movie with id ${movieId} not found`);

    // ===== Poster Update =====
    if (movieData.poster_url) {
      // Xóa poster cũ nếu có
      if (movie.public_id_poster) {
        await cloudinary.uploader.destroy(movie.public_id_poster, {
          resource_type: "image",
        });
      }

      // Upload poster mới
      const resultPoster = await cloudinary.uploader.upload(
        movieData.poster_url,
        { folder: "movies/posters" }
      );

      uploadedFiles.push(resultPoster.public_id);
      movieData.poster_url = resultPoster.secure_url;
      movieData.public_id_poster = resultPoster.public_id;
    }

    // ===== Video Update =====
    if (movieData.movie_url) {
      const mediaAsset = await db.MediaAsset.findOne({
        where: { movie_id: movieId },
        transaction: t,
      });

      // Xóa video cũ trên Cloudinary
      if (mediaAsset && mediaAsset.public_id) {
        await cloudinary.uploader.destroy(mediaAsset.public_id, {
          resource_type: "video",
        });
      }

      // Upload video mới
      const resultMovie = await cloudinary.uploader.upload(
        movieData.movie_url,
        {
          folder: `movies/videos/${movieData.type || mediaAsset?.type}`,
          resource_type: "video",
        }
      );

      uploadedFiles.push(resultMovie.public_id);

      if (mediaAsset) {
        await mediaAsset.update(
          {
            url: resultMovie.secure_url,
            public_id: resultMovie.public_id,
            type: movieData.type || mediaAsset.type,
            quality: movieData.quality || mediaAsset.quality,
          },
          { transaction: t }
        );
      } else {
        await db.MediaAsset.create(
          {
            movie_id: movie.id,
            type: movieData.type || "unknown",
            quality: movieData.quality || "HD",
            url: resultMovie.secure_url,
            public_id: resultMovie.public_id,
          },
          { transaction: t }
        );
      }
    }

    // ===== Genre Update =====
    if (movieData.genre_id) {
      const movieGenre = await db.MovieGenre.findOne({
        where: { movie_id: movieId },
        transaction: t,
      });
      if (movieGenre) {
        await movieGenre.update(
          { genre_id: movieData.genre_id },
          { transaction: t }
        );
      } else {
        await db.MovieGenre.create(
          { movie_id: movie.id, genre_id: movieData.genre_id },
          { transaction: t }
        );
      }
    }

    // ===== Update Movie fields =====
    await movie.update(movieData, { transaction: t });

    await t.commit();
    return movie;
  } catch (error) {
    await t.rollback();

    // rollback các file đã upload
    if (uploadedFiles.length > 0) {
      for (const public_id of uploadedFiles) {
        await cloudinary.uploader.destroy(public_id, { resource_type: "auto" });
      }
    }

    throw error;
  }
};

const remove = async (movieId) => {
  const t = await db.sequelize.transaction();

  try {
    const movie = await db.Movie.findByPk(movieId, { transaction: t });
    if (!movie) throw new Error(`Movie with id ${movieId} not found`);

    // Xóa poster trên Cloudinary
    if (movie.public_id_poster) {
      await cloudinary.uploader.destroy(movie.public_id_poster, {
        resource_type: "image",
      });
    }

    // Xóa video assets
    const mediaAssets = await db.MediaAsset.findAll({
      where: { movie_id: movieId },
      transaction: t,
    });
    for (const asset of mediaAssets) {
      if (asset.public_id) {
        await cloudinary.uploader.destroy(asset.public_id, {
          resource_type: "video",
        });
      }
    }

    // Xóa record trong MediaAsset
    await db.MediaAsset.destroy({
      where: { movie_id: movieId },
      transaction: t,
    });

    // Xóa record trong MovieGenre
    await db.MovieGenre.destroy({
      where: { movie_id: movieId },
      transaction: t,
    });

    // Xóa Movie chính
    await movie.destroy({ transaction: t });

    await t.commit();
    return { message: "Movie deleted successfully" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = { getAll, getOneById, create, update, remove, getOneByName };
