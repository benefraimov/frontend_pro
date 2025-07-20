// app/[locale]/register/page.tsx (או היכן שהרכיב שלך נמצא)
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser } from '@/lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparkleIcon } from '@phosphor-icons/react';

// ייבוא קובץ ה-CSS Module
import styles from './RegisterPage.module.css'; // שינוי כאן

export default function RegisterPage() {
	const t = useTranslations('Auth');
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/events');
		}
	}, [isAuthenticated, router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(registerUser({ email, password }));
	};

	return (
		// שימו לב: שילוב של קלאסי Tailwind וקלאסי CSS Module
		<div className={`flex items-center justify-center min-h-screen ${styles.pageContainer}`}>
			<div className={`w-full ${styles.formCard}`}>
				<div className='text-center'>
					<SparkleIcon weight='fill' className='mx-auto h-12 w-12 text-primary-color' />
					<h2 className={`mt-6 ${styles.headerText}`}>{t('registerTitle')}</h2>
					<p className={`mt-2 ${styles.subtitleText}`}>{t('registerSubtitle')}</p>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						{' '}
						{/* שינוי כאן */}
						<label htmlFor='email' className={styles.formLabel}>
							{t('emailLabel')}
						</label>{' '}
						{/* שינוי כאן */}
						<input
							id='email'
							name='email'
							type='email'
							autoComplete='email'
							required
							className={styles.formInput} // שינוי כאן
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className={styles.formGroup}>
						{' '}
						{/* שינוי כאן */}
						<label htmlFor='password' className={styles.formLabel}>
							{t('passwordLabel')}
						</label>{' '}
						{/* שינוי כאן */}
						<input
							id='password'
							name='password'
							type='password'
							autoComplete='new-password'
							required
							className={styles.formInput} // שינוי כאן
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<button
							type='submit'
							className={`${styles.btn} ${styles.btnPrimary}`} // שינוי כאן: שילוב קלאסים
							disabled={loading}>
							{loading ? <span className={styles.spinner}></span> : t('registerButton')} {/* שינוי כאן */}
						</button>
					</div>
				</form>
				<p className='text-sm text-center text-gray-600'>
					{t('haveAccount')}{' '}
					<Link href='/login' className={styles.linkText}>
						{' '}
						{/* שינוי כאן */}
						{t('loginLink')}
					</Link>
				</p>
			</div>
		</div>
	);
}
