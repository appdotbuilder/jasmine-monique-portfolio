
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { createContactSubmission } from '../handlers/create_contact_submission';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactSubmissionInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'Hello, I would like to discuss a potential project opportunity with you.'
};

describe('createContactSubmission', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact submission', async () => {
    const result = await createContactSubmission(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.message).toEqual('Hello, I would like to discuss a potential project opportunity with you.');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact submission to database', async () => {
    const result = await createContactSubmission(testInput);

    // Query the database to verify the record was saved
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toEqual('John Doe');
    expect(submissions[0].email).toEqual('john.doe@example.com');
    expect(submissions[0].message).toEqual('Hello, I would like to discuss a potential project opportunity with you.');
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different input variations', async () => {
    const shortInput: CreateContactSubmissionInput = {
      name: 'A',
      email: 'a@b.co',
      message: 'Short msg.'
    };

    const result = await createContactSubmission(shortInput);

    expect(result.name).toEqual('A');
    expect(result.email).toEqual('a@b.co');
    expect(result.message).toEqual('Short msg.');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should handle long content appropriately', async () => {
    const longInput: CreateContactSubmissionInput = {
      name: 'A'.repeat(50), // 50 characters
      email: 'very.long.email.address@example-domain.com',
      message: 'This is a very long message that contains detailed information about a project inquiry. '.repeat(10)
    };

    const result = await createContactSubmission(longInput);

    expect(result.name).toEqual(longInput.name);
    expect(result.email).toEqual(longInput.email);
    expect(result.message).toEqual(longInput.message);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);

    // Verify it was saved correctly
    const saved = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(saved[0].name).toEqual(longInput.name);
    expect(saved[0].email).toEqual(longInput.email);
    expect(saved[0].message).toEqual(longInput.message);
  });

  it('should create multiple submissions independently', async () => {
    const input1: CreateContactSubmissionInput = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: 'I need help with web development.'
    };

    const input2: CreateContactSubmissionInput = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      message: 'Interested in your portfolio work.'
    };

    const result1 = await createContactSubmission(input1);
    const result2 = await createContactSubmission(input2);

    // Both should have different IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(result1.name).toEqual('Alice Smith');
    expect(result2.name).toEqual('Bob Johnson');
    expect(result1.email).toEqual('alice@example.com');
    expect(result2.email).toEqual('bob@example.com');

    // Verify both are in database
    const allSubmissions = await db.select()
      .from(contactSubmissionsTable)
      .execute();

    expect(allSubmissions).toHaveLength(2);
    
    const names = allSubmissions.map(s => s.name).sort();
    expect(names).toEqual(['Alice Smith', 'Bob Johnson']);
  });
});
