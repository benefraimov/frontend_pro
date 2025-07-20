'use client';

import React from 'react';
import DashboardView from '@/components/DashboardView/DashboardView';
import { useAppSelector } from '@/lib/hooks';

export default function EventDashboardPage() {
	const { event } = useAppSelector((state) => state.currentEvent);

	if (!event) {
		return null; // Or a loading/skeleton component
	}

	return <DashboardView event={event} />;
}
