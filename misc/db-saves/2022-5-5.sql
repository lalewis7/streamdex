-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: streamdex
-- ------------------------------------------------------
-- Server version	8.0.26

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
-- Table structure for table `botlinks`
--

DROP TABLE IF EXISTS `botlinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `botlinks` (
  `link_id` varchar(64) NOT NULL,
  `link` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`link_id`),
  UNIQUE KEY `link_UNIQUE` (`link`) /*!80000 INVISIBLE */,
  FULLTEXT KEY `idx_link_search` (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bots`
--

DROP TABLE IF EXISTS `bots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bots` (
  `bot_id` varchar(8) NOT NULL,
  `controller` varchar(64) DEFAULT NULL,
  `online` tinyint DEFAULT NULL,
  `running` tinyint DEFAULT NULL,
  `current_process` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`bot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `episodelinks`
--

DROP TABLE IF EXISTS `episodelinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `episodelinks` (
  `episode_id` varchar(64) NOT NULL,
  `platform` varchar(8) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `timestamp` bigint DEFAULT NULL,
  `available` tinyint DEFAULT NULL,
  KEY `fk_episodelinks_episodes1_idx` (`episode_id`),
  KEY `fk_episodelinks_platforms1_idx` (`platform`),
  CONSTRAINT `fk_episodelinks_episodes1` FOREIGN KEY (`episode_id`) REFERENCES `episodes` (`episode_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `episodes`
--

DROP TABLE IF EXISTS `episodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `episodes` (
  `season_id` varchar(64) NOT NULL,
  `episode_id` varchar(64) NOT NULL,
  `episode_number` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `runtime` int DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `rel_date` date DEFAULT NULL,
  PRIMARY KEY (`episode_id`),
  KEY `fk_episodes_seasons1_idx` (`season_id`),
  CONSTRAINT `fk_episodes_seasons1` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`season_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `image_id` varchar(64) NOT NULL,
  `filename` varchar(64) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `public` tinyint DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `links` (
  `title_id` varchar(64) NOT NULL,
  `platform` varchar(8) NOT NULL,
  `link` varchar(128) DEFAULT NULL,
  UNIQUE KEY `title_id_UNIQUE` (`title_id`),
  UNIQUE KEY `platform_UNIQUE` (`platform`),
  KEY `fk_links_title1_idx` (`title_id`),
  KEY `fk_links_platforms1_idx` (`platform`),
  CONSTRAINT `fk_links_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `list_id` varchar(8) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `updated` bigint DEFAULT NULL,
  PRIMARY KEY (`list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `listtitles`
--

DROP TABLE IF EXISTS `listtitles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listtitles` (
  `list_id` varchar(8) NOT NULL,
  `title_id` varchar(64) NOT NULL,
  `ranking` int DEFAULT NULL,
  UNIQUE KEY `list_id_UNIQUE` (`list_id`),
  UNIQUE KEY `title_id_UNIQUE` (`title_id`),
  KEY `fk_listtitles_lists1_idx` (`list_id`),
  KEY `fk_listtitles_title1_idx` (`title_id`),
  CONSTRAINT `fk_listtitles_lists1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`),
  CONSTRAINT `fk_listtitles_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movielinks`
--

DROP TABLE IF EXISTS `movielinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movielinks` (
  `title_id` varchar(64) NOT NULL,
  `platform` varchar(8) NOT NULL,
  `country` varchar(8) DEFAULT NULL,
  `timestamp` bigint DEFAULT NULL,
  `available` tinyint DEFAULT NULL,
  KEY `fk_movielinks_title1_idx` (`title_id`),
  CONSTRAINT `fk_movielinks_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `title_id` varchar(64) NOT NULL,
  `trailer` varchar(32) DEFAULT NULL,
  `rel_date` date DEFAULT NULL,
  `runtime` int DEFAULT NULL,
  UNIQUE KEY `title_id_UNIQUE` (`title_id`),
  KEY `fk_movies_title1_idx` (`title_id`),
  CONSTRAINT `fk_movies_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resetpassword`
--

DROP TABLE IF EXISTS `resetpassword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resetpassword` (
  `code` varchar(128) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `created` bigint DEFAULT NULL,
  `expires` bigint DEFAULT NULL,
  `valid` tinyint DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `fk_resetpassword_users1_idx` (`user_id`),
  CONSTRAINT `fk_resetpassword_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seasonlinks`
--

DROP TABLE IF EXISTS `seasonlinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seasonlinks` (
  `season_id` varchar(64) NOT NULL,
  `platform` varchar(8) NOT NULL,
  `country` varchar(64) DEFAULT NULL,
  `timestamp` bigint DEFAULT NULL,
  `available` tinyint DEFAULT NULL,
  KEY `fk_seasonlinks_seasons1_idx` (`season_id`),
  CONSTRAINT `fk_seasonlinks_seasons1` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`season_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seasons`
--

DROP TABLE IF EXISTS `seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seasons` (
  `season_id` varchar(64) NOT NULL,
  `title_id` varchar(64) NOT NULL,
  `season_number` int DEFAULT NULL,
  `trailer` varchar(32) DEFAULT NULL,
  `rel_date` datetime DEFAULT NULL,
  PRIMARY KEY (`season_id`),
  KEY `fk_seasons_title1_idx` (`title_id`),
  CONSTRAINT `fk_seasons_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `snapshots`
--

DROP TABLE IF EXISTS `snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `snapshots` (
  `link_id` varchar(64) NOT NULL,
  `timestamp` int DEFAULT NULL,
  `data` json DEFAULT NULL,
  KEY `fk_link_id_idx` (`link_id`),
  CONSTRAINT `fk_link_id` FOREIGN KEY (`link_id`) REFERENCES `botlinks` (`link_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` varchar(64) NOT NULL,
  `bot_id` varchar(8) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `started` int DEFAULT NULL,
  `ended` int DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`task_id`),
  KEY `fk_bot_id_idx` (`bot_id`),
  CONSTRAINT `fk_bot_id` FOREIGN KEY (`bot_id`) REFERENCES `bots` (`bot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `titlegenres`
--

DROP TABLE IF EXISTS `titlegenres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `titlegenres` (
  `title_id` varchar(64) NOT NULL,
  `genre` varchar(64) NOT NULL,
  PRIMARY KEY (`title_id`),
  UNIQUE KEY `genre_UNIQUE` (`genre`),
  UNIQUE KEY `title_id_UNIQUE` (`title_id`),
  KEY `fk_titlegenres_title_idx` (`title_id`),
  CONSTRAINT `fk_titlegenres_title` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `titles` (
  `title_id` varchar(64) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `cover_image` varchar(64) DEFAULT NULL,
  `maturity_rating` varchar(8) DEFAULT NULL,
  `trailer` varchar(64) DEFAULT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `imdb_link` varchar(128) DEFAULT NULL,
  `imdb_rating` varchar(32) DEFAULT NULL,
  `rotten_tomatoes_link` varchar(128) DEFAULT NULL,
  `rotten_tomatoes_rating` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`title_id`),
  FULLTEXT KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `token` varchar(256) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `created` bigint DEFAULT NULL,
  `expires` bigint DEFAULT NULL,
  PRIMARY KEY (`token`),
  KEY `fk_tokens_users1_idx` (`user_id`),
  CONSTRAINT `fk_tokens_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userratings`
--

DROP TABLE IF EXISTS `userratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userratings` (
  `user_id` varchar(64) NOT NULL,
  `title_id` varchar(64) NOT NULL,
  `positive` tinyint DEFAULT NULL,
  KEY `fk_userratings_title1_idx` (`title_id`),
  KEY `fk_userratings_users1_idx` (`user_id`),
  CONSTRAINT `fk_userratings_title1` FOREIGN KEY (`title_id`) REFERENCES `titles` (`title_id`),
  CONSTRAINT `fk_userratings_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(64) NOT NULL,
  `handle` varchar(64) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `country` varchar(8) DEFAULT NULL,
  `locked` tinyint DEFAULT NULL,
  `admin` tinyint DEFAULT NULL,
  `super_admin` tinyint DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `email_verified` tinyint DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userstreams`
--

DROP TABLE IF EXISTS `userstreams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userstreams` (
  `user_id` varchar(64) NOT NULL,
  `platform` varchar(8) NOT NULL,
  KEY `fk_userstreams_users1_idx` (`user_id`),
  KEY `fk_userstreams_platforms1_idx` (`platform`),
  CONSTRAINT `fk_userstreams_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-05  0:53:14
