// frontend/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import interactionsReducer from './features/interactions/interactionsSlice';

const store = configureStore({
  reducer: {
    interactions: interactionsReducer,
  },
});

export default store;
