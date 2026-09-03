import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { useSaveCheckIn } from '@/features/check-in/useSaveCheckIn';

jest.mock('@cyclehacker/supabase-client', () => ({
  saveDailyCheckIn: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/lib/supabase', () => ({ supabase: {} }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { saveDailyCheckIn } = require('@cyclehacker/supabase-client');

function wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useSaveCheckIn', () => {
  it('saves whichever fields were provided against the active profile', async () => {
    const { result } = await renderHook(() => useSaveCheckIn('profile-1'), { wrapper });

    await act(async () => {
      await result.current?.mutateAsync({ date: '2026-01-01', mood: 4, symptoms: [] });
    });

    expect(saveDailyCheckIn).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ profileId: 'profile-1', date: '2026-01-01', mood: 4 }),
    );
  });

  it('rejects when there is no active profile', async () => {
    const { result } = await renderHook(() => useSaveCheckIn(undefined), { wrapper });

    await act(async () => {
      await expect(result.current?.mutateAsync({ date: '2026-01-01' })).rejects.toThrow();
    });
  });
});
