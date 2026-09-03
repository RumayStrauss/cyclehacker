import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { useCycleDayInfo } from '@/features/home/useCycleDayInfo';

jest.mock('@cyclehacker/supabase-client', () => ({
  listPeriodEntries: jest.fn(),
}));
jest.mock('@/lib/supabase', () => ({ supabase: {} }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { listPeriodEntries } = require('@cyclehacker/supabase-client');

function wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCycleDayInfo', () => {
  it('returns null when there are no period entries yet', async () => {
    (listPeriodEntries as jest.Mock).mockResolvedValue([]);

    const { result } = await renderHook(() => useCycleDayInfo('profile-1'), { wrapper });

    await waitFor(() => expect(result.current?.isSuccess).toBe(true));
    expect(result.current?.data).toBeNull();
  });

  it('computes cycle day info from logged period entries', async () => {
    (listPeriodEntries as jest.Mock).mockResolvedValue([{ date: '2026-01-01', flowLevel: 'medium' }]);

    const { result } = await renderHook(() => useCycleDayInfo('profile-1'), { wrapper });

    await waitFor(() => expect(result.current?.isSuccess).toBe(true));
    expect(result.current?.data).not.toBeNull();
    expect(result.current?.data?.phase).toBeDefined();
  });
});
