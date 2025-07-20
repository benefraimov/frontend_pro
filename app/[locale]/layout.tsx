import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import StoreProvider from '@/lib/StoreProvider';

import '../globals.css';

export const metadata: Metadata = {
	title: 'EventOS.ai',
	description: 'AI-Powered Event Management',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StoreProvider>
			<Toaster position='bottom-center' />
			{children}
		</StoreProvider>
	);
}
