CREATE DATABASE  IF NOT EXISTS `cinehub_lite` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cinehub_lite`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: cinehub_lite
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('visible','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visible',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `movie_id` (`movie_id`,`created_at`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1213,7,'Loved the scale and score','visible','2025-09-10 13:55:13'),(2,1209,8,'Perfect finale energy','visible','2025-09-10 13:55:13'),(3,1212,9,'Nolan at his most mature','visible','2025-09-10 13:55:13'),(4,1206,10,'Heartbreaking story','visible','2025-09-10 13:55:13'),(5,1222,11,'Halo jump scene = insane','visible','2025-09-10 13:55:13');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`movie_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,1203,'2025-09-13 03:17:47'),(1,1205,'2025-09-13 03:17:52'),(7,1213,'2025-09-10 13:54:50'),(7,1214,'2025-09-10 13:54:50'),(7,1217,'2025-09-10 13:54:50'),(8,1209,'2025-09-10 13:54:50'),(8,1210,'2025-09-10 13:54:50'),(8,1220,'2025-09-10 13:54:50'),(9,1211,'2025-09-10 13:54:50'),(9,1212,'2025-09-10 13:54:50'),(9,1219,'2025-09-10 13:54:50'),(10,1205,'2025-09-10 13:54:50'),(10,1206,'2025-09-10 13:54:50'),(10,1221,'2025-09-10 13:54:50'),(11,1207,'2025-09-10 13:54:50'),(11,1208,'2025-09-10 13:54:50'),(11,1222,'2025-09-10 13:54:50');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (4,'Action'),(5,'Adventure'),(6,'Animation'),(2,'CN Animation'),(7,'Comedy'),(8,'Crime'),(9,'Documentary'),(10,'Drama'),(11,'Family'),(12,'Fantasy'),(13,'History'),(14,'Horror'),(3,'Magic'),(15,'Music'),(16,'Mystery'),(17,'Romance'),(18,'Sci-Fi'),(19,'Thriller'),(20,'War'),(21,'Western');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_assets`
--

DROP TABLE IF EXISTS `media_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_assets` (
  `movie_id` int NOT NULL,
  `type` enum('trailer','full') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quality` enum('SD','HD','FHD','UHD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HD',
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `public_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`public_id`),
  KEY `movie_id` (`movie_id`,`type`),
  CONSTRAINT `media_assets_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_assets`
--

LOCK TABLES `media_assets` WRITE;
/*!40000 ALTER TABLE `media_assets` DISABLE KEYS */;
INSERT INTO `media_assets` VALUES (1251,'full','FHD','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','2025-09-12 14:13:48','full-1251'),(1252,'full','FHD','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','2025-09-12 14:22:23','full-1252'),(1263,'full','HD','https://res.cloudinary.com/di75bh7dh/video/upload/v1757694676/movies/videos/full/i8jwfw0pdtoynpg2sapn.mp4','2025-09-12 16:31:18','movies/videos/full/i8jwfw0pdtoynpg2sapn'),(1266,'full','HD','https://res.cloudinary.com/di75bh7dh/video/upload/v1757729813/movies/videos/full/oiwnrnjjgmyreagsmgwq.mp4','2025-09-13 02:16:53','movies/videos/full/oiwnrnjjgmyreagsmgwq'),(1268,'full','FHD','https://res.cloudinary.com/di75bh7dh/video/upload/v1757731993/movies/videos/full/zou5zbw4btb53v25aptc.mp4','2025-09-13 02:53:13','movies/videos/full/zou5zbw4btb53v25aptc'),(1264,'trailer','HD','https://res.cloudinary.com/di75bh7dh/video/upload/v1757727205/movies/videos/trailer/vfnswloc3cjfsbxevzb8.mp4','2025-09-13 01:33:26','movies/videos/trailer/vfnswloc3cjfsbxevzb8'),(1203,'trailer','HD','https://www.youtube.com/watch?v=_PZpmTj1Q8Q','2025-09-10 13:51:56','yt-1203'),(1204,'trailer','HD','https://www.youtube.com/watch?v=vKQi3bBA1y8','2025-09-10 13:51:56','yt-1204'),(1205,'trailer','HD','https://www.youtube.com/watch?v=ffu-pfqD7BI','2025-09-10 13:51:56','yt-1205'),(1206,'trailer','HD','https://www.youtube.com/watch?v=cIJ8ma0kKtY','2025-09-10 13:51:56','yt-1206'),(1207,'trailer','HD','https://www.youtube.com/watch?v=eOrNdBpGMv8','2025-09-10 13:51:56','yt-1207'),(1208,'trailer','HD','https://www.youtube.com/watch?v=6ZfuNTqbHE8','2025-09-10 13:51:56','yt-1208'),(1209,'trailer','HD','https://www.youtube.com/watch?v=TcMBFSGVi1c','2025-09-10 13:51:56','yt-1209'),(1210,'trailer','HD','https://www.youtube.com/watch?v=JfVOs4VSpmA','2025-09-10 13:51:56','yt-1210'),(1211,'trailer','HD','https://www.youtube.com/watch?v=xRjvmVaFHkk','2025-09-10 13:51:56','yt-1211'),(1212,'trailer','HD','https://www.youtube.com/watch?v=2CXFpWTxS3M','2025-09-10 13:51:56','yt-1212'),(1213,'trailer','HD','https://www.youtube.com/watch?v=n9xhJrPXop4','2025-09-10 13:51:56','yt-1213'),(1214,'trailer','HD','https://www.youtube.com/watch?v=Way9Dexny3w','2025-09-10 13:51:56','yt-1214'),(1215,'trailer','HD','https://www.youtube.com/watch?v=g8evyE9TuYk','2025-09-10 13:51:56','yt-1215'),(1216,'trailer','HD','https://www.youtube.com/watch?v=nNpvWBuTfrc','2025-09-10 13:51:56','yt-1216'),(1217,'trailer','HD','https://www.youtube.com/watch?v=d96cjJhvlMA','2025-09-10 13:51:56','yt-1217'),(1218,'trailer','HD','https://www.youtube.com/watch?v=hEJnMQG9ev8','2025-09-10 13:51:56','yt-1218'),(1219,'trailer','HD','https://www.youtube.com/watch?v=gCcx85zbxz4','2025-09-10 13:51:56','yt-1219'),(1220,'trailer','HD','https://www.youtube.com/watch?v=mqqft2x_Aa4','2025-09-10 13:51:56','yt-1220'),(1221,'trailer','HD','https://www.youtube.com/watch?v=giXco2jaZ_4','2025-09-10 13:51:56','yt-1221'),(1222,'trailer','HD','https://www.youtube.com/watch?v=wb49-oV0F78','2025-09-10 13:51:56','yt-1222'),(1223,'trailer','HD','https://www.youtube.com/watch?v=2AUmvWm5ZDQ','2025-09-10 13:51:56','yt-1223'),(1224,'trailer','HD','https://www.youtube.com/watch?v=xU47nhruN-Q','2025-09-10 13:51:56','yt-1224'),(1225,'trailer','HD','https://www.youtube.com/watch?v=V75dMMIW2B4','2025-09-10 13:59:05','yt-1225'),(1226,'trailer','HD','https://www.youtube.com/watch?v=LbfMDwc4azU','2025-09-10 13:59:05','yt-1226'),(1227,'trailer','HD','https://www.youtube.com/watch?v=r5X-hFf6Bwo','2025-09-10 13:59:05','yt-1227'),(1228,'trailer','HD','https://www.youtube.com/watch?v=VyHV0BRtdxo','2025-09-10 13:59:05','yt-1228'),(1229,'trailer','HD','https://www.youtube.com/watch?v=1bq0qff4iF8','2025-09-10 13:59:05','yt-1229'),(1230,'trailer','HD','https://www.youtube.com/watch?v=lAxgztbYDbs','2025-09-10 13:59:05','yt-1230'),(1231,'trailer','HD','https://www.youtube.com/watch?v=sGbxmsDFVnE','2025-09-10 13:59:05','yt-1231'),(1232,'trailer','HD','https://www.youtube.com/watch?v=frdj1zb9sMY','2025-09-10 13:59:05','yt-1232'),(1233,'trailer','HD','https://www.youtube.com/watch?v=Q0CbN8sfihY','2025-09-10 13:59:05','yt-1233'),(1234,'trailer','HD','https://www.youtube.com/watch?v=QWBKEmWWL38','2025-09-10 13:59:05','yt-1234'),(1235,'trailer','HD','https://www.youtube.com/watch?v=lH5FD_xgi0I','2025-09-10 13:59:05','yt-1235'),(1236,'trailer','HD','https://www.youtube.com/watch?v=RFinNxS5KN4','2025-09-10 13:59:05','yt-1236'),(1237,'trailer','HD','https://www.youtube.com/watch?v=Ny_hRfvsmU8','2025-09-10 13:59:05','yt-1237'),(1238,'trailer','HD','https://www.youtube.com/watch?v=2zLkasScy7A','2025-09-10 13:59:05','yt-1238'),(1239,'trailer','HD','https://www.youtube.com/watch?v=seMwpP0yeu4','2025-09-10 13:59:05','yt-1239'),(1240,'trailer','HD','https://www.youtube.com/watch?v=bLvqoHBptjg','2025-09-10 13:59:05','yt-1240'),(1241,'trailer','HD','https://www.youtube.com/watch?v=NmzuHjWmXOc','2025-09-10 13:59:05','yt-1241'),(1242,'trailer','HD','https://www.youtube.com/watch?v=owK1qxDselE','2025-09-10 13:59:05','yt-1242'),(1243,'trailer','HD','https://www.youtube.com/watch?v=k10ETZ41q5o','2025-09-10 13:59:05','yt-1243'),(1244,'trailer','HD','https://www.youtube.com/watch?v=FnCdOQsX5kc','2025-09-10 13:59:05','yt-1244'),(1245,'trailer','HD','https://www.youtube.com/watch?v=DzfpyUB60YY','2025-09-10 13:59:05','yt-1245'),(1246,'trailer','HD','https://www.youtube.com/watch?v=ByXuk9QqQkk','2025-09-10 13:59:05','yt-1246'),(1247,'trailer','HD','https://www.youtube.com/watch?v=bFwdl2PDAFM','2025-09-10 13:59:05','yt-1247'),(1248,'trailer','HD','https://www.youtube.com/watch?v=6MimqR7S6XM','2025-09-10 13:59:05','yt-1248'),(1251,'trailer','FHD','https://www.youtube.com/watch?v=6MimqR7S6XM','2025-09-12 14:13:48','yt-1251'),(1252,'trailer','FHD','https://www.youtube.com/watch?v=6MimqR7S6XM','2025-09-12 14:22:23','yt-1252');
/*!40000 ALTER TABLE `media_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genres`
--

DROP TABLE IF EXISTS `movie_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genres` (
  `movie_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`movie_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genres`
--

LOCK TABLES `movie_genres` WRITE;
/*!40000 ALTER TABLE `movie_genres` DISABLE KEYS */;
INSERT INTO `movie_genres` VALUES (1203,4),(1204,4),(1207,4),(1208,4),(1209,4),(1211,4),(1212,4),(1213,4),(1214,4),(1216,4),(1218,4),(1219,4),(1220,4),(1222,4),(1223,4),(1242,4),(1247,4),(1250,4),(1260,4),(1263,4),(1264,4),(1265,4),(1266,4),(1205,5),(1213,5),(1214,5),(1217,5),(1221,5),(1225,5),(1226,5),(1227,5),(1231,5),(1233,5),(1234,5),(1235,5),(1236,5),(1267,5),(1237,6),(1238,6),(1239,6),(1246,6),(1247,6),(1248,6),(1217,7),(1241,8),(1268,8),(1206,10),(1211,10),(1212,10),(1224,10),(1240,10),(1241,10),(1242,10),(1217,11),(1228,11),(1229,11),(1230,11),(1237,11),(1238,11),(1239,11),(1225,12),(1226,12),(1227,12),(1228,12),(1229,12),(1230,12),(1246,12),(1248,12),(1243,14),(1244,14),(1245,14),(1243,16),(1245,16),(1206,17),(1224,17),(1240,17),(1203,18),(1204,18),(1207,18),(1208,18),(1209,18),(1211,18),(1212,18),(1213,18),(1214,18),(1216,18),(1218,18),(1219,18),(1220,18),(1222,18),(1223,18),(1231,18),(1232,18),(1233,18),(1234,18),(1235,18),(1236,18),(1269,18),(1244,19),(1232,20);
/*!40000 ALTER TABLE `movie_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration_min` int DEFAULT NULL,
  `release_year` int DEFAULT NULL,
  `poster_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age_rating` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avg_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `link_ytb` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `public_id_poster` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `release_year` (`release_year`),
  FULLTEXT KEY `ft_title_desc` (`title`,`description`)
) ENGINE=InnoDB AUTO_INCREMENT=1270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1203,'The Dark Knight','Batman vs. Joker in Gotham',152,2008,'https://img.youtube.com/vi/_PZpmTj1Q8Q/hqdefault.jpg','PG-13',4.00,'2025-09-10 13:51:00','2025-09-10 13:59:05','https://www.youtube.com/watch?v=_PZpmTj1Q8Q',NULL,1003),(1204,'Updated Title123','Updated Description',162,2009,'https://img.youtube.com/vi/vKQi3bBA1y8/hqdefault.jpg','G',0.00,'2025-09-10 13:51:00','2025-09-12 16:45:01','https://www.youtube.com/watch?v=8hP9D6kZseM',NULL,1004),(1205,'Updated Title','Updated Description',162,2009,'https://img.youtube.com/vi/ffu-pfqD7BI/hqdefault.jpg','G',0.00,'2025-09-10 13:51:00','2025-09-13 01:34:31','https://www.youtube.com/watch?v=ffu-pfqD7BI',NULL,1005),(1206,'Avatar (Updated)','Pandora & the Na’vi (Updated)',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757690108/movies/posters/lp30tbvckadtf7yqst8c.jpg','PG-13',5.00,'2025-09-10 13:51:00','2025-09-12 15:15:05','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/lp30tbvckadtf7yqst8c',1006),(1207,'Updated Title123','Updated Description',162,2009,'https://img.youtube.com/vi/eOrNdBpGMv8/hqdefault.jpg','G',0.00,'2025-09-10 13:51:00','2025-09-13 01:48:14','https://www.youtube.com/watch?v=8hP9D6kZseM',NULL,1007),(1208,'Avengers: Infinity War','Thanos seeks the Stones',149,2018,'https://img.youtube.com/vi/6ZfuNTqbHE8/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=6ZfuNTqbHE8',NULL,1008),(1209,'Avengers: Endgame','Whatever it takes',181,2019,'https://img.youtube.com/vi/TcMBFSGVi1c/hqdefault.jpg','PG-13',5.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=TcMBFSGVi1c',NULL,1009),(1210,'Spider-Man: No Way Home','The Multiverse unleashed',148,2021,'https://img.youtube.com/vi/JfVOs4VSpmA/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=JfVOs4VSpmA',NULL,1010),(1211,'Joker','Origin of a notorious villain',122,2019,'https://img.youtube.com/vi/xRjvmVaFHkk/hqdefault.jpg','R',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=xRjvmVaFHkk',NULL,1011),(1212,'Oppenheimer','The father of the atomic bomb',180,2023,'https://img.youtube.com/vi/2CXFpWTxS3M/hqdefault.jpg','R',4.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=2CXFpWTxS3M',NULL,1012),(1213,'Dune (2021)','The spice must flow',155,2021,'https://img.youtube.com/vi/n9xhJrPXop4/hqdefault.jpg','PG-13',5.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=n9xhJrPXop4',NULL,1013),(1214,'Dune: Part Two','Paul Atreides rises',166,2024,'https://img.youtube.com/vi/Way9Dexny3w/hqdefault.jpg','PG-13',5.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=Way9Dexny3w',NULL,1014),(1215,'The Dark Knight Rises','The legend ends',164,2012,'https://img.youtube.com/vi/g8evyE9TuYk/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=g8evyE9TuYk',NULL,1015),(1216,'The Matrix Resurrections','Return to the Matrix',148,2021,'https://img.youtube.com/vi/nNpvWBuTfrc/hqdefault.jpg','R',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=nNpvWBuTfrc',NULL,1016),(1217,'Guardians of the Galaxy','A ragtag space crew',121,2014,'https://img.youtube.com/vi/d96cjJhvlMA/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=d96cjJhvlMA',NULL,1017),(1218,'Mad Max: Fury Road','High-octane wasteland chase',120,2015,'https://img.youtube.com/vi/hEJnMQG9ev8/hqdefault.jpg','R',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=hEJnMQG9ev8',NULL,1018),(1219,'Blade Runner 2049','Bioengineers & replicants',164,2017,'https://img.youtube.com/vi/gCcx85zbxz4/hqdefault.jpg','R',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=gCcx85zbxz4',NULL,1019),(1220,'The Batman (2022)','The World’s Greatest Detective',176,2022,'https://img.youtube.com/vi/mqqft2x_Aa4/hqdefault.jpg','PG-13',4.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=mqqft2x_Aa4',NULL,1020),(1221,'Top Gun: Maverick','Return to the danger zone',130,2022,'https://img.youtube.com/vi/giXco2jaZ_4/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=giXco2jaZ_4',NULL,1021),(1222,'Mission: Impossible – Fallout','Ethan Hunt vs. Walker',147,2018,'https://img.youtube.com/vi/wb49-oV0F78/hqdefault.jpg','PG-13',4.00,'2025-09-10 13:51:00','2025-09-10 13:55:29','https://www.youtube.com/watch?v=wb49-oV0F78',NULL,1022),(1223,'John Wick','They took his car…',101,2014,'https://img.youtube.com/vi/2AUmvWm5ZDQ/hqdefault.jpg','R',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=2AUmvWm5ZDQ',NULL,1023),(1224,'Your Name. (Kimi no Na wa)','Body-swap romance/fantasy',106,2016,'https://img.youtube.com/vi/xU47nhruN-Q/hqdefault.jpg','PG',0.00,'2025-09-10 13:51:00','2025-09-10 13:51:00','https://www.youtube.com/watch?v=xU47nhruN-Q',NULL,1024),(1225,'The Lord of the Rings: The Fellowship of the Ring','Journey of the One Ring begins',178,2001,'https://img.youtube.com/vi/V75dMMIW2B4/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=V75dMMIW2B4',NULL,0),(1226,'The Lord of the Rings: The Two Towers','The battle for Middle-earth continues',179,2002,'https://img.youtube.com/vi/LbfMDwc4azU/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=LbfMDwc4azU',NULL,0),(1227,'The Lord of the Rings: The Return of the King','The fate of Middle-earth',201,2003,'https://img.youtube.com/vi/r5X-hFf6Bwo/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=r5X-hFf6Bwo',NULL,0),(1228,'Harry Potter and the Sorcerer\'s Stone','Welcome to Hogwarts',152,2001,'https://img.youtube.com/vi/VyHV0BRtdxo/hqdefault.jpg','PG',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=VyHV0BRtdxo',NULL,0),(1229,'Harry Potter and the Chamber of Secrets','The Heir of Slytherin',161,2002,'https://img.youtube.com/vi/1bq0qff4iF8/hqdefault.jpg','PG',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=1bq0qff4iF8',NULL,0),(1230,'Harry Potter and the Prisoner of Azkaban','Azkaban escapee Sirius Black',142,2004,'https://img.youtube.com/vi/lAxgztbYDbs/hqdefault.jpg','PG',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=lAxgztbYDbs',NULL,0),(1231,'Star Wars: The Force Awakens','A new generation rises',138,2015,'https://img.youtube.com/vi/sGbxmsDFVnE/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=sGbxmsDFVnE',NULL,0),(1232,'Rogue One: A Star Wars Story','Stealing Death Star plans',134,2016,'https://img.youtube.com/vi/frdj1zb9sMY/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=frdj1zb9sMY',NULL,0),(1233,'Star Wars: The Last Jedi','The spark that will light the fire',152,2017,'https://img.youtube.com/vi/Q0CbN8sfihY/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=Q0CbN8sfihY',NULL,0),(1234,'Jurassic Park','Dinosaurs unleashed',127,1993,'https://img.youtube.com/vi/QWBKEmWWL38/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=QWBKEmWWL38',NULL,0),(1235,'The Lost World: Jurassic Park','Return to Isla Sorna',129,1997,'https://img.youtube.com/vi/lH5FD_xgi0I/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=lH5FD_xgi0I',NULL,0),(1236,'Jurassic World','Bigger. Louder. More Teeth.',124,2015,'https://img.youtube.com/vi/RFinNxS5KN4/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=RFinNxS5KN4',NULL,0),(1237,'Toy Story','To infinity and beyond',81,1995,'https://img.youtube.com/vi/Ny_hRfvsmU8/hqdefault.jpg','G',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=Ny_hRfvsmU8',NULL,0),(1238,'Finding Nemo','Just keep swimming',100,2003,'https://img.youtube.com/vi/2zLkasScy7A/hqdefault.jpg','G',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=2zLkasScy7A',NULL,0),(1239,'Inside Out','Meet the little voices inside your head',95,2015,'https://img.youtube.com/vi/seMwpP0yeu4/hqdefault.jpg','PG',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=seMwpP0yeu4',NULL,0),(1240,'Forrest Gump','Life is like a box of chocolates',142,1994,'https://img.youtube.com/vi/bLvqoHBptjg/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=bLvqoHBptjg',NULL,0),(1241,'The Shawshank Redemption','Hope is a dangerous thing',142,1995,'https://img.youtube.com/vi/NmzuHjWmXOc/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 07:06:10','https://www.youtube.com/watch?v=NmzuHjWmXOc',NULL,0),(1242,'Gladiator','Are you not entertained?',155,2000,'https://img.youtube.com/vi/owK1qxDselE/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=owK1qxDselE',NULL,0),(1243,'The Conjuring','Based on the Warrens\' case files',112,2013,'https://img.youtube.com/vi/k10ETZ41q5o/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=k10ETZ41q5o',NULL,0),(1244,'It (2017)','You\'ll float too',135,2017,'https://img.youtube.com/vi/FnCdOQsX5kc/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=FnCdOQsX5kc',NULL,0),(1245,'Get Out','A mind-twisting social thriller',104,2017,'https://img.youtube.com/vi/DzfpyUB60YY/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=DzfpyUB60YY',NULL,0),(1246,'Spirited Away','Chihiro in the spirit world',125,2001,'https://img.youtube.com/vi/ByXuk9QqQkk/hqdefault.jpg','PG',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=ByXuk9QqQkk',NULL,0),(1247,'Demon Slayer: Mugen Train','Infinity Train arc',117,2020,'https://img.youtube.com/vi/bFwdl2PDAFM/hqdefault.jpg','R',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=bFwdl2PDAFM',NULL,0),(1248,'Suzume','Doors across Japan',122,2022,'https://img.youtube.com/vi/6MimqR7S6XM/hqdefault.jpg','PG-13',0.00,'2025-09-10 13:59:05','2025-09-10 13:59:05','https://www.youtube.com/watch?v=6MimqR7S6XM',NULL,0),(1250,'Avatar','Pandora & the Na’vi',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757666806/movies/posters/rmbl39r7y5xbxkcb3f6b.jpg','PG-13',0.00,'2025-09-12 08:46:43','2025-09-12 08:46:43','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/rmbl39r7y5xbxkcb3f6b',0),(1251,'Suzume','Doors across Japan',122,2022,'https://img.youtube.com/vi/6MimqR7S6XM/hqdefault.jpg','PG-13',0.00,'2025-09-12 14:13:48','2025-09-12 14:13:48','https://www.youtube.com/watch?v=6MimqR7S6XM',NULL,0),(1252,'Suzume','Doors across Japan',122,2022,'https://img.youtube.com/vi/6MimqR7S6XM/hqdefault.jpg','PG-13',0.00,'2025-09-12 14:22:23','2025-09-12 14:22:23','https://www.youtube.com/watch?v=6MimqR7S6XM',NULL,0),(1260,'Updated Title1234','Updated Description2',164,2002,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757688535/movies/posters/cd06vtbnss217vxrerie.png','G',0.00,'2025-09-12 14:48:52','2025-09-12 16:32:21','https://www.youtube.com/watch?v=8hP9D6kZseM','movies/posters/cd06vtbnss217vxrerie',0),(1263,'Avatar111','Pandora & the Na’vi',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757694673/movies/posters/yutr5dxrupcshoo4vo8r.png','PG-13',0.00,'2025-09-12 16:31:13','2025-09-12 16:31:13','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/yutr5dxrupcshoo4vo8r',0),(1264,'Avatar','Pandora & the Na’vi',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757727202/movies/posters/tnjxpz56kc4zwvnzd9a0.png','PG-13',0.00,'2025-09-13 01:33:22','2025-09-13 01:33:22','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/tnjxpz56kc4zwvnzd9a0',0),(1265,'Avatar1','Pandora & the Na’vi',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757729793/movies/posters/h8ciqhnuwjynm4rk02vv.png','PG-13',0.00,'2025-09-13 02:16:32','2025-09-13 02:16:32','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/h8ciqhnuwjynm4rk02vv',0),(1266,'Updated Title123','Updated Description',162,2009,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757729888/movies/posters/erppsmonrkj6pwxvbkhi.png','G',0.00,'2025-09-13 02:16:50','2025-09-13 02:18:08','https://www.youtube.com/watch?v=8hP9D6kZseM','movies/posters/erppsmonrkj6pwxvbkhi',0),(1267,'adsasas','ádasda',111,1900,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757731246/movies/posters/dudi2wp4kdzjvhks9fdf.png','PG',0.00,'2025-09-13 02:40:23','2025-09-13 02:40:46','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/dudi2wp4kdzjvhks9fdf',0),(1268,'abc','11111',111,1111,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757731988/movies/posters/fecnbxh3ddlqpzdxy9hu.png','G',0.00,'2025-09-13 02:53:08','2025-09-13 02:53:08','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/fecnbxh3ddlqpzdxy9hu',0),(1269,'Á','111',111,111,'https://res.cloudinary.com/di75bh7dh/image/upload/v1757732046/movies/posters/cabn8najufzg8rc5tsb5.png','G',0.00,'2025-09-13 02:54:05','2025-09-13 02:54:05','https://www.youtube.com/watch?v=ffu-pfqD7BI','movies/posters/cabn8najufzg8rc5tsb5',0);
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_month` decimal(8,2) NOT NULL,
  `max_quality` enum('SD','HD','FHD','UHD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FHD',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Basic',0.00,'HD',1),(2,'Standard',59.00,'FHD',1),(3,'Premium',99.00,'UHD',1);
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `maturity_level` enum('child','teen','adult') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'adult',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (2,1,'Admin Profile','adult','2025-09-10 13:54:28'),(3,7,'Alice Viewer Profile','adult','2025-09-10 13:54:28'),(4,8,'Bob Viewer Profile','adult','2025-09-10 13:54:28'),(5,9,'Carol Viewer Profile','adult','2025-09-10 13:54:28'),(6,10,'Dave Viewer Profile','adult','2025-09-10 13:54:28'),(7,11,'Erin Viewer Profile','adult','2025-09-10 13:54:28');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `user_id` int NOT NULL,
  `stars` tinyint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_rating` (`movie_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`stars` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (6,1213,7,5,'2025-09-10 13:55:02','Epic worldbuilding'),(7,1209,8,5,'2025-09-10 13:55:02','Goosebumps'),(8,1212,9,4,'2025-09-10 13:55:02','Intense biopic'),(9,1206,10,5,'2025-09-10 13:55:02','Classic romance'),(10,1222,11,4,'2025-09-10 13:55:02','Stunts are wild'),(11,1214,7,5,'2025-09-10 13:55:02','Part Two delivers'),(12,1220,8,4,'2025-09-10 13:55:02','Detective tone rocks'),(13,1203,1,4,'2025-09-10 06:57:19','Good'),(14,1206,1,3,'2025-09-12 08:12:16','hay'),(15,1250,1,4,'2025-09-12 14:04:28','ghgh');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staging_movies`
--

DROP TABLE IF EXISTS `staging_movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staging_movies` (
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration_min` int DEFAULT NULL,
  `release_year` int DEFAULT NULL,
  `youtube_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age_rating` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'PG-13',
  `genres_csv` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staging_movies`
--

LOCK TABLES `staging_movies` WRITE;
/*!40000 ALTER TABLE `staging_movies` DISABLE KEYS */;
INSERT INTO `staging_movies` VALUES ('The Lord of the Rings: The Fellowship of the Ring','Journey of the One Ring begins',178,2001,'V75dMMIW2B4','PG-13','Adventure|Fantasy'),('The Lord of the Rings: The Two Towers','The battle for Middle-earth continues',179,2002,'LbfMDwc4azU','PG-13','Adventure|Fantasy'),('The Lord of the Rings: The Return of the King','The fate of Middle-earth',201,2003,'r5X-hFf6Bwo','PG-13','Adventure|Fantasy'),('Harry Potter and the Sorcerer\'s Stone','Welcome to Hogwarts',152,2001,'VyHV0BRtdxo','PG','Family|Fantasy'),('Harry Potter and the Chamber of Secrets','The Heir of Slytherin',161,2002,'1bq0qff4iF8','PG','Family|Fantasy'),('Harry Potter and the Prisoner of Azkaban','Azkaban escapee Sirius Black',142,2004,'lAxgztbYDbs','PG','Family|Fantasy'),('Star Wars: The Force Awakens','A new generation rises',138,2015,'sGbxmsDFVnE','PG-13','Sci-Fi|Adventure'),('Rogue One: A Star Wars Story','Stealing Death Star plans',134,2016,'frdj1zb9sMY','PG-13','Sci-Fi|War'),('Star Wars: The Last Jedi','The spark that will light the fire',152,2017,'Q0CbN8sfihY','PG-13','Sci-Fi|Adventure'),('Jurassic Park','Dinosaurs unleashed',127,1993,'QWBKEmWWL38','PG-13','Adventure|Sci-Fi'),('The Lost World: Jurassic Park','Return to Isla Sorna',129,1997,'lH5FD_xgi0I','PG-13','Adventure|Sci-Fi'),('Jurassic World','Bigger. Louder. More Teeth.',124,2015,'RFinNxS5KN4','PG-13','Adventure|Sci-Fi'),('Toy Story','To infinity and beyond',81,1995,'Ny_hRfvsmU8','G','Animation|Family'),('Finding Nemo','Just keep swimming',100,2003,'2zLkasScy7A','G','Animation|Family'),('Inside Out','Meet the little voices inside your head',95,2015,'seMwpP0yeu4','PG','Animation|Family'),('Forrest Gump','Life is like a box of chocolates',142,1994,'bLvqoHBptjg','PG-13','Drama|Romance'),('The Shawshank Redemption','Hope is a dangerous thing',142,1994,'NmzuHjWmXOc','R','Drama|Crime'),('Gladiator','Are you not entertained?',155,2000,'owK1qxDselE','R','Action|Drama'),('The Conjuring','Based on the Warrens\' case files',112,2013,'k10ETZ41q5o','R','Horror|Mystery'),('It (2017)','You\'ll float too',135,2017,'FnCdOQsX5kc','R','Horror|Thriller'),('Get Out','A mind-twisting social thriller',104,2017,'DzfpyUB60YY','R','Horror|Mystery'),('Spirited Away','Chihiro in the spirit world',125,2001,'ByXuk9QqQkk','PG','Animation|Fantasy'),('Demon Slayer: Mugen Train','Infinity Train arc',117,2020,'bFwdl2PDAFM','R','Animation|Action'),('Suzume','Doors across Japan',122,2022,'6MimqR7S6XM','PG-13','Animation|Fantasy');
/*!40000 ALTER TABLE `staging_movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime DEFAULT NULL,
  `status` enum('active','expired','canceled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`,`status`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,7,2,'2025-09-10 13:54:40',NULL,'active','2025-09-10 13:54:40'),(2,8,3,'2025-09-10 13:54:40',NULL,'active','2025-09-10 13:54:40'),(3,9,1,'2025-09-10 13:54:40',NULL,'active','2025-09-10 13:54:40'),(4,10,2,'2025-09-10 13:54:40',NULL,'active','2025-09-10 13:54:40'),(5,11,3,'2025-09-10 13:54:40',NULL,'active','2025-09-10 13:54:40'),(7,1,3,'2025-09-12 00:00:00','2025-10-12 00:00:00','active','2025-09-12 15:27:52');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('viewer','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'viewer',
  `status` enum('active','locked') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Admin','admin','active','2025-09-10 13:42:36','2025-09-10 13:42:36'),(7,'alice.viewer1@example.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Alice Viewer1','viewer','active','2025-09-10 13:54:06','2025-09-12 16:00:33'),(8,'bob.viewer@example.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Bob Viewer','viewer','active','2025-09-10 13:54:06','2025-09-10 13:54:06'),(9,'carol.viewer@example.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Carol Viewer','viewer','active','2025-09-10 13:54:06','2025-09-10 13:54:06'),(10,'dave.viewer@example.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Dave Viewer','viewer','active','2025-09-10 13:54:06','2025-09-10 13:54:06'),(11,'erin.viewer@example.com','$2b$10$QGLsxwTAOB0TuQKPQiWvB.xc9Sg3eb4SH2UEnOLPm8gmMW0rX5UtC','Erin Viewer','viewer','active','2025-09-10 13:54:06','2025-09-10 13:54:06'),(13,'admin2@gmail.com','$2b$10$EsF4P.vCh7g9UcPSEwTup.1Tjybet8gwLUlhBKqAN5IpFaVYw.oHy','qewqe','viewer','active','2025-09-13 03:21:22','2025-09-13 03:21:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_movie_rating`
--

DROP TABLE IF EXISTS `v_movie_rating`;
/*!50001 DROP VIEW IF EXISTS `v_movie_rating`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_movie_rating` AS SELECT 
 1 AS `movie_id`,
 1 AS `avg_rating`,
 1 AS `rating_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `view_history`
--

DROP TABLE IF EXISTS `view_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `view_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `position_sec` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  KEY `user_id` (`user_id`,`created_at`),
  CONSTRAINT `view_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `view_history_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `view_history`
--

LOCK TABLES `view_history` WRITE;
/*!40000 ALTER TABLE `view_history` DISABLE KEYS */;
INSERT INTO `view_history` VALUES (7,7,1213,1800,'2025-09-10 13:55:22'),(8,8,1209,2400,'2025-09-10 13:55:22'),(9,9,1212,900,'2025-09-10 13:55:22'),(10,10,1206,600,'2025-09-10 13:55:22'),(11,11,1222,2100,'2025-09-10 13:55:22'),(20,1,1266,0,'2025-09-13 02:20:04'),(21,1,1268,0,'2025-09-13 02:53:32');
/*!40000 ALTER TABLE `view_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `v_movie_rating`
--

/*!50001 DROP VIEW IF EXISTS `v_movie_rating`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_movie_rating` AS select `ratings`.`movie_id` AS `movie_id`,round(avg(`ratings`.`stars`),2) AS `avg_rating`,count(0) AS `rating_count` from `ratings` group by `ratings`.`movie_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-13 10:54:42
