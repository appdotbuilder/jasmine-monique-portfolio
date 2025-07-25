
import { z } from 'zod';

// Contact form submission schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  created_at: z.coerce.date()
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Input schema for creating contact submissions
export const createContactSubmissionInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters")
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionInputSchema>;

// Newsletter signup schema
export const newsletterSubscriptionSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  subscribed_at: z.coerce.date(),
  is_active: z.boolean()
});

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;

// Input schema for newsletter signup
export const createNewsletterSubscriptionInputSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters")
});

export type CreateNewsletterSubscriptionInput = z.infer<typeof createNewsletterSubscriptionInputSchema>;

// Portfolio project schema (for potential future admin functionality)
export const portfolioProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  project_url: z.string().nullable(),
  github_url: z.string().nullable(),
  technologies: z.array(z.string()),
  is_featured: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;
