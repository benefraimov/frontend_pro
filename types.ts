// --- Auth & User Types ---
export interface User {
	id: number;
	email: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {}

// --- Event & Guest Types ---
export type GuestStatus = 'אישור הגעה' | 'ממתין' | 'לא מגיע' | 'Confirmed' | 'Pending' | 'Declined';

export interface Guest {
	id: number;
	name: string;
	phone: string;
	status: GuestStatus;
	event_id: number;
}

export interface Invitation {
	id: number;
	headline: string;
	body_text: string;
	rsvp_info: string;
	bg_image_url: string | null;
}

export interface Theme {
	id: number;
	concept: string;
	dress_code_name: string;
	dress_code_description: string;
}

export interface Event {
	id: number;
	name: string;
	concept: string;
	user_id: number;
	guests: Guest[];
	invitation: Invitation;
	theme: Theme;
}

// --- Redux State Types ---
export interface EventsState {
	events: Event[];
	loading: boolean;
	error: string | null;
}

export interface CurrentEventState {
	event: Event | null;
	loading: boolean;
	error: string | null;
}
