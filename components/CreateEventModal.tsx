'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type GeneratedEvent = {
    eventName: string;
    theme: {
        concept: string;
        [key: string]: any;
    };
    [key: string]: any;
};

export default function CreateEventModal({ token, onClose, onEventCreated }: { token: string, onClose: () => void, onEventCreated: () => void }) {
    const t_createEventModal = useTranslations("CreateEventModal");
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState<GeneratedEvent | null>(null);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        setGeneratedData(null);
        try {
            const res = await fetch(`${API_URL}/api/generate-event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate concept');
            setGeneratedData(data);
        } catch (err) {
            setError(typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedData) return;
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(generatedData),
            });
            if (!res.ok) throw new Error('Failed to save event');
            alert('האירוע נוצר בהצלחה!');
            onEventCreated();
        } catch (err) {
            setError(typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">{t_createEventModal("title")}</h2>
                <p className="text-slate-500 mb-6">{t_createEventModal("description")}</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t_createEventModal("promptPlaceholder")}
                    className="w-full p-3 border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary-500"
                    rows={3} disabled={isLoading}
                />
                <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700 transition-all disabled:bg-primary-300">
                    {isLoading && !generatedData ? t_createEventModal("generatingButton") : t_createEventModal("generateButton")}
                </button>
                {generatedData && (
                    <div className="border-t border-slate-200 pt-4 mt-6">
                        <h3 className="text-xl font-semibold mb-2 text-slate-700">הצעה מה-AI:</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="font-bold text-lg">{generatedData.eventName}</p>
                            <p className="text-slate-600 mt-1">{generatedData.theme.concept}</p>
                        </div>
                        <button onClick={handleSave} disabled={isLoading} className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 mt-4 transition-all disabled:bg-green-300">
                            {isLoading ? t_createEventModal("savingButton") : t_createEventModal("saveButton")}
                        </button>
                    </div>
                )}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                <button onClick={onClose} disabled={isLoading} className="w-full bg-transparent text-slate-600 p-2 mt-4 hover:bg-slate-100 rounded-lg">{t_createEventModal("closeButton")}</button>
            </div>
        </div>
    );
}