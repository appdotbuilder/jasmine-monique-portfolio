
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { getFeaturedProjects } from '../handlers/get_featured_projects';

describe('getFeaturedProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only featured projects', async () => {
    // Create test projects - one featured, one not
    await db.insert(portfolioProjectsTable)
      .values([
        {
          title: 'Featured Project',
          description: 'This is a featured project',
          image_url: 'https://example.com/image.jpg',
          project_url: 'https://example.com/project',
          github_url: 'https://github.com/user/project',
          technologies: ['React', 'TypeScript'],
          is_featured: true
        },
        {
          title: 'Regular Project',
          description: 'This is not featured',
          image_url: 'https://example.com/image2.jpg',
          project_url: 'https://example.com/project2',
          github_url: 'https://github.com/user/project2',
          technologies: ['Vue', 'JavaScript'],
          is_featured: false
        }
      ])
      .execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Featured Project');
    expect(result[0].is_featured).toBe(true);
    expect(result[0].technologies).toEqual(['React', 'TypeScript']);
  });

  it('should return empty array when no featured projects exist', async () => {
    // Create only non-featured projects
    await db.insert(portfolioProjectsTable)
      .values({
        title: 'Regular Project',
        description: 'This is not featured',
        technologies: ['Vue', 'JavaScript'],
        is_featured: false
      })
      .execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(0);
  });

  it('should order featured projects by creation date descending', async () => {
    // Create multiple featured projects with slight delays to ensure different timestamps
    await db.insert(portfolioProjectsTable)
      .values({
        title: 'First Project',
        description: 'Created first',
        technologies: ['React'],
        is_featured: true
      })
      .execute();

    // Add small delay to ensure different created_at timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(portfolioProjectsTable)
      .values({
        title: 'Second Project',
        description: 'Created second',
        technologies: ['Vue'],
        is_featured: true
      })
      .execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Second Project'); // Most recent first
    expect(result[1].title).toEqual('First Project');
    expect(result[0].created_at > result[1].created_at).toBe(true);
  });

  it('should return all featured project fields correctly', async () => {
    await db.insert(portfolioProjectsTable)
      .values({
        title: 'Complete Project',
        description: 'A project with all fields',
        image_url: 'https://example.com/image.jpg',
        project_url: 'https://example.com/project',
        github_url: 'https://github.com/user/project',
        technologies: ['React', 'TypeScript', 'Node.js'],
        is_featured: true
      })
      .execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    const project = result[0];
    
    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Complete Project');
    expect(project.description).toEqual('A project with all fields');
    expect(project.image_url).toEqual('https://example.com/image.jpg');
    expect(project.project_url).toEqual('https://example.com/project');
    expect(project.github_url).toEqual('https://github.com/user/project');
    expect(project.technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(project.is_featured).toBe(true);
    expect(project.created_at).toBeInstanceOf(Date);
    expect(project.updated_at).toBeInstanceOf(Date);
  });
});
