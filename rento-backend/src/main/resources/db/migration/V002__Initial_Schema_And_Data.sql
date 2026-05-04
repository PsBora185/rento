-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: rento_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_date` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deposit_amount` double DEFAULT NULL,
  `deposit_paid` bit(1) DEFAULT NULL,
  `monthly_rent` double DEFAULT NULL,
  `move_in_date` datetime(6) DEFAULT NULL,
  `move_out_date` datetime(6) DEFAULT NULL,
  `notes` text,
  `status` enum('ACCEPTED','ACTIVE','CANCELLED','COMPLETED','CONFIRMED','PENDING','REJECTED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `renter_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhi6uutgints5fj9cj244ecysh` (`renter_id`),
  KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
  CONSTRAINT `FKhi6uutgints5fj9cj244ecysh` FOREIGN KEY (`renter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  `owner_id` bigint NOT NULL,
  `owner_replied` bit(1) NOT NULL,
  `renter_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_room_renter` (`room_id`,`renter_id`),
  KEY `idx_renter` (`renter_id`),
  KEY `idx_owner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (1,'2025-12-26 13:23:31.433610','2025-12-26 13:25:40.900040',5,_binary '',3,4),(2,'2025-12-27 16:29:57.115742','2025-12-27 18:39:30.591249',2,_binary '',6,2),(3,'2026-01-06 13:12:44.792312','2026-01-06 13:13:28.526661',1,_binary '\0',7,1),(4,'2026-01-06 13:15:42.249095','2026-01-06 13:17:15.447014',2,_binary '',3,2);
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) NOT NULL,
  `media_type` enum('IMAGE','NONE','VIDEO') DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `seen` bit(1) NOT NULL,
  `sender_id` bigint NOT NULL,
  `sender_role` enum('OWNER','RENTER') NOT NULL,
  `conversation_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `FKt492th6wsovh1nush5yl5jj8e` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'hlo','2025-12-26 13:23:35.201275','NONE',NULL,_binary '\0',3,'RENTER',1),(2,'hi','2025-12-26 13:24:58.362366','NONE',NULL,_binary '\0',5,'OWNER',1),(3,'need room','2025-12-26 13:25:40.896299','NONE',NULL,_binary '\0',3,'RENTER',1),(4,'Heyy','2025-12-27 16:30:01.684165','NONE',NULL,_binary '\0',6,'RENTER',2),(5,'tt','2025-12-27 16:39:41.735378','NONE',NULL,_binary '\0',2,'OWNER',2),(6,'yy','2025-12-27 16:47:00.562391','NONE',NULL,_binary '\0',2,'OWNER',2),(7,'mm m','2025-12-27 18:30:39.654444','NONE',NULL,_binary '\0',2,'OWNER',2),(8,'bbb','2025-12-27 18:39:01.268419','NONE',NULL,_binary '\0',6,'RENTER',2),(9,'nnn','2025-12-27 18:39:02.436995','NONE',NULL,_binary '\0',6,'RENTER',2),(10,'nn','2025-12-27 18:39:03.211982','NONE',NULL,_binary '\0',6,'RENTER',2),(11,'nn','2025-12-27 18:39:03.940797','NONE',NULL,_binary '\0',6,'RENTER',2),(12,'nn','2025-12-27 18:39:04.725631','NONE',NULL,_binary '\0',6,'RENTER',2),(13,'nn','2025-12-27 18:39:05.531182','NONE',NULL,_binary '\0',6,'RENTER',2),(14,'b                  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv','2025-12-27 18:39:30.589100','NONE',NULL,_binary '\0',2,'OWNER',2),(15,'Hi','2026-01-06 13:13:28.522666','NONE',NULL,_binary '\0',7,'RENTER',3),(16,'Hello','2026-01-06 13:16:05.557928','NONE',NULL,_binary '\0',3,'RENTER',4),(17,'Hi','2026-01-06 13:16:53.938302','NONE',NULL,_binary '\0',2,'OWNER',4),(18,'I need room','2026-01-06 13:17:15.445033','NONE',NULL,_binary '\0',3,'RENTER',4);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text,
  `created_at` datetime(6) DEFAULT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `rating` int NOT NULL,
  `review_type` enum('OWNER_REVIEW','RENTER_REVIEW','ROOM_REVIEW') DEFAULT NULL,
  `reviewee_id` bigint NOT NULL,
  `reviewer_id` bigint NOT NULL,
  `room_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1sjw2c8j34ew366vfqxergp0b` (`reviewee_id`),
  KEY `FKd1isgfajhtdl8mgg29up6mofi` (`reviewer_id`),
  KEY `FKoppowk1pob9qiujo31erx63x1` (`room_id`),
  CONSTRAINT `FK1sjw2c8j34ew366vfqxergp0b` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKd1isgfajhtdl8mgg29up6mofi` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKoppowk1pob9qiujo31erx63x1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` <= 5) and (`rating` >= 1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `room_id` bigint NOT NULL,
  `amenity` varchar(255) DEFAULT NULL,
  KEY `FKps6ofup9gxhn8juqvproxbaud` (`room_id`),
  CONSTRAINT `FKps6ofup9gxhn8juqvproxbaud` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (2,'Kitchen'),(2,'Balcony'),(2,'Water Supply'),(2,'Power Backup'),(2,'WiFi'),(1,'Kitchen'),(1,'Water Supply'),(1,'Gym'),(1,'Power Backup'),(3,'WiFi'),(3,'Parking'),(3,'Water Supply'),(3,'Power Backup'),(3,'Security'),(3,'Balcony'),(4,'Kitchen'),(4,'Balcony'),(4,'Water Supply'),(4,'Power Backup');
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `room_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  KEY `FKtky1jnwoh1hv50m263p2vlt0y` (`room_id`),
  CONSTRAINT `FKtky1jnwoh1hv50m263p2vlt0y` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (2,'https://res.cloudinary.com/dhqldyxqx/image/upload/v1766733899/jtmotjpkzmrxtjfxepzm.jpg'),(1,'https://res.cloudinary.com/dhqldyxqx/image/upload/v1766734176/r5b75qum7rrqzd0cmfaa.jpg'),(3,'https://res.cloudinary.com/dhqldyxqx/image/upload/v1766734445/ugxp2hosrtl6wuch7is0.jpg'),(4,'https://res.cloudinary.com/dhqldyxqx/image/upload/v1766734997/myvkaxk9y8w7dw5xlbgt.jpg');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_from` date DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deposit_amount` double DEFAULT NULL,
  `description` text,
  `furnishing_type` enum('FURNISHED','SEMI_FURNISHED','UNFURNISHED') DEFAULT NULL,
  `house_rules` text,
  `is_available` bit(1) NOT NULL,
  `latitude` double DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `longitude` double DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `room_type` enum('ONE_BHK','SHARED','SINGLE','STUDIO','THREE_BHK','TWO_BHK') DEFAULT NULL,
  `state` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `owner_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtnhxhxjvamaungwsm0q7e010` (`owner_id`),
  CONSTRAINT `FKtnhxhxjvamaungwsm0q7e010` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rooms_chk_1` CHECK ((`price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'2025-12-26','Pithoragarh','2025-12-26 12:38:27.743915',999,'Natural lighting + located near college + near gym + 24*7 Electricity available ','FURNISHED','No drinking and smoking',_binary '',29.57899943447427,'GIC Road , Pithoragarh',80.2006183609942,'262502',4399,'SHARED','Uttarakhand','Single room set ','2025-12-26 13:00:08.197830',1),(2,'2025-12-27','pithoragarh','2025-12-26 12:58:40.617624',1501,'single room near road in Rai','SEMI_FURNISHED','only veg',_binary '',27.1766701,'Rai ,dharchula road',78.0080745,'262501',4000,'SINGLE','Uttarakhand','single room','2025-12-26 12:58:40.617624',2),(3,'2025-12-28','Pithoragarh','2025-12-26 13:06:50.372020',2000,'room at takana near market','UNFURNISHED','gates closed after 10pm',_binary '',NULL,'kabisha near takana road pithoragarh',NULL,'262501',4000,'SINGLE','Uttarakhand','room near market','2025-12-26 13:06:50.372020',4),(4,'2025-12-29','Pithoragarh','2025-12-26 13:18:20.754010',3001,'room near puliya with 24*7 water supply','SEMI_FURNISHED','no unnecessary noise allowed',_binary '',29.587411,'aincholi',80.214987,'262501',3500,'SINGLE','Uttarakhand','room available at aincholi','2025-12-26 13:18:20.755013',5);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `owner_verified` bit(1) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phone_verified` bit(1) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` enum('OWNER','RENTER') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-12-26 12:24:19.755617','prantikvermaparas@gmail.com',_binary '','Prantik Verma',_binary '\0','$2a$10$n02LNxRjxF5xaTsYEufDtuE/vHnhcN5V6rnrC2zW.a5JmBRtXSICC',NULL,_binary '\0',NULL,'OWNER','2025-12-26 12:24:25.280474'),(2,'2025-12-26 12:45:12.640801','pranavbora49@gmail.com',_binary '','P. S. Bora',_binary '\0','$2a$10$OykJD2yhv1HE.TAoVDnay.jMGzECm4NG8EuSToWDGLKqaHP3i2lbW',NULL,_binary '\0',NULL,'OWNER','2025-12-26 12:45:24.449149'),(3,'2025-12-26 12:47:09.887557',NULL,_binary '\0','Psb',_binary '\0','$2a$10$Yr14dA/50JL0PDD5EEMrxuP8n8WIzXu6bfg/2Dq9k6XrgXl.MkB7O','1234567890',_binary '',NULL,'RENTER','2025-12-26 12:47:09.887557'),(4,'2025-12-26 13:03:42.715189','126himanshu@gmail.com',_binary '','Himanshu',_binary '\0','$2a$10$RVjwqFhRxpTWG1idZ0LbVuQ6quSlHx4NaWGR.92eY4yUbxp2aeSt.',NULL,_binary '\0',NULL,'OWNER','2025-12-26 13:03:48.399805'),(5,'2025-12-26 13:12:21.299790','anuragpal496@gmail.com',_binary '','Anurag',_binary '\0','$2a$10$ATV.PFs/C9I3Yv./4V9hCONv9a0WEUtdKDs/v5LPDH/cWU6b0MK7W',NULL,_binary '\0',NULL,'OWNER','2025-12-26 13:12:24.748604'),(6,'2025-12-27 16:02:27.088857',NULL,_binary '\0','Psb',_binary '\0','$2a$10$dtx0OtP8f48.ITJaWUPrL.FtVaUAu9dSkmTIbIU1ygBLIqFjp6Wka','1122334455',_binary '',NULL,'RENTER','2025-12-27 16:02:27.088857'),(7,'2026-01-06 13:06:38.811044',NULL,_binary '\0','User',_binary '\0','$2a$10$jwjxNLrTSbhq2tJMZFJOAeO07emgTW0XoK0z6Fk8ghq92Ni/XgcNu','9999999999',_binary '',NULL,'OWNER','2026-01-06 13:07:18.433374'),(8,'2026-05-04 11:25:44.103394','p@gmail.com',_binary '','Psb',_binary '\0','$2a$10$1Xu0J1CWtutCFXsROZK/U.El/gz0Lg.kfQ7mYQhJ477AG9SFqARaq',NULL,_binary '\0',NULL,'OWNER','2026-05-04 11:25:46.485830');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 11:55:29

