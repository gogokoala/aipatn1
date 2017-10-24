/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

-- ----------------------------
--  Table structure for `cOAuth2Info`
-- ----------------------------
DROP TABLE IF EXISTS `cOAuth2Info`;
CREATE TABLE `cOAuth2Info` (
  `client_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_in` int COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`client_id`),
  KEY `clientid` (`client_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OAuth2.0信息';

-- ----------------------------
--  Table structure for `cUser`
-- ----------------------------
DROP TABLE IF EXISTS `cUser`;
CREATE TABLE `cUser` (
  `user_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_in` int COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`client_id`),
  KEY `clientid` (`client_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OAuth2.0信息';


SET FOREIGN_KEY_CHECKS = 1;
