-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.19 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for aplikacija
DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aplikacija`;

-- Dumping structure for table aplikacija.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table aplikacija.administrator: ~6 rows (approximately)
DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'mtair', '10CD7E114039E4E6D9D38E66DC21CB9C980FCA1F9448705A068F4CFE22B172E2B7779AFBB5A581DB1B577FE575A399276741C2F8A21FEE1E5B2ED42351F5DA30'),
	(2, 'aaleksic', '7D4D3B988A244D49EDE95C9E79D69746185F62081276CB68BB216F5CBFD175E33DFB67120ED0FE12E68AF098814AFEB70CD4BDADC62C7705D20F2F2EB64585BA'),
	(3, 'test-account', '375E734A461401A0BF7B3074E447C55D194ED00A60780A32B9D84AD7E3C1116204610E923DE7B1BDA80179C9CB630080168750FE760A58E22B40634074D258E5'),
	(4, 'test123', '3A2FFED1EF2BB7BE4B95B4AFC24071776E05245A4A8DEC4FC4F177B4DEA9DA36A5CF7ED3C8B7D1923C166635786096DEA973863F1EAFFBB875AE272B1352C5B6'),
	(7, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC'),
	(8, 'test', 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table aplikacija.availability
DROP TABLE IF EXISTS `availability`;
CREATE TABLE IF NOT EXISTS `availability` (
  `availability_id` int unsigned NOT NULL AUTO_INCREMENT,
  `is_available` tinyint NOT NULL DEFAULT '1',
  `store_id` int unsigned NOT NULL,
  `furniture_id` int unsigned NOT NULL,
  PRIMARY KEY (`availability_id`),
  KEY `fk_availability_store_id` (`store_id`),
  KEY `fk_availability_furniture_id` (`furniture_id`),
  CONSTRAINT `fk_availability_furniture_id` FOREIGN KEY (`furniture_id`) REFERENCES `furniture` (`furniture_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_availability_store_id` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.availability: ~9 rows (approximately)
DELETE FROM `availability`;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` (`availability_id`, `is_available`, `store_id`, `furniture_id`) VALUES
	(1, 1, 1, 1),
	(3, 1, 1, 3),
	(5, 1, 1, 4),
	(7, 1, 1, 5),
	(8, 1, 2, 5),
	(9, 1, 1, 6),
	(10, 1, 2, 6),
	(11, 1, 1, 7),
	(12, 1, 2, 7),
	(13, 0, 1, 2),
	(14, 0, 2, 2);
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;

-- Dumping structure for table aplikacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `parent__category_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`),
  KEY `fk_category_parent__category_id` (`parent__category_id`),
  CONSTRAINT `fk_category_parent__category_id` FOREIGN KEY (`parent__category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table aplikacija.category: ~11 rows (approximately)
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent__category_id`) VALUES
	(1, 'Dnevna soba', 'assets/img/dnevnasoba.jpg', NULL),
	(2, 'Trpezarija', 'assets/img/trpezarija.jpg', NULL),
	(3, 'Kuhinja', 'assets/img/kuhinja.jpg', NULL),
	(4, 'Kancelarija', 'assets/img/kancelarija.jpg', NULL),
	(5, 'Dečija soba', 'assets/img/decijasoba.jpg', NULL),
	(6, 'Spavaća soba', 'assets/img/spavacasoba.jpg', NULL),
	(7, 'Predsoblje', 'assets/img/predsoblje.jpg', NULL),
	(8, 'Baštenski nameštaj', 'assets/img/basta.jpg', NULL),
	(9, 'TDF', 'assets/img/tdf.jpg', 1),
	(10, 'Trosedi i ležajevi', 'assets/img/trosedi.jpg', 1),
	(11, 'Klizni plakari', 'assets/img/klizni.jpg', 6),
	(12, 'Predsoblje kompleti', 'assets/img/kompletpredsoblje.jpg', 7);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table aplikacija.furniture
