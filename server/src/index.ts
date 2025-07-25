
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  createContactSubmissionInputSchema, 
  createNewsletterSubscriptionInputSchema 
} from './schema';
import { createContactSubmission } from './handlers/create_contact_submission';
import { createNewsletterSubscription } from './handlers/create_newsletter_subscription';
import { getPortfolioProjects } from './handlers/get_portfolio_projects';
import { getFeaturedProjects } from './handlers/get_featured_projects';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Contact form submission endpoint
  createContactSubmission: publicProcedure
    .input(createContactSubmissionInputSchema)
    .mutation(({ input }) => createContactSubmission(input)),
  
  // Newsletter subscription endpoint for email capture
  createNewsletterSubscription: publicProcedure
    .input(createNewsletterSubscriptionInputSchema)
    .mutation(({ input }) => createNewsletterSubscription(input)),
  
  // Get all portfolio projects
  getPortfolioProjects: publicProcedure
    .query(() => getPortfolioProjects()),
  
  // Get only featured projects for main showcase
  getFeaturedProjects: publicProcedure
    .query(() => getFeaturedProjects()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
