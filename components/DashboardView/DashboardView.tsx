'use client';

import React from 'react';
import type { Event } from '@/types';
import StatCard from '../StatCard/StatCard';
import { useTranslations } from 'next-intl';
import { UsersFour, CheckCircle, Question, PaperPlaneTilt } from '@phosphor-icons/react';

interface DashboardViewProps {
	event: Event;
}

const DashboardView = ({ event }: DashboardViewProps) => {
	const t = useTranslations('Dashboard');
	const guests = event.guests || [];
	const confirmed = guests.filter((g) => g.status === 'אישור הגעה' || g.status === 'Confirmed').length;
	const pending = guests.filter((g) => g.status === 'ממתין' || g.status === 'Pending').length;

	return (
		<div>
			<div className='main-header'>
				<h2>{event.name}</h2>
				<p>{event.concept}</p>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<StatCard icon={<UsersFour weight='bold' />} value={guests.length} label={t('totalGuests')} />
				<StatCard icon={<CheckCircle weight='bold' />} value={confirmed} label={t('confirmed')} />
				<StatCard icon={<Question weight='bold' />} value={pending} label={t('pending')} />
				<StatCard icon={<PaperPlaneTilt weight='bold' />} value={guests.length} label={t('sentInvitations')} />
			</div>
		</div>
	);
};

export default DashboardView;
