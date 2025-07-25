
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { type PortfolioProject } from '../schema';
import { desc } from 'drizzle-orm';

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const results = await db.select()
      .from(portfolioProjectsTable)
      .orderBy(desc(portfolioProjectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Portfolio projects fetch failed:', error);
    throw error;
  }
};
