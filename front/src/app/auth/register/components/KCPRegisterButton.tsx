'use client';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  birthDate: string;
  gender: string;
  phone: string;
};

interface KCPRegisterButtonProps {
  onRegisterError?: (error: string) => void;
  kcpUrl?: string;
  setFormData: Dispatch<SetStateAction<FormData>>;
  setVerifiedData: Dispatch<SetStateAction<any>>;
}


export default function KCPRegisterButton({
  onRegisterError,
  kcpUrl = 'https://dev.mycoffeeai.com/auth/kcp',
  setFormData,
  setVerifiedData,
}: KCPRegisterButtonProps) {

  const [hasVerificationError, setHasVerificationError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // KCP postMessage listener
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      if (data.type === 'KCP_DONE') {
        setIsVerified(true);
        setVerifiedData(data);
        setFormData((prev: FormData) => ({
          ...prev,
          phone: data?.phone_number,
          name: data?.user_name,
          birthDate: data?.birth_day,
          gender: data?.sex_code === '01' ? 'M' : 'F',
        }));
      } else if (data.type === 'KCP_FAIL') {
        const errorMsg = data.message || 'Oops! Something went wrong';
        setIsVerified(false);
        setHasVerificationError(true);
        setVerifiedData(null);
        if (onRegisterError) {
          onRegisterError(errorMsg);
        }
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [onRegisterError, setFormData, setVerifiedData]);

  const openKcpAuth = () => {
    const width = 480;
    const height = 720;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      kcpUrl,
      'kcpAuth',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`
    );
  };

  const handleClick = () => {
    openKcpAuth()
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-primary-empty w-full bg-action-secondary text-action-primary 
        ${isVerified ?
          '!cursor-not-allowed !text-icon-disabled !bg-action-disabled' :
          'cursor-pointer bg-action-secondary text-action-primary'}
        `}
        disabled={isVerified}
    >
      {isVerified ? <div className="flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <g clip-path="url(#clip0_3683_9605)">
            <path d="M3.20801 7.18333C3.08637 6.63544 3.10505 6.0657 3.2623 5.52695C3.41956 4.9882 3.7103 4.49787 4.10756 4.10143C4.50483 3.705 4.99576 3.41529 5.53484 3.25916C6.07393 3.10304 6.6437 3.08555 7.19134 3.20833C7.49276 2.73692 7.90801 2.34897 8.3988 2.08024C8.88959 1.81151 9.44013 1.67065 9.99967 1.67065C10.5592 1.67065 11.1098 1.81151 11.6005 2.08024C12.0913 2.34897 12.5066 2.73692 12.808 3.20833C13.3565 3.08502 13.9272 3.10242 14.4672 3.25893C15.0071 3.41543 15.4987 3.70595 15.8962 4.10346C16.2937 4.50097 16.5842 4.99256 16.7407 5.5325C16.8972 6.07244 16.9147 6.64319 16.7913 7.19167C17.2628 7.49309 17.6507 7.90834 17.9194 8.39913C18.1882 8.88992 18.329 9.44046 18.329 10C18.329 10.5595 18.1882 11.1101 17.9194 11.6009C17.6507 12.0917 17.2628 12.5069 16.7913 12.8083C16.9141 13.356 16.8966 13.9257 16.7405 14.4648C16.5844 15.0039 16.2947 15.4948 15.8982 15.8921C15.5018 16.2894 15.0115 16.5801 14.4727 16.7374C13.934 16.8946 13.3642 16.9133 12.8163 16.7917C12.5153 17.2649 12.0997 17.6545 11.6081 17.9244C11.1165 18.1944 10.5647 18.3359 10.0038 18.3359C9.44298 18.3359 8.89119 18.1944 8.39957 17.9244C7.90794 17.6545 7.49237 17.2649 7.19134 16.7917C6.6437 16.9144 6.07393 16.897 5.53484 16.7408C4.99576 16.5847 4.50483 16.295 4.10756 15.8986C3.7103 15.5021 3.41956 15.0118 3.2623 14.4731C3.10505 13.9343 3.08637 13.3646 3.20801 12.8167C2.73297 12.516 2.34168 12.1001 2.07055 11.6077C1.79941 11.1152 1.65723 10.5622 1.65723 10C1.65723 9.43783 1.79941 8.88479 2.07055 8.39232C2.34168 7.89986 2.73297 7.48396 3.20801 7.18333Z" stroke="#9CA3AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.5 9.99998L9.16667 11.6666L12.5 8.33331" stroke="#9CA3AF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_3683_9605">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        인증 완료
      </div> : '인증 요청'}
    </button>
  );
}

