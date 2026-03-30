import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    Network,
    GitBranch,
    Flashlight,
    MessageSquare,
    Settings,
    BrainCircuit
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Upload Notes', path: '/upload', icon: Upload },
        { name: 'Mind Map', path: '/mindmap', icon: Network },
        { name: 'Flow Chart', path: '/flowchart', icon: GitBranch },
        { name: 'Flash Cards', path: '/flashcards', icon: Flashlight },
        { name: 'Chat', path: '/chat', icon: MessageSquare },
    ];

    return (
        <div className="w-64 h-screen border-r border-white/5 flex flex-col p-6 fixed">
            <div className="flex items-center gap-3 mb-10 group">
                <div className="p-2 bg-primary-500/10 rounded-xl group-hover:bg-primary-500/20 transition-all">
                    <BrainCircuit className="w-8 h-8 text-primary-500" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">SmartNotes <span className="text-primary-500">AI</span></h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5">
                <button className="nav-link w-full text-left">
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
