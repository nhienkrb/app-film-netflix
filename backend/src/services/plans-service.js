const db = require("../models");

// Lấy tất cả các plan
const getAllPlans = async () => {
  try {
    const plans = await db.Plan.findAll();
    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    throw error;
  }
};

// Lấy một plan theo id
const getPlanById = async (planId) => {
  try {
    const plan = await db.Plan.findByPk(planId);
    return plan;
  } catch (error) {
    console.error("Error fetching plan:", error.message);
    throw error;
  }
};

// Tạo plan mới
const createPlan = async (planData) => {
  const t = await db.sequelize.transaction();
  try {
    const newPlan = await db.Plan.create(planData, { transaction: t });
    await t.commit();
    return newPlan;
  } catch (error) {
    await t.rollback();
    console.error("Error creating plan:", error.message);
    throw error;
  }
};

// Cập nhật plan
const updatePlan = async (planId, planData) => {
  const t = await db.sequelize.transaction();
  try {
    const plan = await db.Plan.findByPk(planId, { transaction: t });
    if (!plan) throw new Error(`Plan with id ${planId} not found`);
    await plan.update(planData, { transaction: t });
    await t.commit();
    return plan;
  } catch (error) {
    await t.rollback();
    console.error("Error updating plan:", error.message);
    throw error;
  }
};

// Xóa plan
const deletePlan = async (planId) => {
  const t = await db.sequelize.transaction();
  try {
    const plan = await db.Plan.findByPk(planId, { transaction: t });
    if (!plan) throw new Error(`Plan with id ${planId} not found`);
    await plan.destroy({ transaction: t });
    await t.commit();
    return { message: "Plan deleted successfully" };
  } catch (error) {
    await t.rollback();
    console.error("Error deleting plan:", error.message);
    throw error;
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};