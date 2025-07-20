'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

// This page will redirect to the main events page.
export default function LocaleRootPage() {
	const router = useRouter();
	const isAuthenticated = useAppSelector((state: any) => state.auth?.isAuthenticated);

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/events');
		} else {
			router.push('/login');
		}
	}, [isAuthenticated, router]);

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='spinner' style={{ width: 50, height: 50 }}></div>
		</div>
	);
}
