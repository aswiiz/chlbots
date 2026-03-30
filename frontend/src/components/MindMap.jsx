import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Download, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { generateMindMap, getMindmap } from '../utils/api';

const initialNodes = [
    { id: '1', data: { label: 'Upload notes to generate mind map' }, position: { x: 250, y: 5 }, type: 'input' },
];

const MindMap = ({ projectId }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(false);

    const loadMindmap = async () => {
        if (!projectId) return;
        try {
            const data = await getMindmap(projectId);
            if (data && data.data) {
                processMindmapData(data.data);
            }
        } catch (err) {
            console.error("Failed to load mindmap", err);
        }
    };

    useEffect(() => {
        loadMindmap();
    }, [projectId]);

    const processMindmapData = (data) => {
        const newNodes = [];
        const newEdges = [];
        let idCounter = 0;

        const traverse = (node, parentId = null, depth = 0, xOffset = 0) => {
            const id = `${idCounter++}`;
            const newNode = {
                id,
                data: { label: node.title },
                position: { x: depth * 250, y: xOffset * 100 },
                className: depth === 0 ? 'bg-primary-600' : 'bg-surface border-border',
            };

            newNodes.push(newNode);

            if (parentId !== null) {
                newEdges.push({
                    id: `e-${parentId}-${id}`,
                    source: parentId,
                    target: id,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
                    style: { stroke: '#0ea5e9', strokeWidth: 2 }
                });
            }

            if (node.children) {
                node.children.forEach((child, index) => {
                    traverse(child, id, depth + 1, xOffset + index);
                });
            }
        };

        traverse(data);
        setNodes(newNodes);
        setEdges(newEdges);
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateMindMap(projectId);
            processMindmapData(data);
        } catch (err) {
            alert("Failed to generate mind map. Make sure you have uploaded documents.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-10rem)] w-full glass-card overflow-hidden relative">
            <Panel position="top-right" className="flex gap-2">
                <button
                    onClick={handleGenerate}
                    disabled={loading || !projectId}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg text-sm font-medium hover:bg-primary-500 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                >
                    {loading ? <RefreshCw className="animate-spin" size={16} /> : <Network className="w-4 h-4" />}
                    {loading ? 'Generating...' : 'Generate AI Mind Map'}
                </button>
                <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                    <Download size={16} />
                </button>
            </Panel>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background color="#333" gap={16} />
                <Controls />
                <MiniMap
                    nodeColor={(n) => n.className?.includes('bg-primary-600') ? '#0ea5e9' : '#333'}
                    maskColor="rgba(0, 0, 0, 0.4)"
                />
            </ReactFlow>
        </div>
    );
};

export default MindMap;
