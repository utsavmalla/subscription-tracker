import {
  calculateSubscriptionStatus,
  hasAutoRenewalCancelRemark,
} from '@subscription-tracker/shared';

describe('calculateSubscriptionStatus', () => {
  const today = '2026-05-04';

  it('marks recurring subscriptions active when renewal is more than seven days away', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'Monthly',
        nextRenewalDate: '2026-05-12',
        today,
      }),
    ).toEqual({ status: 'Active', alertState: 'None' });
  });

  it('marks recurring subscriptions upcoming inside the seven-day window', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'Monthly',
        nextRenewalDate: '2026-05-11',
        today,
      }),
    ).toEqual({ status: 'Upcoming', alertState: 'Upcoming' });
  });

  it('marks recurring subscriptions due today', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'Yearly',
        nextRenewalDate: today,
        today,
      }),
    ).toEqual({ status: 'DueToday', alertState: 'DueToday' });
  });

  it('marks recurring subscriptions overdue when the renewal date has passed', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'Quarterly',
        nextRenewalDate: '2026-05-03',
        today,
      }),
    ).toEqual({ status: 'Overdue', alertState: 'Overdue' });
  });

  it('marks one-time subscriptions active before expiration', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'OneTime',
        expirationDate: '2026-05-05',
        today,
      }),
    ).toEqual({ status: 'Active', alertState: 'None' });
  });

  it('marks one-time subscriptions due today on their expiration date', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'OneTime',
        expirationDate: today,
        today,
      }),
    ).toEqual({ status: 'DueToday', alertState: 'DueToday' });
  });

  it('marks one-time subscriptions expired after expiration', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'OneTime',
        expirationDate: '2026-05-03',
        today,
      }),
    ).toEqual({ status: 'Expired', alertState: 'Expired' });
  });

  it('marks handled alert cycles completed without changing the renewal inputs', () => {
    expect(
      calculateSubscriptionStatus({
        renewalCycle: 'Monthly',
        done: true,
        nextRenewalDate: '2026-05-03',
        today,
      }),
    ).toEqual({ status: 'Completed', alertState: 'None' });
  });

  it('does not let Auto Renewal Cancel remarks change computed status', () => {
    const status = calculateSubscriptionStatus({
      renewalCycle: 'Monthly',
      nextRenewalDate: '2026-05-12',
      today,
    });

    expect(hasAutoRenewalCancelRemark('Auto Renewal Cancel')).toBe(true);
    expect(status).toEqual({ status: 'Active', alertState: 'None' });
  });
});
