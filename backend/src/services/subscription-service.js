const db = require("../models");

// Lấy tất cả subscription
const getAllSubscriptions = async () => {
  try {
    const subscriptions = await db.Subscription.findAll({
      include: [
        { model: db.User, as: "user" },
        { model: db.Plan, as: "plan" }
      ]
    });
    return subscriptions;
  } catch (error) {
    console.error("Error fetching subscriptions:", error.message);
    throw error;
  }
};

// Lấy subscription theo id
const getSubscriptionById = async (id) => {
  try {
    const subscription = await db.Subscription.findByPk(id, {
      include: [
        { model: db.User, as: "user" },
        { model: db.Plan, as: "plan" }
      ]
    });
    return subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error.message);
    throw error;
  }
};

// Tạo subscription mới
const createSubscription = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const newSubscription = await db.Subscription.create(data, { transaction: t });
    await t.commit();
    return newSubscription;
  } catch (error) {
    await t.rollback();
    console.error("Error creating subscription:", error.message);
    throw error;
  }
};

// Cập nhật subscription
const updateSubscription = async (id, data) => {
  const t = await db.sequelize.transaction();
  try {
    const subscription = await db.Subscription.findByPk(id, { transaction: t });
    if (!subscription) throw new Error(`Subscription with id ${id} not found`);
    await subscription.update(data, { transaction: t });
    await t.commit();
    return subscription;
  } catch (error) {
    await t.rollback();
    console.error("Error updating subscription:", error.message);
    throw error;
  }
};

// Xóa subscription
const deleteSubscription = async (id) => {
  const t = await db.sequelize.transaction();
  try {
    const subscription = await db.Subscription.findByPk(id, { transaction: t });
    if (!subscription) throw new Error(`Subscription with id ${id} not found`);
    await subscription.destroy({ transaction: t });
    await t.commit();
    return { message: "Subscription deleted successfully" };
  } catch (error) {
    await t.rollback();
    console.error("Error deleting subscription:", error.message);
    throw error;
  }
};
module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};