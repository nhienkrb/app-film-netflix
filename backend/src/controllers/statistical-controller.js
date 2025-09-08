const statisticalService = require("../services/statistical-service");

const getRevenue = async (req, res) => {
  try {
    const total = await statisticalService.getTotalRevenue();
    return res.status(200).json({ success: true, revenue: total });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
      return res.status(400).json({ success: false, message: "Invalid year parameter" });
    }
    const total = await statisticalService.getMonthlyRevenue(year);
    return res.status(200).json({ success: true, revenue: total });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const total = await statisticalService.getTopRatedMovies();
    return res.status(200).json({ success: true, revenue: total });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRevenue, getMonthlyRevenue, getTopRatedMovies };
