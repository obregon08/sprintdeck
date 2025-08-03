import { describe, it, expect } from 'vitest';
import { filterAndSortProjects, filterAndSortTasks } from '../filter-utils';
import type { ProjectWithTasks, TaskWithDetails, ProjectFilterState, TaskFilterState } from '@/types';

describe('filter-utils', () => {
  describe('filterAndSortProjects', () => {
    const mockProjects: ProjectWithTasks[] = [
      {
        id: '1',
        name: 'Project Alpha',
        description: 'First project',
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tasks: [{ id: '1', title: 'Task 1', status: 'TODO', priority: 'HIGH' }]
      },
      {
        id: '2',
        name: 'Project Beta',
        description: 'Second project',
        userId: 'user2',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        tasks: []
      },
      {
        id: '3',
        name: 'Project Gamma',
        description: 'Third project',
        userId: 'user1',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        tasks: [
          { id: '2', title: 'Task 2', status: 'DONE', priority: 'MEDIUM' },
          { id: '3', title: 'Task 3', status: 'IN_PROGRESS', priority: 'LOW' }
        ]
      }
    ];

    it('filters projects by search term', () => {
      const filters: ProjectFilterState = {
        search: 'alpha',
        owner: 'ALL',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = filterAndSortProjects(mockProjects, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Project Alpha');
    });

    it('filters projects by owner', () => {
      const filters: ProjectFilterState = {
        search: '',
        owner: 'user1',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = filterAndSortProjects(mockProjects, filters);
      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('user1');
      expect(result[1].userId).toBe('user1');
    });

    it('filters projects by current user', () => {
      const filters: ProjectFilterState = {
        search: '',
        owner: 'current',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = filterAndSortProjects(mockProjects, filters, 'user1');
      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('user1');
      expect(result[1].userId).toBe('user1');
    });

    it('sorts projects by name in ascending order', () => {
      const filters: ProjectFilterState = {
        search: '',
        owner: 'ALL',
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const result = filterAndSortProjects(mockProjects, filters);
      expect(result[0].name).toBe('Project Alpha');
      expect(result[1].name).toBe('Project Beta');
      expect(result[2].name).toBe('Project Gamma');
    });

    it('sorts projects by task count in descending order', () => {
      const filters: ProjectFilterState = {
        search: '',
        owner: 'ALL',
        sortBy: 'taskCount',
        sortOrder: 'desc'
      };

      const result = filterAndSortProjects(mockProjects, filters);
      expect(result[0].tasks).toHaveLength(2); // Project Gamma
      expect(result[1].tasks).toHaveLength(1); // Project Alpha
      expect(result[2].tasks).toHaveLength(0); // Project Beta
    });
  });

  describe('filterAndSortTasks', () => {
    const mockTasks: TaskWithDetails[] = [
      {
        id: '1',
        title: 'Task Alpha',
        description: 'First task',
        status: 'TODO',
        priority: 'HIGH',
        projectId: 'project1',
        assigneeId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Task Beta',
        description: 'Second task',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: 'project1',
        assigneeId: null,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      },
      {
        id: '3',
        title: 'Task Gamma',
        description: 'Third task',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        projectId: 'project1',
        assigneeId: 'user2',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
      }
    ];

    it('filters tasks by search term', () => {
      const filters: TaskFilterState = {
        search: 'alpha',
        status: 'ALL',
        priority: 'ALL',
        assignee: 'ALL',
        sortBy: 'title',
        sortOrder: 'asc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task Alpha');
    });

    it('filters tasks by status', () => {
      const filters: TaskFilterState = {
        search: '',
        status: 'TODO',
        priority: 'ALL',
        assignee: 'ALL',
        sortBy: 'title',
        sortOrder: 'asc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('TODO');
    });

    it('filters tasks by priority', () => {
      const filters: TaskFilterState = {
        search: '',
        status: 'ALL',
        priority: 'HIGH',
        assignee: 'ALL',
        sortBy: 'title',
        sortOrder: 'asc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('HIGH');
    });

    it('filters tasks by assignee', () => {
      const filters: TaskFilterState = {
        search: '',
        status: 'ALL',
        priority: 'ALL',
        assignee: 'user1',
        sortBy: 'title',
        sortOrder: 'asc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].assigneeId).toBe('user1');
    });

    it('sorts tasks by title in ascending order', () => {
      const filters: TaskFilterState = {
        search: '',
        status: 'ALL',
        priority: 'ALL',
        assignee: 'ALL',
        sortBy: 'title',
        sortOrder: 'asc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result[0].title).toBe('Task Alpha');
      expect(result[1].title).toBe('Task Beta');
      expect(result[2].title).toBe('Task Gamma');
    });

    it('sorts tasks by priority in descending order', () => {
      const filters: TaskFilterState = {
        search: '',
        status: 'ALL',
        priority: 'ALL',
        assignee: 'ALL',
        sortBy: 'priority',
        sortOrder: 'desc'
      };

      const result = filterAndSortTasks(mockTasks, filters);
      expect(result[0].priority).toBe('HIGH');
      expect(result[1].priority).toBe('MEDIUM');
      expect(result[2].priority).toBe('LOW');
    });
  });
}); 