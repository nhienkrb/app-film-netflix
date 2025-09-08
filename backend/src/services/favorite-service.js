const db = require("../models");

// Lấy tất cả phim yêu thích của một user
const getFavoritesByUser = async (userId) => {
  try {
    const favorites = await db.Favorite.findAll({
      where: { user_id: userId },
      include: [{ model: db.Movie, as: "movie" }],
    });
    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    throw error;
  }
};

// Thêm phim vào danh sách yêu thích
const addFavorite = async (userId, movieId) => {
  try {
    const favorite = await db.Favorite.create({
      user_id: userId,
      movie_id: movieId,
    });
    return favorite;
  } catch (error) {
    console.error("Error adding favorite:", error.message);
    throw error;
  }
};

// Xóa phim khỏi danh sách yêu thích
const removeFavorite = async (userId, movieId) => {
  try {
    const result = await db.Favorite.destroy({
      where: { user_id: userId, movie_id: movieId },
    });
    return result > 0;
  } catch (error) {
    console.error("Error removing favorite:", error.message);
    throw error;
  }
};

// Kiểm tra phim đã được yêu thích chưa
const isFavorite = async (userId, movieId) => {
  try {
    const favorite = await db.Favorite.findOne({
      where: { user_id: userId, movie_id: movieId },
    });
    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite:", error.message);
    throw error;
  }
};

module.exports = {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
  isFavorite,
};
