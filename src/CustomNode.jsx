import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';

export default function CustomNode({ data, selected }) {
  const isHighlighted = data.isHighlighted;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative flex flex-col items-center justify-center min-w-[200px] p-4 rounded-xl border-2 transition-all duration-300 shadow-sm backdrop-blur-md",
        isHighlighted 
          ? "bg-yellow-50 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-105" 
          : "bg-white/90 border-border hover:border-primary/50 hover:shadow-md",
        selected && !isHighlighted ? "border-primary shadow-primary/20 bg-blue-50/50" : ""
      )}
    >
      <Handle type="target" position={Position.Top} className={cn("!w-3 !h-3", isHighlighted ? "!bg-yellow-500" : "!bg-primary")} />
      
      <div className="flex flex-col items-center w-full">
        <h3 className={cn("text-lg font-bold", isHighlighted ? "text-yellow-900" : "text-foreground")}>
          {data.label}
        </h3>
        {data.metadata && (
          <p className={cn("text-xs mt-1 text-center font-medium", isHighlighted ? "text-yellow-700" : "text-muted-foreground")}>
            {data.metadata}
          </p>
        )}
      </div>

      {data.hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (data.onToggle) data.onToggle();
          }}
          className={cn(
            "absolute -bottom-4 bg-background border rounded-full p-1 shadow-sm transition-colors z-10",
            isHighlighted 
              ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100" 
              : "border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          {data.isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      )}

      <Handle type="source" position={Position.Bottom} className={cn("!w-3 !h-3", isHighlighted ? "!bg-yellow-500" : "!bg-primary")} />
    </motion.div>
  );
}
