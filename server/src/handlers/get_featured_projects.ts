
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { type PortfolioProject } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getFeaturedProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const results = await db.select()
      .from(portfolioProjectsTable)
      .where(eq(portfolioProjectsTable.is_featured, true))
      .orderBy(desc(portfolioProjectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    throw error;
  }
};
