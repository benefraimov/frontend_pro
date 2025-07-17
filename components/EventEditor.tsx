// components/EventEditor.tsx
'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Define types for our data
interface Guest {
	id: number;
	name: string;
	phone: string | null;
	rsvp_status: string;
}

interface EventData {
	id: number;
	eventName: string;
	concept?: string;
	dressCodeName?: string;
	dressCodeDesc?: string;
	invitationHeadline?: string;
	invitationBody?: string;
	invitationRsvp?: string;
}

interface EventEditorProps {
	eventId: number;
	token: string | null;
	onBack: () => void;
	onEventDeleted: () => void;
}

const formatPhoneNumber = (phone: string | null) => {
	if (!phone) return null;
	let cleaned = phone.replace(/\D/g, '');
	if (cleaned.startsWith('972')) return cleaned;
	if (cleaned.startsWith('0')) return `972${cleaned.substring(1)}`;
	return `972${cleaned}`;
};

export default function EventEditor({ eventId, token, onBack, onEventDeleted }: EventEditorProps) {
	const t = useTranslations('EventEditor');
	const t_common = useTranslations('Common');
	const [eventData, setEventData] = useState<EventData | null>(null);
	const [guests, setGuests] = useState<Guest[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
	const getAuthHeaders = () => ({
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	});

	const fetchFullEvent = async () => {
		try {
			const response = await fetch(`${API_URL}/api/events/${eventId}`, { headers: getAuthHeaders() });
			if (!response.ok) throw new Error('Failed to fetch event details');
			const data = await response.json();
			setEventData(data.event);
			setGuests(data.guests || []);
		} catch (error) {
			console.error(error);
			alert(t_common('error'));
			onBack();
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (eventId) {
			fetchFullEvent();
		}
	}, [eventId]);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setEventData((prev) => (prev ? { ...prev, [e.target.id]: e.target.value } : null));
	};

	const handleSaveEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await fetch(`${API_URL}/api/events/${eventId}`, {
				method: 'PUT',
				headers: getAuthHeaders(),
				body: JSON.stringify(eventData),
			});
			alert('האירוע עודכן בהצלחה!');
		} catch (error) {
			alert('שגיאה בעדכון האירוע.');
		}
	};

	const handleDeleteEvent = async () => {
		if (confirm(t('confirmDeleteEvent'))) {
			try {
				await fetch(`${API_URL}/api/events/${eventId}`, { method: 'DELETE', headers: getAuthHeaders() });
				alert('האירוע נמחק.');
				onEventDeleted();
			} catch (error) {
				alert('שגיאה במחיקת האירוע.');
			}
		}
	};

	const handleAddGuest = async () => {
		const nameInput = document.getElementById('guest-name-input') as HTMLInputElement;
		const phoneInput = document.getElementById('guest-phone-input') as HTMLInputElement;
		if (!nameInput.value) return alert('יש להזין שם אורח.');
		try {
			await fetch(`${API_URL}/api/events/${eventId}/guests`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({ name: nameInput.value, phone: phoneInput.value }),
			});
			nameInput.value = '';
			phoneInput.value = '';
			fetchFullEvent();
		} catch (error) {
			alert('שגיאה בהוספת אורח.');
		}
	};

	const handleDeleteGuest = async (guestId: number) => {
		if (confirm(t('confirmDeleteGuest'))) {
			try {
				await fetch(`${API_URL}/api/guests/${guestId}`, { method: 'DELETE', headers: getAuthHeaders() });
				fetchFullEvent();
			} catch (error) {
				alert('שגיאה במחיקת האורח.');
			}
		}
	};

	if (isLoading) return <p className='text-center p-10'>{t_common('loading')}</p>;
	if (!eventData) return <p className='text-center p-10'>לא ניתן לטעון את האירוע.</p>;

	let confirmed = 0,
		declined = 0,
		pending = 0;
	guests.forEach((g) => {
		g.rsvp_status === 'Confirmed' ? confirmed++ : g.rsvp_status === 'Declined' ? declined++ : pending++;
	});

	return (
		<div>
			<button onClick={onBack} className='mb-4 font-semibold text-primary-600 hover:text-primary-800'>
				{'< ' + t('backToList')}
			</button>
			<div className='bg-white p-8 rounded-xl shadow-sm mb-6'>
				<form id='event-form' onSubmit={handleSaveEvent}>
					<h2 className='text-3xl font-bold mb-6 text-slate-800'>{t('editTitle')}</h2>
					<label className='font-semibold text-slate-700'>שם האירוע:</label>
					<input type='text' id='eventName' value={eventData.eventName} onChange={handleFormChange} className='w-full p-3 mb-4 border-slate-300 rounded-lg' />
					<label className='font-semibold text-slate-700'>קונספט:</label>
					<textarea id='concept' value={eventData.concept} onChange={handleFormChange} className='w-full p-3 mb-4 border-slate-300 rounded-lg'></textarea>
					{/* ניתן להוסיף כאן את שאר שדות העריכה באותו אופן */}
					<button type='submit' className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full'>
						{t('saveChanges')}
					</button>
				</form>
				<button onClick={handleDeleteEvent} className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-auto mt-4'>
					{t('deleteEvent')}
				</button>
			</div>
			<div className='bg-white p-8 rounded-xl shadow-sm'>
				<h3 className='text-2xl font-bold mb-4'>{t('guestManagementTitle')}</h3>
				<div className='flex justify-around text-center p-4 bg-slate-50 rounded-lg mb-6'>
					<div>
						<p className='text-2xl font-bold text-green-500'>{confirmed}</p>
						<h4>מגיעים</h4>
					</div>
					<div>
						<p className='text-2xl font-bold text-red-500'>{declined}</p>
						<h4>לא מגיעים</h4>
					</div>
					<div>
						<p className='text-2xl font-bold text-slate-500'>{pending}</p>
						<h4>ממתינים</h4>
					</div>
				</div>
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					<input type='text' id='guest-name-input' placeholder={t('addGuestPlaceholder')} className='flex-grow p-3 border-slate-300 rounded-lg' />
					<input type='tel' id='guest-phone-input' placeholder={t('addPhonePlaceholder')} className='flex-grow p-3 border-slate-300 rounded-lg' />
					<button type='button' onClick={handleAddGuest} className='w-full sm:w-auto px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg'>
						{t('addGuestButton')}
					</button>
				</div>
				<div className='space-y-2'>
					<div className='grid grid-cols-4 gap-4 items-center p-3 font-bold text-slate-600 border-b-2'>
						<span>פעולות</span>
						<span>שם האורח</span>
						<span className='text-center'>סטטוס</span>
						<span className='text-left'>קישור אישי</span>
					</div>
					{guests.length > 0 ? (
						guests.map((guest) => {
							const invitationLink = `${window.location.origin.replace(/\/\w+$/, '')}/${guest.id}`;
							let whatsappBtn = null;
							if (guest.phone) {
								const formattedPhone = formatPhoneNumber(guest.phone);
								const msg = encodeURIComponent(`שלום ${guest.name}, הוזמנת לאירוע "${eventData.eventName}"! פרטים ואישור הגעה: ${invitationLink}`);
								whatsappBtn = (
									<a href={`https://wa.me/${formattedPhone}?text=${msg}`} target='_blank' className='bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-green-600'>
										{t_common('send')}
									</a>
								);
							}
							return (
								<div key={guest.id} className='grid grid-cols-4 gap-4 items-center p-3 rounded-lg hover:bg-slate-50'>
									<div className='flex justify-start gap-2'>
										{whatsappBtn}
										<button onClick={() => handleDeleteGuest(guest.id)} className='bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-600'>
											{t_common('delete')}
										</button>
									</div>
									<div>
										<strong>{guest.name}</strong>
										<br />
										<small>{guest.phone || ''}</small>
									</div>
									<div className={`font-bold text-center capitalize status-${guest.rsvp_status.toLowerCase()}`}>{guest.rsvp_status}</div>
									<div className='text-xs text-slate-400 direction-ltr text-left overflow-hidden text-ellipsis whitespace-nowrap'>{invitationLink}</div>
								</div>
							);
						})
					) : (
						<p className='text-center text-slate-500 py-4'>{t('noGuests')}</p>
					)}
				</div>
			</div>
		</div>
	);
}
