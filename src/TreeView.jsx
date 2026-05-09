import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { getLayoutedElements } from './layoutUtils';
import { Search } from 'lucide-react';

const initialData = [
  { id: 'Root', label: 'Root', metadata: 'CEO', parentId: null },
  { id: 'A', label: 'A', metadata: 'VP Engineering', parentId: 'Root' },
  { id: 'A1', label: 'A1', metadata: 'Engineering Manager', parentId: 'A' },
  { id: 'A2', label: 'A2', metadata: 'Staff Engineer', parentId: 'A' },
  { id: 'B', label: 'B', metadata: 'VP Sales', parentId: 'Root' },
  { id: 'B1', label: 'B1', metadata: 'Sales Manager', parentId: 'B' },
  { id: 'B2', label: 'B2', metadata: 'Account Executive', parentId: 'B' },
  { id: 'B2-1', label: 'B2-1', metadata: 'SDR', parentId: 'B2' },
];

const nodeTypes = {
  custom: CustomNode,
};

export default function TreeView() {
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const toggleNode = useCallback((nodeId) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Expand parents if a child matches the search query
  useEffect(() => {
    if (!searchQuery) return;
    
    const query = searchQuery.toLowerCase();
    const matchingNodes = initialData.filter(d => 
      d.label.toLowerCase().includes(query) || 
      (d.metadata && d.metadata.toLowerCase().includes(query))
    );

    if (matchingNodes.length > 0) {
      setCollapsedNodes(prev => {
        const newSet = new Set(prev);
        // Uncollapse all parents of matching nodes
        matchingNodes.forEach(match => {
          let currentParent = match.parentId;
          while (currentParent) {
            newSet.delete(currentParent);
            const parentNode = initialData.find(d => d.id === currentParent);
            currentParent = parentNode ? parentNode.parentId : null;
          }
        });
        return newSet;
      });
    }
  }, [searchQuery]);

  // Compute the visible nodes and edges based on collapsed state
  useEffect(() => {
    const hiddenNodes = new Set();
    
    // Helper to traverse and hide children
    const hideDescendants = (parentId) => {
      initialData.filter(d => d.parentId === parentId).forEach(child => {
        hiddenNodes.add(child.id);
        hideDescendants(child.id);
      });
    };

    // Find all collapsed nodes and hide their descendants
    initialData.forEach(d => {
      if (collapsedNodes.has(d.id)) {
        hideDescendants(d.id);
      }
    });

    const visibleData = initialData.filter(d => !hiddenNodes.has(d.id));

    const flowNodes = visibleData.map(d => {
      const hasChildren = initialData.some(child => child.parentId === d.id);
      const isHighlighted = searchQuery && (
        d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.metadata && d.metadata.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return {
        id: d.id,
        type: 'custom',
        data: {
          label: d.label,
          metadata: d.metadata,
          hasChildren,
          isCollapsed: collapsedNodes.has(d.id),
          isHighlighted: !!isHighlighted,
          onToggle: () => toggleNode(d.id)
        },
        position: { x: 0, y: 0 }, // Initial position will be overwritten by layout
      };
    });

    const flowEdges = visibleData
      .filter(d => d.parentId && !hiddenNodes.has(d.parentId))
      .map(d => ({
        id: `e-${d.parentId}-${d.id}`,
        source: d.parentId,
        target: d.id,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2, stroke: 'hsl(var(--primary))' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
        },
      }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // After layout change, smoothly fit the view to encompass the new tree
    window.requestAnimationFrame(() => {
      fitView({ duration: 800, padding: 0.2 });
    });

  }, [collapsedNodes, searchQuery, setNodes, setEdges, toggleNode, fitView]);

  return (
    <div className="w-full h-full relative font-sans">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        className="bg-slate-50 dark:bg-slate-900"
      >
        <Controls />
        <Background color="#ccc" gap={16} />
        
        {/* Top Left Panel - Info */}
        <Panel position="top-left" className="bg-white/90 dark:bg-slate-800/90 p-5 rounded-2xl shadow-xl backdrop-blur-md m-4 border border-border max-w-sm">
          <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Organization Chart</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A dynamic, client-side tree renderer. Click the arrows below any node to expand or collapse its sub-teams.
          </p>
          
          {/* Search Box */}
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary block pl-10 p-2.5 outline-none transition-all"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
