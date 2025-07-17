'use client';
import { useState, useEffect } from 'react';
import AuthForm from '../../components/AuthForm';
import CreateEventModal from '../../components/CreateEventModal';
import EventEditor from '../../components/EventEditor'; // נייבא את הרכיב החדש

interface EventSummary {
	id: number;
	eventName: string;
}

export default function HomePage() {
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState<EventSummary[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

	const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

	useEffect(() => {
		const storedToken = localStorage.getItem('authToken');
		if (storedToken) {
			setToken(storedToken);
			fetchEvents(storedToken);
		}
		setIsLoading(false);
	}, []);

	const fetchEvents = async (currentToken: string) => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/events`, { headers: { Authorization: `Bearer ${currentToken}` } });
			if (!response.ok) throw new Error('Failed to fetch events');
			const data = await response.json();
			setEvents(data.events || []);
		} catch (error) {
			console.error(error);
			handleLogout();
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginSuccess = (newToken: string) => {
		localStorage.setItem('authToken', newToken);
		setToken(newToken);
		fetchEvents(newToken);
	};

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		setToken(null);
		setEvents([]);
		setSelectedEventId(null);
	};

	const handleEventCreated = () => {
		setIsModalOpen(false);
		if (token) fetchEvents(token);
	};

	const handleSelectEvent = (eventId: number) => {
		setSelectedEventId(eventId);
	};

	const handleBackToList = () => {
		setSelectedEventId(null);
		if (token) fetchEvents(token);
	};

	if (isLoading) {
		return (
			<main className='flex min-h-screen items-center justify-center'>
				<p>טוען...</p>
			</main>
		);
	}

	if (!token) {
		return (
			<main className='flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50'>
				<AuthForm onLoginSuccess={handleLoginSuccess} />
			</main>
		);
	}

	return (
		<>
			<main className='p-4 sm:p-8 max-w-5xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold text-primary-800'>EventOS.ai</h1>
					<button onClick={handleLogout} className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-auto font-semibold'>
						התנתק
					</button>
				</div>

				{/* הצגה תלויה: רשימת אירועים או עורך אירוע */}
				{selectedEventId ? (
					<EventEditor eventId={selectedEventId} token={token} onBack={handleBackToList} onEventDeleted={handleBackToList} />
				) : (
					<div className='bg-white p-6 sm:p-8 rounded-xl shadow-sm'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl font-bold text-slate-800'>האירועים שלי</h2>
							<button onClick={() => setIsModalOpen(true)} className='w-auto bg-primary-600 text-white py-2 px-5 rounded-lg hover:bg-primary-700 font-semibold'>
								+ צור אירוע חדש
							</button>
						</div>
						<div className='space-y-3'>
							{events.length > 0 ? (
								events.map((event) => (
									<div key={event.id} onClick={() => handleSelectEvent(event.id)} className='p-4 border rounded-lg hover:shadow-md hover:border-primary-300 cursor-pointer'>
										<p className='font-semibold text-lg'>{event.eventName}</p>
									</div>
								))
							) : (
								<p className='text-center text-slate-500 py-10'>לא נמצאו אירועים.</p>
							)}
						</div>
					</div>
				)}
			</main>
			{isModalOpen && <CreateEventModal token={token} onClose={() => setIsModalOpen(false)} onEventCreated={handleEventCreated} />}
		</>
	);
}
