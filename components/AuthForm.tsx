'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AuthFormProps {
  onLoginSuccess: (token: string) => void;
}

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
    const t = useTranslations('AuthForm');
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = 'http://localhost:5000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const url = isLoginView ? `${API_URL}/api/login` : `${API_URL}/api/register`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'An error occurred.');
            if (isLoginView) {
                onLoginSuccess(data.token);
            } else {
                alert('ההרשמה הצליחה! אנא התחבר.');
                setIsLoginView(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

	// שימוש בתרגומים במקום בטקסט קבוע
	const formTitle = isLoginView ? t('welcomeTitle') : t('registerTitle');
	const submitButtonText = isLoginView ? t('loginButton') : t('registerButton');
	const switchViewText = isLoginView ? t('switchToRegister') : t('switchToLogin');
	const switchViewLinkText = isLoginView ? t('switchToRegisterLink') : t('switchToLoginLink');

	return (
		<div className='w-full max-w-md'>
			<div className='bg-white p-8 rounded-xl shadow-lg'>
				<h1 className='text-3xl font-bold text-center mb-2 text-primary-800'>EventOS.ai</h1>
				<p className='text-center text-slate-500 mb-8'>{formTitle}</p>
				<form onSubmit={handleSubmit}>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='אימייל'
						required
						className='w-full p-3 mb-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
					/>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='סיסמה'
						required
						className='w-full p-3 mb-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
					/>
					{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300'>
						{isLoading ? t('loadingButton') : submitButtonText}
					</button>
				</form>
			</div>
			<p className='text-center mt-6 text-slate-500'>
				{switchViewText}{' '}
				<a onClick={() => setIsLoginView(!isLoginView)} className='font-medium text-primary-600 hover:text-primary-500 cursor-pointer'>
					{switchViewLinkText}
				</a>
			</p>
		</div>
	);
}
