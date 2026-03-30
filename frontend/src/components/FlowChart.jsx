import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { generateFlowchart } from '../utils/api';
import {
    GitBranch,
    RefreshCw,
    Download,
    Maximize,
    AlertCircle
} from 'lucide-react';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    }
});

const FlowChart = ({ projectId }) => {
    const [chartContent, setChartContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mermaidRef = useRef(null);

    const handleGenerate = async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const { mermaid: mermaidCode } = await generateFlowchart(projectId);
            setChartContent(mermaidCode);
        } catch (err) {
            setError("Failed to extract process steps from notes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chartContent && mermaidRef.current) {
            // Clear previous content
            mermaidRef.current.removeAttribute('data-processed');
            mermaidRef.current.innerHTML = chartContent;
            mermaid.contentLoaded();
        }
    }, [chartContent]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-primary-400">Process Explorer</h2>
                    <p className="text-slate-400 mt-1">AI-powered sequence and decision extraction.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading || !projectId}
                    className="flex items-center gap-2 btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <GitBranch size={20} />}
                    {loading ? 'Analyzing...' : 'Generate New Flow'}
                </button>
            </div>

            <div className="glass-card min-h-[500px] flex items-center justify-center p-8 bg-[#0a0a0a] overflow-auto">
                {!chartContent && !loading && !error && (
                    <div className="text-center opacity-50 flex flex-col items-center">
                        <Maximize size={48} className="mb-4 text-slate-600" />
                        <p>No flowchart generated yet. Click the button to analyze processes.</p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-primary-500" size={40} />
                        <p className="text-sm font-medium animate-pulse text-slate-400">De-structuring document sequences...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-4 text-red-400">
                        <AlertCircle size={40} />
                        <p>{error}</p>
                    </div>
                )}

                <div
                    ref={mermaidRef}
                    className="mermaid w-full flex justify-center scale-110"
                >
                    {/* Mermaid chart will be rendered here */}
                </div>
            </div>

            {chartContent && (
                <div className="flex gap-4">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={18} /> Export SVG
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlowChart;
