
import { serial, text, pgTable, timestamp, boolean, json } from 'drizzle-orm/pg-core';

export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const newsletterSubscriptionsTable = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribed_at: timestamp('subscribed_at').defaultNow().notNull(),
  is_active: boolean('is_active').default(true).notNull(),
});

export const portfolioProjectsTable = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url'),
  project_url: text('project_url'),
  github_url: text('github_url'),
  technologies: json('technologies').$type<string[]>().notNull().default([]),
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

export type NewsletterSubscription = typeof newsletterSubscriptionsTable.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptionsTable.$inferInsert;

export type PortfolioProject = typeof portfolioProjectsTable.$inferSelect;
export type NewPortfolioProject = typeof portfolioProjectsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  contactSubmissions: contactSubmissionsTable,
  newsletterSubscriptions: newsletterSubscriptionsTable,
  portfolioProjects: portfolioProjectsTable
};
