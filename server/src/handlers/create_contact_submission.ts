
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput, type ContactSubmission } from '../schema';

export async function createContactSubmission(input: CreateContactSubmissionInput): Promise<ContactSubmission> {
  try {
    // Insert contact submission record
    const result = await db.insert(contactSubmissionsTable)
      .values({
        name: input.name,
        email: input.email,
        message: input.message
      })
      .returning()
      .execute();

    // Return the created contact submission
    return result[0];
  } catch (error) {
    console.error('Contact submission creation failed:', error);
    throw error;
  }
}
