-- 취향 항목/점수별 문구 테이블 (score_scales) 재정의
-- 항목 5개(향, 산미, 단맛, 바디, 고소함) × 점수 1~5 각각 설명 문구 보관

DROP TABLE IF EXISTS `score_scales`;

CREATE TABLE `score_scales` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `attribute_key` varchar(32) NOT NULL COMMENT '취향 항목 키 (aroma, acidity, sweetness, body, nutty)',
  `attribute_label` varchar(64) DEFAULT NULL COMMENT '취향 항목 표시명 (향, 산미, 단맛, 바디, 고소함)',
  `score` tinyint unsigned NOT NULL COMMENT '점수 (1-5)',
  `description` text COMMENT '해당 항목·점수에 대한 설명 문구',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_score_scales_attribute_score` (`attribute_key`,`score`),
  KEY `idx_score_scales_attribute_key` (`attribute_key`),
  KEY `idx_score_scales_score` (`score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='취향 항목별 점수(1-5) 및 설명 문구';

-- 시드: 항목별 1~5점 설명 (필요 시 수정)
INSERT INTO `score_scales` (`attribute_key`, `attribute_label`, `score`, `description`) VALUES
('aroma', '향', 1, '은은한 향이 느껴집니다.'),
('aroma', '향', 2, '부드러운 향이 감돕니다.'),
('aroma', '향', 3, '균형 잡힌 향이 인상적입니다.'),
('aroma', '향', 4, '풍부하고 매혹적인 향이 인상적입니다.'),
('aroma', '향', 5, '매우 진하고 풍부한 향이 선명합니다.'),
('acidity', '산미', 1, '산미가 거의 느껴지지 않습니다.'),
('acidity', '산미', 2, '은은한 산미가 느껴집니다.'),
('acidity', '산미', 3, '적당한 산미가 감돕니다.'),
('acidity', '산미', 4, '상큼한 산미가 또렷하게 느껴집니다.'),
('acidity', '산미', 5, '생동감 있는 산미가 선명합니다.'),
('sweetness', '단맛', 1, '단맛이 거의 느껴지지 않습니다.'),
('sweetness', '단맛', 2, '은은한 단맛이 감돕니다.'),
('sweetness', '단맛', 3, '입안 가득 자연스러운 단맛이 감돕니다.'),
('sweetness', '단맛', 4, '달콤한 단맛이 또렷합니다.'),
('sweetness', '단맛', 5, '풍부한 단맛이 오래 남습니다.'),
('body', '바디', 1, '가벼운 질감입니다.'),
('body', '바디', 2, '부드러운 농도가 느껴집니다.'),
('body', '바디', 3, '적당한 농도와 무게감이 있습니다.'),
('body', '바디', 4, '묵직한 바디감이 인상적입니다.'),
('body', '바디', 5, '매우 진하고 무게감 있는 바디감입니다.'),
('nutty', '고소함', 1, '고소함이 거의 느껴지지 않습니다.'),
('nutty', '고소함', 2, '은은한 고소함이 감돕니다.'),
('nutty', '고소함', 3, '볶은 견과류의 고소함이 느껴집니다.'),
('nutty', '고소함', 4, '깊은 고소함이 강조됩니다.'),
('nutty', '고소함', 5, '볶은 견과류 같은 깊은 고소함이 강조됩니다.');
