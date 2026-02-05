export interface CoffeeData {
    rank_no: 1,
    group_type: string,
    coffee_blend_id: string,
    coffee_name: string,
    similarity_score: null | number,
    taste_distance: number,
    aroma_score: number,
    acidity_score: number,
    nutty_score: number,
    body_score: number,
    sweetness_score: number,
    summary: string,
}

export interface CoffeeRecommendation {
    coffee_blend_id: string;
    coffee_name: string;
    summary: string;
    distance_score: number;
    aroma_score: number;
    acidity_score: number;
    nutty_score: number;
    body_score: number;
    sweetness_score: number;
    match_percentage: number;
}

export interface CoffeePreferences {
    aroma: number;
    acidity: number;
    nutty: number;
    body: number;
    sweetness: number;
}

export interface Top5Recommendations {
    message: string;
    success: boolean;
    data: {
        limitSimilar: number;
        p_result_code: string;
        p_result_message: string;
        total: number;
        recordset: CoffeeRecord[];
        preferences: CoffeePreferences;
    }
    meta: {
        timestamp: string;
    }
}

export type CoffeeRecord = {
    rank_no: number;
    group_type: string;
    coffee_blend_id: string;
    coffee_name: string;
    similarity_score: number | null;
    taste_distance: number;
    aroma_score: number;
    acidity_score: number;
    nutty_score: number;
    body_score: number;
    sweetness_score: number;
};