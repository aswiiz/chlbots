import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './components/Upload';
import MindMap from './components/MindMap';
import FlowChart from './components/FlowChart';
import Flashcard from './components/Flashcard';
import Chat from './components/Chat';
import {
    Search,
    Bell,
    User,
    Moon,
    Sun,
    Layers,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [activeProject, setActiveProject] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const userId = "test_user_001"; // Default for demo

    return (
        <Router>
            <div className={`flex min-h-screen bg-background text-slate-200 transition-colors duration-300 font-sans`}>
                {/* Sidebar */}
                <Sidebar aria-label="Main navigation" />

                {/* Main Content Area */}
                <main className="ml-64 flex-1 flex flex-col min-w-0">

                    {/* Top Navigation Bar */}
                    <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                        {/* Project Context */}
                        <div className="flex items-center gap-4">
                            {activeProject ? (
                                <div className="flex items-center gap-3 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                                    <div className="p-1.5 bg-primary-600 rounded-lg shadow-lg">
                                        <Layers size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest leading-none mb-0.5">Active Project</p>
                                        <p className="text-sm font-bold text-white leading-none">{activeProject.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <Sparkles className="text-primary-500 w-5 h-5 group-hover:animate-pulse" />
                                    <span className="text-slate-400 text-sm font-medium">Select a project to begin</span>
                                </div>
                            )}
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-6">
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search your notes..."
                                    className="bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64"
                                />
                                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 border border-white/5 relative">
                                    <Bell size={18} className="text-slate-400" />
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-background" />
                                </button>
                                <button className="p-2 bg-primary-500/10 rounded-xl border border-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white transition-all transform hover:scale-105">
                                    <User size={20} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Page Routing Container */}
                    <div className="p-10 max-w-7xl mx-auto w-full flex-1">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Dashboard userId={userId} onProjectSelect={setActiveProject} />
                                    </motion.div>
                                } />
                                <Route path="/upload" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Upload projectId={activeProject?.project_id} />
                                    </motion.div>
                                } />
                                <Route path="/mindmap" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <MindMap projectId={activeProject?.project_id} />
                                    </motion.div>
                                } />
                                <Route path="/flowchart" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <FlowChart projectId={activeProject?.project_id} />
                                    </motion.div>
                                } />
                                <Route path="/flashcards" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Flashcard projectId={activeProject?.project_id} />
                                    </motion.div>
                                } />
                                <Route path="/chat" element={
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Chat projectId={activeProject?.project_id} />
                                    </motion.div>
                                } />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </AnimatePresence>
                    </div>

                    {/* Footer - Subtle */}
                    <footer className="h-16 px-10 flex items-center justify-between border-t border-white/5 text-[11px] text-slate-600 font-bold uppercase tracking-widest">
                        <p>&copy; 2026 SmartNotes AI Research</p>
                        <div className="flex gap-6">
                            <span className="hover:text-primary-500 cursor-pointer transition-colors">Documentation</span>
                            <span className="hover:text-primary-500 cursor-pointer transition-colors">Support</span>
                            <span className="hover:text-primary-500 cursor-pointer transition-colors">API</span>
                        </div>
                    </footer>
                </main>
            </div>
        </Router>
    );
};

export default App;
