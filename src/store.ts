import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export const makeStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (gdm) => gdm().concat(api.middleware),
  });
