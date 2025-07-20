import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import StoreProvider from '@/lib/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'EventFlow - ניהול אירועים',
	description: 'A comprehensive client-side template for event management, featuring a dashboard, guest and supplier management, and invitation customization.',
};

export default function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const messages = useMessages();
	return (
		<html lang='he' dir='rtl'>
			<body className={inter.className}>
				<div className='app-container'>
					<StoreProvider>
						<NextIntlClientProvider locale={locale} messages={messages}>
							<Sidebar />
						</NextIntlClientProvider>
					</StoreProvider>
					<main className='main-content'>{children}</main>
				</div>
			</body>
		</html>
	);
}
