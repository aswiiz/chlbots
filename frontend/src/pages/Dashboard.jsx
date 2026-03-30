import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Files,
    Plus,
    Clock,
    ChevronRight,
    FileText,
    Trash2,
    FolderPlus
} from 'lucide-react';
import { getProjects, createProject } from '../utils/api';
import { motion } from 'framer-motion';

const Dashboard = ({ userId, onProjectSelect }) => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeProject, setActiveProject] = useState(null);

    const fetchProjects = async () => {
        try {
            const data = await getProjects(userId);
            setProjects(data);
        } catch (err) {
            console.error("Error fetching projects", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [userId]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        setLoading(true);
        try {
            const result = await createProject(newProjectName, userId);
            setProjects([...projects, result]);
            setNewProjectName('');
            setActiveProject(result);
            if (onProjectSelect) onProjectSelect(result);
        } catch (err) {
            alert("Error creating project.");
        } finally {
            setLoading(false);
        }
    };

    const selectProject = (project) => {
        setActiveProject(project);
        if (onProjectSelect) onProjectSelect(project);
    };

    return (
        <div className="space-y-10 py-4 animate-in">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Welcome back, Scholar</h1>
                <p className="text-slate-400">Manage your knowledge base and AI study materials.</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Projects', value: projects.length, icon: FolderPlus, color: 'text-blue-500' },
                    { label: 'Knowledge Sources', value: '12', icon: Files, color: 'text-purple-500' },
                    { label: 'AI Generates', value: '45', icon: BarChart3, color: 'text-emerald-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-center gap-5 group hover:scale-[1.02] transition-all">
                        <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:bg-white/10 transition-colors`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Projects</h2>
                        <button
                            onClick={() => document.getElementById('new-project-input')?.focus()}
                            className="text-primary-500 text-sm font-semibold flex items-center gap-1 hover:underline"
                        >
                            <Plus size={16} /> New Project
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {projects.length === 0 ? (
                            <div className="glass-card p-12 text-center border-dashed flex flex-col items-center">
                                <Clock className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-400">No projects yet. Create your first one to get started!</p>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <motion.div
                                    layoutId={project.project_id}
                                    key={project.project_id}
                                    onClick={() => selectProject(project)}
                                    className={`glass-card p-5 flex items-center justify-between cursor-pointer group ${activeProject?.project_id === project.project_id
                                            ? 'border-primary-500/50 bg-primary-500/5'
                                            : 'hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary-100/5 rounded-xl group-hover:scale-110 transition-transform">
                                            <FileText className="text-primary-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{project.name}</h3>
                                            <p className="text-xs text-slate-500">ID: {project.project_id.split('-')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4 hidden sm:block">
                                            <p className="text-xs text-slate-500">Last updated</p>
                                            <p className="text-sm font-medium">Just now</p>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Create Project Side Panel */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Quick Actions</h2>
                    <div className="glass-card p-6 space-y-6">
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">New Project Name</label>
                            <input
                                id="new-project-input"
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="e.g. Nanotechnology 101"
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none text-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !newProjectName.trim()}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? <Clock className="animate-spin" size={18} /> : <Plus size={18} />}
                                Create Project
                            </button>
                        </form>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Recent Activity</h4>
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <div className="w-1 h-1 bg-primary-500 rounded-full mt-2" />
                                        <p className="text-slate-400">Generated mind map for <span className="text-slate-200 font-medium">Biology Quiz</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
