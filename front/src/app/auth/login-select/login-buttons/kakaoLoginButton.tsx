
const KakaoTalkLoginButton = () => {

    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || "";
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "";

    const loginWithCacaouTalk = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
        window.location.href = kakaoAuthUrl;
    };

    return (
        <button onClick={loginWithCacaouTalk} className="btn-primary-empty w-full text-center mb-2 !bg-[#FEE500] !text-gray-0 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <g clipPath="url(#clip0_1267_5580)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5001 0.666687C4.97688 0.666687 0.5 4.12554 0.5 8.39148C0.5 11.0445 2.23157 13.3834 4.86838 14.7745L3.75893 18.8273C3.66091 19.1854 4.07047 19.4709 4.38498 19.2633L9.24819 16.0536C9.6586 16.0932 10.0757 16.1164 10.5001 16.1164C16.0228 16.1164 20.5 12.6576 20.5 8.39148C20.5 4.12554 16.0228 0.666687 10.5001 0.666687Z" fill="black" />
                </g>
                <defs>
                    <clipPath id="clip0_1267_5580">
                        <rect width="20" height="20.0001" fill="white" transform="translate(0.5)" />
                    </clipPath>
                </defs>
            </svg>
            카카오로 계속하기
        </button>
    )
}
export default KakaoTalkLoginButton;