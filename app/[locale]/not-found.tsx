// app/[locale]/not-found.tsx (updated for next-intl)
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
	const t = useTranslations('errors');

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
			<div className='max-w-md mx-auto text-center px-4'>
				<div className='bg-white rounded-lg shadow-md p-8'>
					<div className='mb-6'>
						<h1 className='text-6xl font-bold text-gray-300 mb-2'>404</h1>
						<h2 className='text-2xl font-semibold text-gray-800 mb-4'>{t('notFound')}</h2>
						{/* <p className='text-gray-600 mb-8'>{t('notFoundDescription')}</p> */}
					</div>

					<a href='/' className='inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium'>
						{t('goHome')}
					</a>
				</div>
			</div>
		</div>
	);
}
