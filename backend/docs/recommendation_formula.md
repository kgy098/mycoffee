# 취향 근사값(유사도) 계산 방식

사용자 취향 벡터와 `blends` 테이블의 각 블렌드 벡터 사이 **유클리드 거리**로 “가까운” 블렌드를 찾고, 이를 0~100 **유사도 점수**로 바꿉니다.

## 1. 벡터 구성

- **사용자 취향** (analysis 입력): `aroma`, `acidity`, `sweetness`, `nutty`, `body` (각 1~5)
- **블렌드** (blends 테이블): `acidity`, `sweetness`, `body`, `nuttiness`, `bitterness` (각 1~5)

서비스 내부 매핑:

- 사용자 `aroma` ↔ 블렌드 `acidity`
- 사용자 `acidity` ↔ 블렌드 `bitterness`
- 사용자 `sweetness` ↔ 블렌드 `sweetness`
- 사용자 `body` ↔ 블렌드 `body`
- 사용자 `nutty` ↔ 블렌드 `nuttiness`

## 2. 유클리드 거리 (Euclidean distance)

거리가 **작을수록** 취향이 비슷합니다.

```
distance = √[
  (user.aroma    - blend.acidity)  ² +
  (user.sweetness - blend.sweetness)² +
  (user.body    - blend.body)      ² +
  (user.nutty   - blend.nuttiness) ² +
  (user.acidity - blend.bitterness)²
]
```

- 최소 거리: 0 (완전히 같음)
- 최대 거리: 5√5 ≈ 11.18 (각 축 차이 5, 5개 축)

## 3. 유사도 점수 (0 ~ 100)

거리를 0~100 점수로 변환합니다.

```
max_distance = 5 × √5   # 약 11.18
similarity = (1 - (distance / max_distance)) × 100
```

- `distance = 0`  → 유사도 **100**
- `distance = max_distance` → 유사도 **0**
- 그 사이는 비례해서 선형 변환

## 4. 추천 순서

1. 활성 블렌드 전체에 대해 위 거리 계산
2. 유사도로 변환 후 **유사도 높은 순** 정렬
3. 상위 N개(예: 5개)를 추천 결과로 반환

구현 위치: `app/services/recommendation.py`  
- `calculate_euclidean_distance()`  
- `distance_to_similarity_score()`  
- `get_recommendations()`
