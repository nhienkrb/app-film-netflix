const db = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const getTotalRevenue = async () => {
  try {
    // Lấy tất cả subscription, join với plan để lấy giá
    const subscriptions = await db.Subscription.findAll({
      include: [{ model: db.Plan, as: "plan", attributes: ["price_per_month"] }]
    });

    // Tính tổng doanh thu
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      const price = Number(sub.plan?.price_per_month) || 0;
      return sum + price;
    }, 0);
    return totalRevenue;
  } catch (error) {
    console.error("Error calculating revenue:", error.message);
    throw error;
  }
};

// Doanh thu theo tháng
const getMonthlyRevenue = async (year) => {
  const result = await db.Subscription.findAll({
    attributes: [
      [db.sequelize.fn("MONTH", db.sequelize.col("start_at")), "month"],
      [db.sequelize.fn("SUM", db.sequelize.col("plan.price_per_month")), "revenue"]
    ],
    include: [{ model: db.Plan, as: "plan", attributes: [] }],
    where: db.sequelize.where(db.sequelize.fn("YEAR", db.sequelize.col("start_at")), year),
    group: ["month"]
  });
  return result;
};

// Top phim theo điểm đánh giá


const getTopRatedMovies = async (limit = 10) => {
  try {
    const result = await db.Movie.findAll({
      attributes: [
        "id",
        "title",
        "poster_url",
        [fn("AVG", col("ratings.stars")), "avg_rating"],
        [fn("COUNT", col("ratings.id")), "rating_count"],
      ],
      include: [
        {
          model: db.Rating,
          as: "ratings",
          attributes: [], // không lấy chi tiết rating
        },
      ],
      group: ["Movie.id", "Movie.title", "Movie.poster_url"],
      order: [[literal("avg_rating"), "DESC"]],
      limit,
      subQuery: false, // tránh bị nested query không cần thiết
    });

    return result;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};


module.exports = { getTotalRevenue ,getMonthlyRevenue, getTopRatedMovies};