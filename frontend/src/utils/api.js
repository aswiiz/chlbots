import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const createProject = async (name, userId) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_id', userId);
    const { data } = await api.post('/projects', formData);
    return data;
};

export const getProjects = async (userId) => {
    const { data } = await api.get(`/projects/${userId}`);
    return data;
};

export const uploadDocument = async (projectId, { file, text, url }) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    if (file) formData.append('file', file);
    if (text) formData.append('text', text);
    if (url) formData.append('url', url);
    const { data } = await api.post('/upload', formData);
    return data;
};

export const generateMindMap = async (projectId) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    const { data } = await api.post('/generate-mindmap', formData);
    return data;
};

export const generateFlowchart = async (projectId) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    const { data } = await api.post('/generate-flowchart', formData);
    return data;
};

export const generateFlashcards = async (projectId) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    const { data } = await api.post('/generate-flashcards', formData);
    return data;
};

export const sendChatMessage = async (projectId, question) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('question', question);
    const { data } = await api.post('/chat', formData);
    return data;
};

export const getMindmap = async (projectId) => {
    const { data } = await api.get(`/mindmap/${projectId}`);
    return data;
};

export const getFlashcards = async (projectId) => {
    const { data } = await api.get(`/flashcards/${projectId}`);
    return data;
};

export default api;
