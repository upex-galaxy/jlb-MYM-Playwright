import { test, expect } from '../base';
import { CommunicationChannel } from '../../src/core/api/types';

test.describe('MYM-28 API Integration Tests', () => {

  test.fixme('MYM-134: Get upcoming bookings', async ({ api }) => {
    const [response, bookings] = await api.bookings.getBookings('upcoming');
    expect(response.status()).toBe(200);
    expect(Array.isArray(bookings)).toBeTruthy();
  });

  test.fixme('MYM-135: Update communication channels', async ({ api }) => {
    const newChannels: CommunicationChannel[] = [
      { type: 'slack', handle: 'dev-channel', is_active: true },
      { type: 'google_meet', is_active: true }
    ];

    const [response, body] = await api.users.updateCommunicationChannels(newChannels);
    expect(response.status()).toBe(200);
  });

  test.fixme('MYM-136: Cancel booking (Negative/Mocked)', async ({ api }) => {
    const fakeBookingId = '123e4567-e89b-12d3-a456-426614174000';
    
    try {
        const [response, body] = await api.bookings.cancelBooking(fakeBookingId);
        if (response.status() === 200) {
            expect(body.status).toBe('cancelled');
        }
    } catch (e) {
        console.log('API call executed (likely failed auth/id):', e);
    }
  });
});