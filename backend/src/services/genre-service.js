const db = require("../models");
const maturityEnum = require("../enums/maturity");

const getOne = async (genreId) => {
  try {
    const genre = await db.Genre.findOne({
      where: { id: genreId },
    });
    return genre ? genre : null;
  } catch (error) {
    console.error("Error fetching genre:", error.message);
  }
};

const getAll = async () => {
  try {
    const genres = await db.Genre.findAll();
    return genres;
  } catch (error) {
    console.error(
      "Error fetching genres at getAll genres-service.js:",
      error.message
    );
  }
};

const deleteGenre = async (genreId) => {
  const t = await db.sequelize.transaction();
  try {
    const genre = await db.Genre.findByPk(genreId, { transaction: t });
    if (!genre) {
      await t.rollback();
      throw new Error(`genre with id ${genreId} not found`);
    }

    await genre.destroy({ transaction: t });
    await t.commit();

    return { message: "Genre deleted successfully" };
  } catch (error) {
    await t.rollback();
    console.error("Error at deleteProfile genre-service.js:", error.message);
    throw error;
  }
};

const createGenre = async (genreData) => {
  const t = await db.sequelize.transaction();

  try {
    const genre = await db.Genre.create(
      {
        name: genreData.name,
      },
      { transaction: t }
    );
    await t.commit();
    return genre;
  } catch (error) {
    await t.rollback();
    console.error("Error at createGenre genre-service.js:", error.message);
    throw error;
  }
};

const updateGenre = async (genreId, genreData) => {
  const t = await db.sequelize.transaction();
  try {
    const genre = await db.Genre.findByPk(genreId, { transaction: t });
    if (!genre) {
      await t.rollback();
      throw new Error(`Genre with id ${genreId} not found`);
    }
    await genre.update(genreData, { transaction: t });
    await t.commit();

    return genre;
  } catch (error) {
    await t.rollback();
    console.error("Error at updateProfile genre-service.js:", error.message);
    throw error;
  }
};
module.exports = {
  getOne,
  getAll,
  deleteGenre,
  createGenre,
  updateGenre,
};
