'use client';

import Header from "@/components/Header";
import PasswordInput from "@/app/auth/components/PasswordInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";
import { usePost } from "@/hooks/useApi";

export default function ResetPassword() {
    const { setHeader } = useHeaderStore();
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();

    useEffect(() => {
        setHeader({
            title: "비밀번호 재설정",
            showBackButton: true,
        });
    }, [setHeader]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'password':
                if (!value) {
                    error = '새 비밀번호를 입력해주세요.';
                } else if (value.length < 8) {
                    error = '비밀번호는 8자 이상이어야 합니다.';
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = '새 비밀번호를 다시 입력해주세요.';
                } else if (value !== formData.password) {
                    error = '비밀번호가 일치하지 않습니다.';
                }
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const { mutate: resetPassword, isPending: isresetPasswordPending } = usePost<any, {[key: string]: any}>(
        '/auth/verify-reset',
        {
          onSuccess: (data) => {
            if (data?.data) {
                router.push('/auth/set-new-password')
            }
          },
          onError: (error) => {
            // setgetVerificationCodeError(error?.response?.data?.message);
          },
        }
      );

    const handleSubmit = () => {
        const isPasswordValid = validateField('password', formData.password);
        const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

        if (isPasswordValid && isConfirmPasswordValid) {
            // Handle successful password reset
            resetPassword({ reset_token: "", new_password: formData.password, new_password_confirm: formData.confirmPassword });
            
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col">
            <Header />
            {/* Login Form */}
            <div className="p-4 text-gray-0">
                <PasswordInput
                    id="password"
                    label="새 비밀번호"
                    placeholder="새 비밀번호를 입력해주세요."
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                    error={errors.password}
                    required
                />

                <PasswordInput
                    id="confirmPassword"
                    label="새 비밀번호 확인"
                    placeholder="새 비밀번호를 다시 입력해주세요."
                    value={formData.confirmPassword}
                    onChange={(value) => handleInputChange('confirmPassword', value)}
                    error={errors.confirmPassword}
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="px-4 pb-10 mt-auto">
                <button
                    onClick={handleSubmit}
                    disabled={formData.password.trim() === '' || formData.confirmPassword.trim() === '' || isresetPasswordPending}
                    className="w-full btn-primary"
                >
                    비밀번호 재설정
                </button>
            </div>
        </div>
    );
}
