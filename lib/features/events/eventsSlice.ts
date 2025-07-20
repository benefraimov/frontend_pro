import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Event, EventsState } from '@/types';
import toast from 'react-hot-toast';

const initialState: EventsState = {
	events: [],
	loading: false,
	error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { rejectWithValue }) => {
	try {
		const response = await api.get('/events');
		return response.data;
	} catch (error: any) {
		return rejectWithValue(error.response?.data);
	}
});

export const createEvent = createAsyncThunk('events/createEvent', async ({ prompt }: { prompt: string }, { rejectWithValue }) => {
	try {
		// First, get the AI-generated data
		const generateResponse = await api.post('/generate-event', { prompt });
		const eventData = generateResponse.data;

		// Now, create the event with this data
		const createResponse = await api.post('/events', eventData);
		toast.success('Event created successfully!');
		return createResponse.data;
	} catch (error: any) {
		toast.error('Failed to create event.');
		return rejectWithValue(error.response?.data);
	}
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (eventId: number, { rejectWithValue }) => {
	try {
		await api.delete(`/events/${eventId}`);
		toast.success('Event deleted successfully');
		return eventId;
	} catch (error: any) {
		toast.error('Failed to delete event.');
		return rejectWithValue(error.response?.data);
	}
});

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEvents.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
				state.loading = false;
				state.events = action.payload;
			})
			.addCase(fetchEvents.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
				state.events.push(action.payload);
			})
			.addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
				state.events = state.events.filter((event) => event.id !== action.payload);
			});
	},
});

export default eventsSlice.reducer;
