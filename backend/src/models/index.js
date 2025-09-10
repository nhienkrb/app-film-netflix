'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development']; // đổi sang env nếu cần

// Kết nối DB
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Import models
const User = require('./user')(sequelize, DataTypes);
const Profile = require('./profile')(sequelize, DataTypes);
const Movie = require('./movie')(sequelize, DataTypes);
const Genre = require('./genre')(sequelize, DataTypes);
const MovieGenre = require('./movieGenre')(sequelize, DataTypes);
const MediaAsset = require('./mediaAsset')(sequelize, DataTypes);
const Rating = require('./rating')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes);
const Favorite = require('./favorite')(sequelize, DataTypes);
const ViewHistory = require('./viewHistory')(sequelize, DataTypes);
const Plan = require('./plan')(sequelize, DataTypes);
const Subscription = require('./subscription')(sequelize, DataTypes);

// ================= Associations =================

// User – Profile (1-n)
User.hasMany(Profile, { foreignKey: 'user_id' ,as: "profile"});
Profile.belongsTo(User, { foreignKey: 'user_id', as: "user" });

// Movie – Genre (n-n),
Movie.belongsToMany(Genre, { through: MovieGenre, foreignKey: 'movie_id' , as:"genres"});
Genre.belongsToMany(Movie, { through: MovieGenre, foreignKey: 'genre_id', as:"movies" });

// Movie – MediaAsset (1-n)
Movie.hasMany(MediaAsset, { foreignKey: 'movie_id' , as: "mediaAsset" });
MediaAsset.belongsTo(Movie, { foreignKey: 'movie_id',  as: "movie"  });

// Movie – Rating (1-n)
Movie.hasMany(Rating, { foreignKey: 'movie_id' ,as:"ratings"});
Rating.belongsTo(Movie, { foreignKey: 'movie_id',as:"movie" });

// User – Rating (1-n)
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

// Movie – Comment (1-n)
Movie.hasMany(Comment, { foreignKey: 'movie_id' });
Comment.belongsTo(Movie, { foreignKey: 'movie_id' });

// User – Comment (1-n)
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// User – Favorite – Movie (n-n)
User.belongsToMany(Movie, { through: Favorite, foreignKey: 'user_id', otherKey: 'movie_id', as: "favoriteMovies" });
Movie.belongsToMany(User, { through: Favorite, foreignKey: 'movie_id', otherKey: 'user_id', as: "favoritedByUsers" });

Favorite.belongsTo(Movie, { foreignKey: 'movie_id', as: "movie" });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: "user" });

// User – ViewHistory (1-n)
User.hasMany(ViewHistory, { foreignKey: 'user_id' });
ViewHistory.belongsTo(User, { foreignKey: 'user_id' });

// Movie – ViewHistory (1-n)
Movie.hasMany(ViewHistory, { foreignKey: 'movie_id'  ,as: "viewHistory"});
ViewHistory.belongsTo(Movie, { foreignKey: 'movie_id' ,as: "movie"});

// Plan – Subscription (1-n)
Plan.hasMany(Subscription, { foreignKey: 'plan_id' ,as: "subscriptions" });
Subscription.belongsTo(Plan, { foreignKey: 'plan_id' , as: "plan" });

// User – Subscription (1-n)
User.hasMany(Subscription, { foreignKey: 'user_id',as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: 'user_id',as:"user" });

// ================= Export =================
const db = {
  sequelize,
  Sequelize,
  User,
  Profile,
  Movie,
  Genre,
  MovieGenre,
  MediaAsset,
  Rating,
  Comment,
  Favorite,
  ViewHistory,
  Plan,
  Subscription,
};

module.exports = db;
