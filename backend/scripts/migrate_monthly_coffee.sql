-- 이달의 커피 테이블 변경 스크립트
-- monthly_features → monthly_coffee

-- 1. 테이블명 변경
RENAME TABLE `monthly_features` TO `monthly_coffee`;

-- 2. 컬럼 변경
-- start_date를 month로 변경
ALTER TABLE `monthly_coffee` CHANGE COLUMN `start_date` `month` DATE NOT NULL COMMENT '해당 월';

-- end_date 삭제
ALTER TABLE `monthly_coffee` DROP COLUMN `end_date`;

-- note를 subtitle로 변경
ALTER TABLE `monthly_coffee` CHANGE COLUMN `note` `subtitle` VARCHAR(255) DEFAULT NULL COMMENT '한줄평';

-- blend_id에 코멘트 추가
ALTER TABLE `monthly_coffee` MODIFY COLUMN `blend_id` BIGINT(20) NOT NULL COMMENT '블렌드 ID';

-- 3. 새 컬럼 추가
-- desc 추가
ALTER TABLE `monthly_coffee` ADD COLUMN `desc` TEXT DEFAULT NULL COMMENT '내용' AFTER `subtitle`;

-- banner_url 추가
ALTER TABLE `monthly_coffee` ADD COLUMN `banner_url` VARCHAR(1024) DEFAULT NULL COMMENT '배너 이미지 URL' AFTER `description`;

-- is_visible 추가 (노출/미노출)
ALTER TABLE `monthly_coffee` ADD COLUMN `is_visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '노출/미노출' AFTER `banner_url`;

-- created_by 추가 (등록자)
ALTER TABLE `monthly_coffee` ADD COLUMN `created_by` BIGINT(20) DEFAULT NULL COMMENT '등록자 ID' AFTER `is_visible`;
ALTER TABLE `monthly_coffee` ADD CONSTRAINT `fk_monthly_coffee_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL;
ALTER TABLE `monthly_coffee` ADD INDEX `idx_created_by` (`created_by`);

-- created_at에 코멘트 추가
ALTER TABLE `monthly_coffee` MODIFY COLUMN `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시';

-- updated_at 추가 (수정일시)
ALTER TABLE `monthly_coffee` ADD COLUMN `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시' AFTER `created_at`;

-- 4. 인덱스 재생성
ALTER TABLE `monthly_coffee` DROP INDEX `start_date`;
ALTER TABLE `monthly_coffee` ADD INDEX `idx_month` (`month`);
ALTER TABLE `monthly_coffee` ADD INDEX `idx_is_visible` (`is_visible`);

-- 확인용 쿼리
-- SELECT * FROM monthly_coffee;
