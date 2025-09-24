import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
    askQuestion: builder.mutation<unknown, { question: string }>({
      query: ({ question }) => ({
        url: "/ask",
        method: "POST",
        body: { question },
      }),
    }),
  }),
});

export const { useAskQuestionMutation } = chatApi;
