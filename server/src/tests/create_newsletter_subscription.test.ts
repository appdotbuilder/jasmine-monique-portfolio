
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput } from '../schema';
import { createNewsletterSubscription } from '../handlers/create_newsletter_subscription';
import { eq } from 'drizzle-orm';

const testInput: CreateNewsletterSubscriptionInput = {
  email: 'test@example.com'
};

describe('createNewsletterSubscription', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a newsletter subscription', async () => {
    const result = await createNewsletterSubscription(testInput);

    expect(result.email).toEqual('test@example.com');
    expect(result.is_active).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.subscribed_at).toBeInstanceOf(Date);
  });

  it('should save subscription to database', async () => {
    const result = await createNewsletterSubscription(testInput);

    const subscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, result.id))
      .execute();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].email).toEqual('test@example.com');
    expect(subscriptions[0].is_active).toBe(true);
    expect(subscriptions[0].subscribed_at).toBeInstanceOf(Date);
  });

  it('should return existing subscription if email already subscribed and active', async () => {
    // Create first subscription
    const first = await createNewsletterSubscription(testInput);
    
    // Try to create with same email
    const second = await createNewsletterSubscription(testInput);

    // Should return the same subscription
    expect(second.id).toEqual(first.id);
    expect(second.email).toEqual(first.email);
    expect(second.is_active).toBe(true);

    // Verify only one record exists in database
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, testInput.email))
      .execute();

    expect(allSubscriptions).toHaveLength(1);
  });

  it('should reactivate inactive subscription for existing email', async () => {
    // Create initial subscription
    const initial = await createNewsletterSubscription(testInput);

    // Manually deactivate the subscription
    await db.update(newsletterSubscriptionsTable)
      .set({ is_active: false })
      .where(eq(newsletterSubscriptionsTable.id, initial.id))
      .execute();

    // Try to subscribe again with same email
    const reactivated = await createNewsletterSubscription(testInput);

    // Should reactivate the existing subscription
    expect(reactivated.id).toEqual(initial.id);
    expect(reactivated.is_active).toBe(true);
    expect(reactivated.email).toEqual(testInput.email);
    expect(reactivated.subscribed_at).toBeInstanceOf(Date);

    // Verify subscription is active in database
    const dbSubscription = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, reactivated.id))
      .execute();

    expect(dbSubscription[0].is_active).toBe(true);
  });

  it('should handle different email addresses', async () => {
    const firstEmail = { email: 'first@example.com' };
    const secondEmail = { email: 'second@example.com' };

    const first = await createNewsletterSubscription(firstEmail);
    const second = await createNewsletterSubscription(secondEmail);

    expect(first.id).not.toEqual(second.id);
    expect(first.email).toEqual('first@example.com');
    expect(second.email).toEqual('second@example.com');
    expect(first.is_active).toBe(true);
    expect(second.is_active).toBe(true);

    // Verify both records exist in database
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .execute();

    expect(allSubscriptions).toHaveLength(2);
  });
});
