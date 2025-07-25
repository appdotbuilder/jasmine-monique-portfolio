
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { getPortfolioProjects } from '../handlers/get_portfolio_projects';

describe('getPortfolioProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getPortfolioProjects();
    expect(result).toEqual([]);
  });

  it('should return all portfolio projects', async () => {
    // Create test portfolio projects
    await db.insert(portfolioProjectsTable)
      .values([
        {
          title: 'E-commerce Platform',
          description: 'A full-stack e-commerce solution',
          image_url: 'https://example.com/ecommerce.jpg',
          project_url: 'https://ecommerce.example.com',
          github_url: 'https://github.com/user/ecommerce',
          technologies: ['React', 'Node.js', 'PostgreSQL'],
          is_featured: true
        },
        {
          title: 'Task Management App',
          description: 'A productivity app for managing tasks',
          image_url: null,
          project_url: null,
          github_url: 'https://github.com/user/tasks',
          technologies: ['Vue.js', 'Express'],
          is_featured: false
        }
      ])
      .execute();

    const result = await getPortfolioProjects();

    expect(result).toHaveLength(2);
    
    // Verify first project
    const ecommerceProject = result.find(p => p.title === 'E-commerce Platform');
    expect(ecommerceProject).toBeDefined();
    expect(ecommerceProject!.description).toEqual('A full-stack e-commerce solution');
    expect(ecommerceProject!.image_url).toEqual('https://example.com/ecommerce.jpg');
    expect(ecommerceProject!.project_url).toEqual('https://ecommerce.example.com');
    expect(ecommerceProject!.github_url).toEqual('https://github.com/user/ecommerce');
    expect(ecommerceProject!.technologies).toEqual(['React', 'Node.js', 'PostgreSQL']);
    expect(ecommerceProject!.is_featured).toBe(true);
    expect(ecommerceProject!.id).toBeDefined();
    expect(ecommerceProject!.created_at).toBeInstanceOf(Date);
    expect(ecommerceProject!.updated_at).toBeInstanceOf(Date);

    // Verify second project
    const taskProject = result.find(p => p.title === 'Task Management App');
    expect(taskProject).toBeDefined();
    expect(taskProject!.description).toEqual('A productivity app for managing tasks');
    expect(taskProject!.image_url).toBeNull();
    expect(taskProject!.project_url).toBeNull();
    expect(taskProject!.github_url).toEqual('https://github.com/user/tasks');
    expect(taskProject!.technologies).toEqual(['Vue.js', 'Express']);
    expect(taskProject!.is_featured).toBe(false);
  });

  it('should return projects ordered by creation date (newest first)', async () => {
    // Create projects with slight delay to ensure different timestamps
    await db.insert(portfolioProjectsTable)
      .values({
        title: 'First Project',
        description: 'The first project created',
        technologies: ['HTML', 'CSS'],
        is_featured: false
      })
      .execute();

    // Add small delay
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(portfolioProjectsTable)
      .values({
        title: 'Second Project',
        description: 'The second project created',
        technologies: ['JavaScript'],
        is_featured: false
      })
      .execute();

    const result = await getPortfolioProjects();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Second Project');
    expect(result[1].title).toEqual('First Project');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should handle projects with various technology arrays', async () => {
    await db.insert(portfolioProjectsTable)
      .values([
        {
          title: 'Frontend Project',
          description: 'A frontend-only project',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
          is_featured: true
        },
        {
          title: 'Minimal Project',
          description: 'A project with single technology',
          technologies: ['Python'],
          is_featured: false
        }
      ])
      .execute();

    const result = await getPortfolioProjects();

    expect(result).toHaveLength(2);
    
    const frontendProject = result.find(p => p.title === 'Frontend Project');
    expect(frontendProject!.technologies).toHaveLength(4);
    expect(frontendProject!.technologies).toContain('React');
    expect(frontendProject!.technologies).toContain('TypeScript');

    const minimalProject = result.find(p => p.title === 'Minimal Project');
    expect(minimalProject!.technologies).toHaveLength(1);
    expect(minimalProject!.technologies).toEqual(['Python']);
  });
});
