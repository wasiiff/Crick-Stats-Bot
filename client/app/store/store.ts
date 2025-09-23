import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "../services/chatApi";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

// Infer types for later use
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
