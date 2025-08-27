const profileService = require("../services/profile-service");
const {
  internalServerError,
  badRequest,
} = require("../middlewares/handleError");
const joi = require("joi");
const { maturity_level, name } = require("../helpers/joi_schema");
const schema = joi.object({
  maturity_level: maturity_level,
  name: name,
});

// Lấy tất cả profile
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await profileService.getAll();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy một profile theo id
const getProfile = async (req, res) => {
  try {
    const profile = await profileService.getOne(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo profile
const createProfile = async (req, res) => {
  const userId = await req.user.id;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const newProfile = await profileService.createProfile(req.body, userId);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật profile
const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await profileService.updateProfile(
      req.params.id,
      req.body
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa profile
const deleteProfile = async (req, res) => {
  try {
    const result = await profileService.deleteProfile(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};
