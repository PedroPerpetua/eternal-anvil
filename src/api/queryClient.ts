import { QueryClient } from '@tanstack/react-query';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 2 * MINUTE } },
});

export default queryClient;
