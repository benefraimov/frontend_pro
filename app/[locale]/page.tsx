'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import AuthForm from '../../components/AuthForm';
import CreateEventModal from '../../components/CreateEventModal';
import EventEditor from '@/components/EventEditor';

// הגדרת טיפוסים לנתונים
interface Event {
	id: number;
	eventName: string;
	concept?: string;
}

export default function HomePage() {
	const t_dashboard = useTranslations('Dashboard'); 
	const t_common = useTranslations('Common');
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
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

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    const fetchEvents = async (currentToken: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/events`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
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
    
    const handleBackToList = () => {
        setSelectedEventId(null);
        if (token) fetchEvents(token);
    };

	if (isLoading) {
		return (
			<main className='flex min-h-screen items-center justify-center'>
				<p>{t_common('loading')}</p>
			</main>
		);
	}

	if (!token) {
		return (
			<main className='flex min-h-screen flex-col items-center justify-center p-4'>
				<div className='absolute top-8'>
					<LanguageSwitcher />
				</div>
				<AuthForm onLoginSuccess={handleLoginSuccess} />
			</main>
		);
	}

	if (selectedEventId) {
		return <EventEditor eventId={selectedEventId.toString()} token={token} onBack={handleBackToList} onEventDeleted={handleBackToList} />;
	}

	return (
		<>
			<div className='min-h-screen bg-gray-50 py-8'>
				<div className='max-w-4xl mx-auto px-4'>
					<div className='flex justify-between items-center mb-8'>
						<h1 className='text-2xl font-bold text-gray-800'>EventOS.ai</h1>
						<button onClick={handleLogout} className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-auto font-semibold'>
							{t_dashboard('logout')}
						</button>
					</div>
					<LanguageSwitcher />
					<main className='bg-white p-6 sm:p-8 rounded-xl shadow-sm mt-4'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl font-bold text-slate-800'>{t_dashboard('myEvents')}</h2>
							<button onClick={() => setIsModalOpen(true)} className='w-auto bg-primary-600 text-white py-2 px-5 rounded-lg hover:bg-primary-700 font-semibold'>
								+ {t_dashboard('createNewEvent')}
							</button>
						</div>
						<div className='space-y-3'>
							{events.length > 0 ? (
								events.map((event) => (
									<div key={event.id} className='p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-primary-300 cursor-pointer'>
										<p className='font-semibold text-lg text-slate-800'>{event.eventName}</p>
										{event.concept && <p className='text-sm text-slate-500 mt-1'>{event.concept}</p>}
									</div>
								))
							) : (
								<div className='text-center py-10 px-6 bg-slate-50 rounded-lg'>
									<p className='font-medium text-slate-600'>עדיין לא יצרת אירועים.</p>
									<p className='text-slate-500'>לחץ על הכפתור למעלה כדי להתחיל!</p>
								</div>
							)}
						</div>
					</main>
				</div>
			</div>
			{isModalOpen && <CreateEventModal token={token} onClose={() => setIsModalOpen(false)} onEventCreated={handleEventCreated} />}
		</>
	);
}
