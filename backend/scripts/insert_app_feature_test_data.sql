-- 앱 기능 테스트 데이터 (커뮤니티/배송지/주문/문의/컬렉션)
-- 실행 전: users, blends 테이블 존재 필요

-- 1) 기본 사용자/블렌드 확보
SET @test_email := 'testuser@mycoffee.ai';
SET @test_phone := '010-1234-5678';
SET @test_blend_name := '테스트 블렌드';

INSERT INTO users (email, phone_number, display_name, provider, created_at, updated_at)
SELECT @test_email, @test_phone, '테스트 사용자', 'email', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = @test_email);

INSERT INTO blends (
  name, summary, acidity, sweetness, body, nuttiness, bitterness, price, stock, thumbnail_url, is_active, created_at
)
SELECT @test_blend_name, '테스트용 블렌드 요약', 3, 3, 3, 3, 3, 12000, 50,
  'https://example.com/images/test_blend.jpg', 1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM blends WHERE name = @test_blend_name);

SELECT id INTO @user_id FROM users WHERE email = @test_email LIMIT 1;
SELECT id INTO @blend_id FROM blends WHERE name = @test_blend_name LIMIT 1;

-- 2) 배송지
INSERT INTO delivery_addresses (
  user_id, recipient_name, phone_number, postal_code, address_line1, address_line2, is_default, created_at, updated_at
) VALUES (
  @user_id, '테스트 수령인', '010-9999-8888', '06001', '서울 강남구 테헤란로 123', '테스트빌딩 10층', 1, NOW(), NOW()
);
SELECT id INTO @address_id FROM delivery_addresses WHERE user_id = @user_id ORDER BY id DESC LIMIT 1;

-- 3) 컬렉션
INSERT INTO user_collections (user_id, blend_id, analysis_result_id, collection_name, personal_comment, created_at, updated_at)
VALUES (@user_id, @blend_id, NULL, '나만의 컬렉션', '테스트 코멘트입니다.', NOW(), NOW());
SELECT id INTO @collection_id FROM user_collections WHERE user_id = @user_id ORDER BY id DESC LIMIT 1;

-- 4) 주문 + 주문 아이템
INSERT INTO orders (
  user_id, order_number, order_type, status, subscription_id, delivery_address_id, payment_method,
  total_amount, discount_amount, points_used, delivery_fee, created_at
) VALUES (
  @user_id, CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-0001'), 'single', 'delivered', NULL, @address_id,
  'card', 12000, 0, 0, 3000, NOW()
);
SELECT id INTO @order_id FROM orders WHERE user_id = @user_id ORDER BY id DESC LIMIT 1;

INSERT INTO order_items (
  order_id, blend_id, collection_id, collection_name, quantity, unit_price, options, created_at
) VALUES (
  @order_id, @blend_id, @collection_id, '나만의 컬렉션', 1, 12000,
  JSON_OBJECT('grind', 'medium', 'roast', 'medium'), NOW()
);
SELECT id INTO @order_item_id FROM order_items WHERE order_id = @order_id ORDER BY id DESC LIMIT 1;

-- 5) 문의
INSERT INTO inquiries (
  user_id, order_id, order_item_id, inquiry_type, status, title, message, image_url, answer, created_at, answered_at
) VALUES (
  @user_id, @order_id, @order_item_id, 'product', 'answered',
  '테스트 문의 제목', '테스트 문의 내용입니다.', 'https://example.com/images/inquiry.jpg',
  '테스트 답변입니다.', NOW(), NOW()
);

-- 6) 커뮤니티 컨텐츠
INSERT INTO coffee_stories (title, content, thumbnail_url, created_at) VALUES
('오늘의 커피 이야기', '테스트 커피 스토리 내용입니다.', 'https://example.com/images/story.jpg', NOW());

INSERT INTO coffee_tips (title, content, thumbnail_url, created_at) VALUES
('맛있는 커피 팁', '테스트 커피 팁 내용입니다.', 'https://example.com/images/tip.jpg', NOW());

INSERT INTO events (title, content, thumbnail_url, status, push_on_publish, reward_points, reward_coupon_id, created_at) VALUES
('테스트 이벤트', '테스트 이벤트 상세 내용입니다.', 'https://example.com/images/event.jpg', '진행중', 1, 100, NULL, NOW());

-- 7) 알림/마케팅 동의
INSERT INTO user_consents (user_id, consent_type, is_agreed, agreed_at) VALUES
(@user_id, 'push', 1, NOW()),
(@user_id, 'marketing', 1, NOW());

-- 8) 리뷰 (메인/리뷰탭 표시용)
INSERT INTO reviews (user_id, blend_id, rating, content, photo_url, status, points_awarded, created_at) VALUES
(@user_id, @blend_id, 5, '향도 좋고 밸런스가 좋아서 재구매 의사 있어요.', 'https://example.com/images/review.jpg', 'approved', 1, NOW());
