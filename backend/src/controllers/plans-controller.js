const plansService = require("../services/plans-service");
const { badRequest, notFound, internalServerError } = require("../middlewares/handleError");

// Lấy tất cả các plan
const getAllPlans = async (req, res) => {
  try {
    const plans = await plansService.getAllPlans();
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Lấy một plan theo id
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await plansService.getPlanById(id);
    if (!plan) return notFound("Plan not found", res);
    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Tạo plan mới
const createPlan = async (req, res) => {
  try {
    const planData = req.body;
    const newPlan = await plansService.createPlan(planData);
    return res.status(201).json({ success: true, message: "Plan created successfully", data: newPlan });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Cập nhật plan
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    const updatedPlan = await plansService.updatePlan(id, planData);
    return res.status(200).json({ success: true, message: "Plan updated successfully", data: updatedPlan });
  } catch (error) {
    if (error.message.includes("not found")) return notFound(error.message, res);
    return internalServerError(error.message, res);
  }
};

// Xóa plan
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await plansService.deletePlan(id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (error.message.includes("not found")) return notFound(error.message, res);
    return internalServerError(error.message, res);
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};