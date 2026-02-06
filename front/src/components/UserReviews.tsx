'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import { useGet } from '@/hooks/useApi';

// Import Swiper styles
import 'swiper/css';

interface UserReview {
    name: string;
    id: number;
    rating: number;
    comment: string;
    product: string;
    date: string;
    images?: string[];
}

const UserReviews = () => {

    const { data: reviews } = useGet<any[]>(
        ['home-reviews'],
        '/api/reviews',
        { params: { sort: 'latest', photo_only: true } }
    );

    const userReviews: UserReview[] = (reviews || []).slice(0, 8).map((review) => ({
        id: review.id,
        name: review.user_display_name || '익명',
        rating: review.rating || 0,
        comment: review.content || '',
        product: review.blend_name || '',
        date: review.created_at
            ? new Date(review.created_at).toLocaleDateString('ko-KR')
            : '',
        images: review.photo_url ? [review.photo_url] : [],
    }));

    return (
        <div className="mb-3 bg-background-sub py-3 px-4 pr-0 text-gray-0">
            <div className="flex items-center justify-between mb-3 pr-6">
                <h2 className="text-base font-bold">모이면 더 맛있는 커피 리뷰</h2>
                <Link href="/review-main" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M1.5 10.5L6.5 6L1.5 1.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <Swiper
                spaceBetween={12}
                slidesPerView={1.57}
                loop={true}
                className="user-reviews-swiper"
            >
                {userReviews.map((review, index) => (
                    <SwiperSlide key={review?.id}>
                        <div className="rounded-lg px-3 py-2.5 border-[0.8px] border-border-default text-gray-0">
                            {/* User Info */}
                            <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-[9px]">
                                    <div className="w-[28px] h-[28px] bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                        <Image src="/images/avatar.png" alt="user" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold leading-[160%]  mb-0.5">{review.name}</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                star <= review.rating ? (
                                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#FFC107" stroke="#FFC107" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M5 0L6.545 3.13L10 3.635L7.5 6.07L8.09 9.51L5 7.885L1.91 9.51L2.5 6.07L0 3.635L3.455 3.13L5 0Z" fill="#E6E6E6" />
                                                    </svg>)
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[12px] text-text-secondary font-normal leading-[160%]">{review.date}</span>
                            </div>

                            {/* Product Tag */}
                            <div className="mb-1">
                                <span className="inline-block px-2 py-0.5 bg-[rgba(0,0,0,0.05)] rounded-[10px] text-text-secondary text-[12px] leading-[160%]">
                                    {review.product}
                                </span>
                            </div>

                            {/* Comment */}
                            <p className="text-[12px] mb-2 font-normal leading-[160%] line-clamp-2">{review.comment}</p>

                            {/* Images - maksimal 2 ta */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 overflow-hidden">
                                    {review.images.slice(0, 2).map((image, imgIndex) => (
                                        <div key={imgIndex} className="w-[97px] h-[97px] shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Review image ${imgIndex + 1}`}
                                                width={97}
                                                height={97}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default UserReviews;
