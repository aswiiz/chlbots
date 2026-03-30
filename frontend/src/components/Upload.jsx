import React, { useState } from 'react';
import {
    FileUp,
    Globe,
    Type,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';
import { uploadDocument } from '../utils/api';

const Upload = ({ projectId, onUploadSuccess }) => {
    const [activeTab, setActiveTab] = useState('file'); // file, url, text
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // success, error

    const handleUpload = async () => {
        if (!projectId) return alert("Please select or create a project first.");

        setLoading(true);
        setStatus(null);

        try {
            let payload = {};
            if (activeTab === 'file') payload = { file };
            if (activeTab === 'url') payload = { url };
            if (activeTab === 'text') payload = { text };

            await uploadDocument(projectId, payload);
            setStatus('success');
            setFile(null);
            setUrl('');
            setText('');
            if (onUploadSuccess) onUploadSuccess();

            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6">Add Content</h2>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {[
                        { id: 'file', label: 'Upload File', icon: FileUp },
                        { id: 'url', label: 'Website URL', icon: Globe },
                        { id: 'text', label: 'Paste Text', icon: Type },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all border ${activeTab === tab.id
                                    ? 'bg-primary-600/10 border-primary-500 text-primary-500 font-medium'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mb-8 min-h-[160px]">
                    {activeTab === 'file' && (
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary-500/50 transition-all group">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".pdf,.docx,.txt"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center cursor-pointer text-center"
                            >
                                <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:bg-primary-500/10 transition-all">
                                    <FileUp className="w-8 h-8 text-slate-400 group-hover:text-primary-500" />
                                </div>
                                <p className="text-sm font-medium">{file ? file.name : "Drop file here or click to browse"}</p>
                                <p className="text-xs text-slate-500 mt-2">Support for PDF, DOCX, TXT</p>
                            </label>
                            {file && (
                                <button onClick={() => setFile(null)} className="text-xs text-red-400 flex items-center gap-1 hover:underline">
                                    <X size={12} /> Remove
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'url' && (
                        <div className="space-y-4 pt-4">
                            <p className="text-sm text-slate-400">Import text from any public webpage</p>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/article"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none"
                            />
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="space-y-4 pt-4">
                            <p className="text-sm text-slate-400">Paste your raw notes or textbook excerpt</p>
                            <textarea
                                rows={6}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Start typing or paste here..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Feedback Messages */}
                {status === 'success' && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium">Content added and processed successfully!</span>
                    </div>
                )}
                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">Failed to process content. Please try again.</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || (!file && !url && !text)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <FileUp size={20} />}
                    {loading ? 'Processing Content...' : 'Add Knowledge Source'}
                </button>
            </div>

            <div className="glass-card p-6 bg-primary-900/5 border-primary-500/10">
                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">Tips for Best AI Results</h3>
                <ul className="text-xs text-slate-400 space-y-3">
                    <li className="flex gap-2">
                        <span className="text-primary-500">•</span>
                        Upload clear, text-searchable PDFs for better OCR accuracy.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-primary-500">•</span>
                        Combine multiple related documents into one project to give the AI more context.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-primary-500">•</span>
                        Use the URL feature for online research articles and documentation.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Upload;
