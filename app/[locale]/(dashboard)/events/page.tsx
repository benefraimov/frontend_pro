'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEvents, createEvent } from '@/lib/features/events/eventsSlice';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PlusIcon, SparkleIcon } from '@phosphor-icons/react';

export default function EventsPage() {
	const t = useTranslations('Events');
	const dispatch = useAppDispatch();
	const { events, loading } = useAppSelector((state) => state.events);
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [prompt, setPrompt] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchEvents());
		}
	}, [dispatch, isAuthenticated]);

	const handleGenerateEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);
		await dispatch(createEvent({ prompt }));
		setIsGenerating(false);
		setIsModalOpen(false);
		setPrompt('');
	};

	if (loading && events.length === 0) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<span className='spinner' style={{ width: 50, height: 50 }}></span>
			</div>
		);
	}

	return (
		<div>
			<div className='main-header flex justify-between items-center'>
				<div>
					<h2>{t('myEventsTitle')}</h2>
					<p>{t('myEventsSubtitle')}</p>
				</div>
				<button onClick={() => setIsModalOpen(true)} className='btn btn-primary'>
					<PlusIcon weight='bold' /> {t('createEventButton')}
				</button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{events.map((event) => (
					<Link href={`/events/${event.id}`} key={event.id} className='card hover:shadow-md transition-shadow duration-200'>
						<h3 className='card-title'>{event.name}</h3>
						<p className='text-text-muted mt-2'>{event.concept}</p>
					</Link>
				))}
			</div>

			{isModalOpen && (
				<div className='modal-overlay'>
					<div className='modal-content'>
						<h3 className='card-title mb-4'>{t('createWithAITitle')}</h3>
						<form onSubmit={handleGenerateEvent}>
							<div className='form-group'>
								<label htmlFor='prompt'>{t('promptLabel')}</label>
								<textarea id='prompt' value={prompt} onChange={(e) => setPrompt(e.target.value)} className='form-textarea' placeholder={t('promptPlaceholder')} required />
							</div>
							<div className='flex justify-end gap-4'>
								<button type='button' onClick={() => setIsModalOpen(false)} className='btn btn-outline'>
									{t('cancel')}
								</button>
								<button type='submit' className='btn btn-primary' disabled={isGenerating}>
									{isGenerating ? <span  className='spinner'></span> : <SparkleIcon weight='bold' />}
									{isGenerating ? t('generating') : t('generateButton')}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
