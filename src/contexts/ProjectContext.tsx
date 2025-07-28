import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectService, Project } from '../services/supabaseService';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
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
      setError(err instanceof Error ? err.message : 'Projeler yüklenirken hata oluştu');
      console.error('Projeler yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    refreshProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 