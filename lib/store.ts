import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import eventsReducer from './features/events/eventsSlice';
import currentEventReducer from './features/currentEvent/currentEventSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			events: eventsReducer,
			currentEvent: currentEventReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
