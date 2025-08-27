const db = require("../models");
const maturityEnum = require("../enums/maturity");

// Lấy một profile theo id
const getOne = async (profileId) => {
  try {
    const profile = await db.Profile.findOne({
      where: { id: profileId },
      include: [{ model: db.User, as: "user" }],
    });
    return profile ? profile : "";
  } catch (error) {
    console.error("Error fetching profile:", error.message);
  }
};

// Lấy tất cả profile
const getAll = async () => {
  try {
    const profiles = await db.Profile.findAll({
      include: [{ model: db.User, as: "user" }],
    });
    return profiles;
  } catch (error) {
    console.error("Error fetching profiles at getAll profile-service.js:", error.message);
  }
};

// Xóa profile
const deleteProfile = async (profileId) => {
  const t = await db.sequelize.transaction();
  try {
    const profile = await db.Profile.findByPk(profileId, { transaction: t });
    if (!profile) {
      await t.rollback();
      throw new Error(`Profile with id ${profileId} not found`);
    }

    await profile.destroy({ transaction: t });
    await t.commit();

    return { message: "Profile deleted successfully" };
  } catch (error) {
    await t.rollback();
    console.error("Error at deleteProfile profile-service.js:", error.message);
    throw error;
  }
};

// Tạo profile
const createProfile = async (profileData,userID) => {
  const t = await db.sequelize.transaction();

  try {
    const user_id = userID;
    const newProfile = await db.Profile.create({user_id:user_id,name:profileData.name,maturity_level:profileData.maturity_level}, { transaction: t });
    await t.commit();
    return newProfile;
  } catch (error) {
    await t.rollback();
    console.error("Error at createProfile profile-service.js:", error.message);
    throw error;
  }
};

// Cập nhật profile
const updateProfile = async (profileId, profileData) => {
  const t = await db.sequelize.transaction();
  try {
    // Kiểm tra giá trị maturity nếu có truyền vào
    if (profileData.maturity && !Object.values(maturityEnum.MaturityLevelEnum).includes(profileData.maturity)) {
      await t.rollback();
      throw new Error(`Maturity value '${profileData.maturity}' is invalid`);
    }

    const profile = await db.Profile.findByPk(profileId, { transaction: t });
    if (!profile) {
      await t.rollback();
      throw new Error(`Profile with id ${profileId} not found`);
    }

    await profile.update(profileData, { transaction: t });
    await t.commit();

    return profile;
  } catch (error) {
    await t.rollback();
    console.error("Error at updateProfile profile-service.js:", error.message);
    throw error;
  }
};
module.exports = { getOne, getAll, deleteProfile, createProfile, updateProfile };