DROP TABLE IF EXISTS `furniture`;
CREATE TABLE IF NOT EXISTS `furniture` (
  `furniture_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('available','visible','hidden') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'available',
  `construction` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `height` decimal(10,2) NOT NULL DEFAULT '0.00',
  `width` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `deep` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `material` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`furniture_id`),
  KEY `fk_furniture_category_id` (`category_id`),
  CONSTRAINT `fk_furniture_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table aplikacija.furniture: ~7 rows (approximately)
DELETE FROM `furniture`;
/*!40000 ALTER TABLE `furniture` DISABLE KEYS */;
INSERT INTO `furniture` (`furniture_id`, `name`, `category_id`, `description`, `status`, `construction`, `color`, `height`, `width`, `deep`, `material`) VALUES
	(1, 'V22', 3, 'Kratak opis...', 'available', 'kocka', 'bela', 22.00, 22.00, 22.00, '0'),
	(2, 'Izmenjeno ime', 1, ' IzmenjenIzmenjenIzmenjenIzmenjen', 'hidden', 'Izmenjenja ', 'ssss', 12.00, 12.00, 12.00, 'Peach'),
	(3, 'Verona', 11, 'Kliže jako lepo', 'available', 'kupa', 'crna', 44.00, 44.00, 44.00, '0'),
	(4, 'Izmenjeno ime', 3, ' IzmenjenIzmenjenIzmenjenIzmenjen', 'hidden', 'Izmenjenja ', 'ssss', 12.00, 12.00, 12.00, 'Peach'),
	(5, 'Zmaj', 5, 'OHOHOO', 'available', 'Zlatna konstrukcija', 'Brown', 22.00, 22.00, 22.00, 'Bademmmm'),
	(6, 'Stolica jako velika', 1, 'Izmenjen description', 'visible', 'Izmenjenja konstrukcija', 'Red', 11.00, 11.00, 11.00, 'Orah'),
	(7, 'Posle iispravke', 1, 'Savrseno radi', 'available', 'Platinum', 'Kaki', 45.00, 45.00, 47.00, 'Sljiva');
/*!40000 ALTER TABLE `furniture` ENABLE KEYS */;

-- Dumping structure for table aplikacija.furniture_price
DROP TABLE IF EXISTS `furniture_price`;
CREATE TABLE IF NOT EXISTS `furniture_price` (
  `furniture_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `furniture_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`furniture_price_id`),
  KEY `fk_furniture_price_furniture_id` (`furniture_id`),
  CONSTRAINT `fk_furniture_price_furniture_id` FOREIGN KEY (`furniture_id`) REFERENCES `furniture` (`furniture_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table aplikacija.furniture_price: ~8 rows (approximately)
DELETE FROM `furniture_price`;
/*!40000 ALTER TABLE `furniture_price` DISABLE KEYS */;
INSERT INTO `furniture_price` (`furniture_price_id`, `furniture_id`, `price`, `created_at`) VALUES
	(1, 1, 78.00, '2020-04-21 17:55:59'),
	(3, 4, 499.99, '2020-05-06 14:31:27'),
	(4, 5, 222.99, '2020-05-06 14:33:50'),
	(5, 6, 123.99, '2020-05-06 14:35:58'),
	(6, 7, 423.99, '2020-05-06 15:37:16'),
	(8, 4, 999.99, '2020-05-07 15:42:05'),
	(9, 4, 22.99, '2020-05-07 15:42:43'),
	(10, 2, 0.00, '2020-05-07 15:43:31'),
	(11, 2, 69.69, '2020-05-07 15:43:51');
/*!40000 ALTER TABLE `furniture_price` ENABLE KEYS */;

-- Dumping structure for table aplikacija.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `furniture_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_furniture_id` (`furniture_id`),
  CONSTRAINT `fk_photo_furniture_id` FOREIGN KEY (`furniture_id`) REFERENCES `furniture` (`furniture_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table aplikacija.photo: ~2 rows (approximately)
DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `furniture_id`, `image_path`) VALUES
	(5, 2, '202056-7630373020-3mb.jpg');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table aplikacija.store
DROP TABLE IF EXISTS `store`;
CREATE TABLE IF NOT EXISTS `store` (
  `store_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '0',
  `address` varchar(128) NOT NULL DEFAULT '0',
  `geo_lng` decimal(11,8) NOT NULL DEFAULT '0.00000000',
  `geo_lat` decimal(11,8) NOT NULL DEFAULT '0.00000000',
  PRIMARY KEY (`store_id`),
  UNIQUE KEY `uq_store_image_path` (`image_path`),
  UNIQUE KEY `uq_store_address` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.store: ~3 rows (approximately)
DELETE FROM `store`;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` (`store_id`, `image_path`, `name`, `address`, `geo_lng`, `geo_lat`) VALUES
	(1, 'assets/img/radnja1.jpg', 'Velika prodavnica', 'Velika Prodavnica 15', 44.00000000, 250.00000000),
	(2, 'assets/img/radnja2.jpg', 'Mala prodavnica', 'Mala Prodavnica 22', 70.00000000, 91.00000000),
	(3, 'img/img2.png', 'Prodavnica', 'Beograd 112321', 123.00000000, 39.00000000);
/*!40000 ALTER TABLE `store` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
