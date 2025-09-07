const subscriptionService = require("../services/subscription-service");
const { badRequest, notFound, internalServerError } = require("../middlewares/handleError");

// Lấy tất cả subscription
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    return res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Lấy subscription theo id
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await subscriptionService.getSubscriptionById(id);
    if (!subscription) return notFound("Subscription not found", res);
    return res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Tạo subscription mới
const createSubscription = async (req, res) => {
  try {
    const data = req.body;
    const newSubscription = await subscriptionService.createSubscription(data);
    return res.status(201).json({ success: true, message: "Subscription created successfully", data: newSubscription });
  } catch (error) {
    return internalServerError(error.message, res);
  }
};

// Cập nhật subscription
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedSubscription = await subscriptionService.updateSubscription(id, data);
    return res.status(200).json({ success: true, message: "Subscription updated successfully", data: updatedSubscription });
  } catch (error) {
    if (error.message.includes("not found")) return notFound(error.message, res);
    return internalServerError(error.message, res);
  }
};

// Xóa subscription
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await subscriptionService.deleteSubscription(id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (error.message.includes("not found")) return notFound(error.message, res);
    return internalServerError(error.message, res);
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};