const favoriteService = require("../services/favorite-service");
const { badRequest, notFound, internalServerError } = require("../middlewares/handleError");

// Lấy tất cả phim yêu thích của một user
const getFavoritesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favorites = await favoriteService.getFavoritesByUser(userId);
    return res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Thêm phim vào danh sách yêu thích
const addFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const favorite = await favoriteService.addFavorite(userId, movieId);
    return res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Xóa phim khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const result = await favoriteService.removeFavorite(userId, movieId);
    if (!result) return notFound("Favorite not found", res);
    return res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Kiểm tra phim đã được yêu thích chưa
const isFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.query;
    const result = await favoriteService.isFavorite(userId, movieId);
    return res.status(200).json({ success: true, isFavorite: result });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

module.exports = {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
  isFavorite,
};