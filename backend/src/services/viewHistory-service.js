const db = require("../models");

const getAllMovieUserTracking = async (userID) => {
  try {
    const viewHistory = await db.ViewHistory.findAll({
      where: {
        user_id: userID,
      },
      include: [
        {
          model: db.Movie,
          as: "movie",
          attributes: ["id", "title", "poster_url", "description"],
        },
      ],
    });
    return viewHistory;
  } catch (error) {
    console.error("Error getting tracking movie:", error);
    throw error;
  }
};

const create = async (userID, { movieId, position_sec }) => {
  const t = await db.sequelize.transaction();
  try {
    const [viewHistory, created] = await db.ViewHistory.findOrCreate({
      where: { user_id: userID, movie_id: movieId },
      defaults: {
        user_id: userID,
        movie_id: movieId,
        position_sec: position_sec,
      },
      transaction: t,
    });
    if (!created) {
      await t.rollback();
      return null;
    }
    await t.commit();
    return viewHistory;
  } catch (error) {
    await t.rollback();
    console.error("Error create history movie view:", error);
    throw error;
  }
};

const remove = async (userID, movieId) => {
  const t = await db.sequelize.transaction();
  try {
    await db.ViewHistory.destroy({
      where: { user_id: userID, movie_id: movieId },
      transaction: t, // gộp transaction vào đây
    });

    await t.commit(); // quan trọng
    return true;
  } catch (error) {
    await t.rollback();
    console.error("Error delete movie view:", error);
    throw error;
  }
};

module.exports = { create, getAllMovieUserTracking, remove };
