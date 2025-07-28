import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectService, Project } from '../services/supabaseService';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  getProjectsByStatus: (status: 'baslayan' | 'devam' | 'bitmis') => Project[];
  getProjectById: (id: number) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Projeler yüklenirken hata oluştu');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = async () => {
    await loadProjects();
  };

  const getProjectsByStatus = (status: 'baslayan' | 'devam' | 'bitmis') => {
    return projects.filter(project => project.status === status);
  };

  const getProjectById = (id: number) => {
    return projects.find(project => project.id === id);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    refreshProjects,
    getProjectsByStatus,
    getProjectById,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext; 