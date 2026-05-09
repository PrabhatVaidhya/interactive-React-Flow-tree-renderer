import { ReactFlowProvider } from '@xyflow/react';
import TreeView from './TreeView';

function App() {
  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-900">
      <ReactFlowProvider>
        <TreeView />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
