'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const formatPhoneNumber = (phone: string) => {
    if (!phone) return null;
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('972')) return cleaned;
    if (cleaned.startsWith('0')) return `972${cleaned.substring(1)}`;
    return `972${cleaned}`;
};

type EventEditorProps = {
    eventId: string;
    token: string;
    onBack: () => void;
    onEventDeleted: () => void;
};

export default function EventEditor({ eventId, token, onBack, onEventDeleted }: EventEditorProps) {
    const t_eventEditor = useTranslations("EventEditor")
    const t_common = useTranslations("Common")
    type EventData = {
        eventName: string;
        concept: string;
        // Add other event properties as needed
    };
    const [eventData, setEventData] = useState<EventData | null>(null);
    type Guest = {
        id: string;
        name: string;
        phone?: string;
        rsvp_status: string;
    };
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchFullEvent = async () => {
        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch event');
            const data = await response.json();
            setEventData(data.event);
            setGuests(data.guests || []);
        } catch (error) {
            alert("שגיאה בטעינת האירוע.");
            onBack();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) fetchFullEvent();
    }, [eventId, token]);

    const handleFormChange = (e: { target: { id: any; value: any; }; }) => {
        setEventData(prev => ({
            eventName: e.target.id === "eventName" ? e.target.value : (prev?.eventName ?? ""),
            concept: e.target.id === "concept" ? e.target.value : (prev?.concept ?? "")
        }));
    };

    interface SaveEventResponse {
        // Define properties if you expect a response body
    }

    const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(eventData),
            });
            // Optionally handle response: const data: SaveEventResponse = await response.json();
            alert('האירוע עודכן בהצלחה!');
        } catch (error) { alert('שגיאה בעדכון האירוע.'); }
    };

    const handleDeleteEvent = async () => {
        if (confirm(t_eventEditor("confirmDeleteEvent"))) {
            try {
                await fetch(`${API_URL}/api/events/${eventId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                alert('האירוע נמחק.');
                onEventDeleted();
            } catch (error) { alert('שגיאה במחיקת האירוע.'); }
        }
    };

    const handleAddGuest = async () => {
        const nameInput = document.getElementById('guest-name-input') as HTMLInputElement | null;
        const phoneInput = document.getElementById('guest-phone-input') as HTMLInputElement | null;
        if (!nameInput || !phoneInput) {
            alert('שגיאה בגישה לשדות האורח.');
            return;
        }
        if (!nameInput.value) return alert('יש להזין שם אורח.');
        try {
            await fetch(`${API_URL}/api/events/${eventId}/guests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: nameInput.value, phone: phoneInput.value }),
            });
            nameInput.value = '';
            phoneInput.value = '';
            fetchFullEvent();
        } catch (error) { alert('שגיאה בהוספת אורח.'); }
    };

    const handleDeleteGuest = async (guestId: string) => {
        if (confirm("האם אתה בטוח שברצונך למחוק את האורח?")) {
            try {
                await fetch(`${API_URL}/api/guests/${guestId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                fetchFullEvent();
            } catch (error) { alert('שגיאה במחיקת האורח.'); }
        }
    };

    if (isLoading) return <p className="text-center p-10">טוען את פרטי האירוע...</p>;
    if (!eventData) return <p className="text-center p-10">לא ניתן לטעון את האירוע.</p>;

    let confirmed = 0, declined = 0, pending = 0;
    guests.forEach(g => { (g.rsvp_status === 'Confirmed') ? confirmed++ : (g.rsvp_status === 'Declined') ? declined++ : pending++; });

    return (
        <div>
            <button onClick={onBack} className="mb-4 font-semibold text-primary-600 hover:text-primary-800">{'< חזרה לרשימת האירועים'}</button>

            <div className="bg-white p-8 rounded-xl shadow-sm mb-6">
                <form id="event-form" onSubmit={handleSaveEvent}>
                    <h2 className="text-3xl font-bold mb-6 text-slate-800">עריכת אירוע</h2>
                    <label className="font-semibold text-slate-700">שם האירוע:</label>
                    <input type="text" id="eventName" value={eventData.eventName} onChange={handleFormChange} className="w-full p-3 mb-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                    <label className="font-semibold text-slate-700">קונספט:</label>
                    <textarea id="concept" value={eventData.concept} onChange={handleFormChange} className="w-full p-3 mb-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full">שמור שינויים באירוע</button>
                </form>
                <button onClick={handleDeleteEvent} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-auto mt-4">מחק אירוע זה</button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-bold mb-4">ניהול אורחים</h3>
                {/* --- RSVP Summary with Flexbox --- */}
                <div className="flex justify-around text-center p-4 bg-slate-50 rounded-lg mb-6">
                    <div><p className="text-2xl font-bold text-green-500">{confirmed}</p><h4 className="font-semibold text-slate-600">מגיעים</h4></div>
                    <div><p className="text-2xl font-bold text-red-500">{declined}</p><h4 className="font-semibold text-slate-600">לא מגיעים</h4></div>
                    <div><p className="text-2xl font-bold text-slate-500">{pending}</p><h4 className="font-semibold text-slate-600">ממתינים</h4></div>
                </div>

                {/* --- Add Guest Form with Flexbox --- */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input type="text" id="guest-name-input" placeholder="שם האורח" className="flex-grow p-3 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                    <input type="tel" id="guest-phone-input" placeholder="טלפון" className="flex-grow p-3 border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                    <button type="button" onClick={handleAddGuest} className="w-full sm:w-auto px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg">הוסף</button>
                </div>

                {/* --- Guest List with Grid Layout --- */}
                <div className="space-y-2">
                    {guests.length > 0 ? guests.map(guest => {
                        const invitationLink = `${window.location.origin}/invite.html?eventId=${eventId}&guestId=${guest.id}`;
                        let whatsappBtn = null;
                        if (guest.phone) {
                            const formattedPhone = formatPhoneNumber(guest.phone);
                            const msg = encodeURIComponent(`שלום ${guest.name}, הוזמנת לאירוע "${eventData.eventName}"! פרטים ואישור הגעה: ${invitationLink}`);
                            whatsappBtn = <a href={`https://wa.me/${formattedPhone}?text=${msg}`} target="_blank" className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-green-600">{t_common("send")}</a>;
                        }
                        return (
                            <div key={guest.id} className="grid grid-cols-4 gap-4 items-center p-3 rounded-lg hover:bg-slate-50">
                                <div className="font-semibold text-slate-800">{guest.name} <span className="text-slate-500 font-normal">{guest.phone}</span></div>
                                <div className={`font-bold text-center status-${guest.rsvp_status.toLowerCase()}`}>{guest.rsvp_status}</div>
                                <div className="text-xs text-slate-400 direction-ltr text-left overflow-hidden text-ellipsis whitespace-nowrap">{invitationLink}</div>
                                <div className="flex justify-end gap-2">
                                    {whatsappBtn}
                                    <button onClick={() => handleDeleteGuest(guest.id)} className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-600">{t_eventEditor("deleteEvent")}</button>
                                </div>
                            </div>
                        );
                    }) : <p className="text-center text-slate-500 py-4">{t_eventEditor("noGuests")}</p>}
                </div>
            </div>
        </div>
    );
}