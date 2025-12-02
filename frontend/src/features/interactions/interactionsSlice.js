// frontend/src/features/interactions/interactionsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to send data to backend
export const createInteraction = createAsyncThunk(
  'interactions/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Something went wrong');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error';
      });
  },
});

export default interactionsSlice.reducer;
