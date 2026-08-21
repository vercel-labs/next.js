import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    findBrands: builder.query<{ page: number; search: string; requestId: number }, { page: number; search: string }>({
      query: (args) => ({ url: 'brands', params: args }),
    }),
  }),
});

export const { useFindBrandsQuery } = api;
