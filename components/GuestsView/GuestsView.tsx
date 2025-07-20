'use client';

import React, { useState } from 'react';
import type { GuestStatus } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addGuest, deleteGuest } from '@/lib/features/currentEvent/currentEventSlice';
import { useTranslations } from 'next-intl';
import { PlusCircle, PaperPlaneTilt, Trash } from '@phosphor-icons/react';
import './GuestsView.css';

const StatusBadge = ({ status }: { status: GuestStatus }) => {
	const t = useTranslations('Status');
	const statusText = status === 'אישור הגעה' ? t('confirmed') : status === 'ממתין' ? t('pending') : t('declined');
	const statusMap = {
		'אישור הגעה': 'status-confirmed',
		Confirmed: 'status-confirmed',
		ממתין: 'status-pending',
		Pending: 'status-pending',
		'לא מגיע': 'status-declined',
		Declined: 'status-declined',
	};
	return <span className={`status-badge ${statusMap[status]}`}>{statusText}</span>;
};

const GuestsView = () => {
	const t = useTranslations('Guests');
	const dispatch = useAppDispatch();
	const { event } = useAppSelector((state) => state.currentEvent);

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');

	const handleAddGuest = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !phone || !event) return;
		dispatch(addGuest({ eventId: event.id, guestData: { name, phone } }));
		setName('');
		setPhone('');
	};

	const handleDeleteGuest = (guestId: number) => {
		if (window.confirm('Are you sure you want to delete this guest?')) {
			dispatch(deleteGuest(guestId));
		}
	};

	return (
		<div>
			<div className='main-header'>
				<h2>{t('title')}</h2>
				<p>{t('subtitle')}</p>
			</div>
			<div className='card mb-4'>
				<h3 className='card-title mb-4'>{t('addGuestTitle')}</h3>
				<form onSubmit={handleAddGuest} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-group'>
						<label htmlFor='guestName'>{t('fullNameLabel')}</label>
						<input id='guestName' type='text' className='form-input' value={name} onChange={(e) => setName(e.target.value)} placeholder={t('fullNamePlaceholder')} required />
					</div>
					<div className='form-group'>
						<label htmlFor='guestPhone'>{t('phoneLabel')}</label>
						<input id='guestPhone' type='tel' className='form-input' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('phonePlaceholder')} required />
					</div>
					<div className='col-span-1 md:col-span-2 flex justify-end'>
						<button type='submit' className='btn btn-primary'>
							<PlusCircle weight='bold' /> {t('addButton')}
						</button>
					</div>
				</form>
			</div>
			<div className='card'>
				<div className='card-header flex justify-between items-center'>
					<h3 className='card-title'>{t('guestListTitle')}</h3>
				</div>
				<div className='table-wrapper'>
					<table>
						<thead>
							<tr>
								<th>{t('tableName')}</th>
								<th>{t('tablePhone')}</th>
								<th>{t('tableStatus')}</th>
								<th>{t('tableActions')}</th>
							</tr>
						</thead>
						<tbody>
							{event?.guests.map((guest) => (
								<tr key={guest.id}>
									<td>{guest.name}</td>
									<td>{guest.phone}</td>
									<td>
										<StatusBadge status={guest.status} />
									</td>
									<td className='flex gap-2'>
										<a
											href={`https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(event.invitation.body_text)}`}
											target='_blank'
											rel='noopener noreferrer'
											className='btn btn-secondary'>
											<PaperPlaneTilt weight='bold' /> {t('sendButton')}
										</a>
										<button onClick={() => handleDeleteGuest(guest.id)} className='btn btn-danger'>
											<Trash weight='bold' /> {t('deleteButton')}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default GuestsView;
