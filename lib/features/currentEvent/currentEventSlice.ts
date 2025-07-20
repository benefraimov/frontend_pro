import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { CurrentEventState, Event, Guest, Invitation } from '@/types';
import toast from 'react-hot-toast';

const initialState: CurrentEventState = {
	event: null,
	loading: false,
	error: null,
};

export const fetchEventById = createAsyncThunk('currentEvent/fetchEventById', async (eventId: string, { rejectWithValue }) => {
	try {
		const response = await api.get(`/events/${eventId}`);
		return response.data;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
	}
});

export const addGuest = createAsyncThunk('currentEvent/addGuest', async ({ eventId, guestData }: { eventId: number; guestData: { name: string; phone: string } }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/events/${eventId}/guests`, guestData);
		toast.success('Guest added successfully!');
		return response.data;
	} catch (error: any) {
		toast.error('Failed to add guest.');
		return rejectWithValue(error.response?.data);
	}
});

export const deleteGuest = createAsyncThunk('currentEvent/deleteGuest', async (guestId: number, { rejectWithValue }) => {
	try {
		await api.delete(`/guests/${guestId}`);
		toast.success('Guest deleted successfully!');
		return guestId;
	} catch (error: any) {
		toast.error('Failed to delete guest.');
		return rejectWithValue(error.response?.data);
	}
});

export const updateEvent = createAsyncThunk('currentEvent/updateEvent', async (eventData: Event, { rejectWithValue }) => {
	try {
		const response = await api.put(`/events/${eventData.id}`, eventData);
		toast.success('Event details saved!');
		return response.data;
	} catch (error: any) {
		toast.error('Failed to save changes.');
		return rejectWithValue(error.response?.data);
	}
});

const currentEventSlice = createSlice({
	name: 'currentEvent',
	initialState,
	reducers: {
		clearCurrentEvent: (state) => {
			state.event = null;
			state.error = null;
			state.loading = false;
		},
		updateInvitationInState: (state, action: PayloadAction<Invitation>) => {
			if (state.event) {
				state.event.invitation = action.payload;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEventById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
				state.loading = false;
				state.event = action.payload;
			})
			.addCase(fetchEventById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(addGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
				if (state.event) {
					state.event.guests.push(action.payload);
				}
			})
			.addCase(deleteGuest.fulfilled, (state, action: PayloadAction<number>) => {
				if (state.event) {
					state.event.guests = state.event.guests.filter((g) => g.id !== action.payload);
				}
			})
			.addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
				state.event = action.payload;
			});
	},
});

export const { clearCurrentEvent, updateInvitationInState } = currentEventSlice.actions;
export default currentEventSlice.reducer;
