
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput, type NewsletterSubscription } from '../schema';
import { eq } from 'drizzle-orm';

export const createNewsletterSubscription = async (input: CreateNewsletterSubscriptionInput): Promise<NewsletterSubscription> => {
  try {
    // Check if email already exists
    const existingSubscription = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, input.email))
      .execute();

    // If email exists and is active, return existing subscription
    if (existingSubscription.length > 0) {
      const existing = existingSubscription[0];
      if (existing.is_active) {
        return existing;
      }
      
      // If email exists but is inactive, reactivate it
      const reactivated = await db.update(newsletterSubscriptionsTable)
        .set({ 
          is_active: true,
          subscribed_at: new Date()
        })
        .where(eq(newsletterSubscriptionsTable.id, existing.id))
        .returning()
        .execute();
      
      return reactivated[0];
    }

    // Create new subscription
    const result = await db.insert(newsletterSubscriptionsTable)
      .values({
        email: input.email
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Newsletter subscription creation failed:', error);
    throw error;
  }
};
