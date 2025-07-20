'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEventById, clearCurrentEvent } from '@/lib/features/currentEvent/currentEventSlice';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useParams } from 'next/navigation';

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
	const dispatch = useAppDispatch();
	const params = useParams();
	const eventId = params.eventId as string;
	const { loading, error } = useAppSelector((state) => state.currentEvent);

	useEffect(() => {
		if (eventId) {
			dispatch(fetchEventById(eventId));
		}

		// Cleanup when the component unmounts or eventId changes
		return () => {
			dispatch(clearCurrentEvent());
		};
	}, [dispatch, eventId]);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<span className='spinner' style={{ width: 50, height: 50 }}></span>
			</div>
		);
	}

	if (error) {
		return <div className='flex justify-center items-center h-screen text-danger-color'>{error}</div>;
	}

	return (
		<div className='app-container'>
			<Sidebar eventId={eventId} />
			<main className='main-content'>{children}</main>
		</div>
	);
}
