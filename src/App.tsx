// src/App.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Code2, Layout, Cpu, Plug, Folder, Plus, BookOpen, Trash2 } from "lucide-react";
import NewEntryModal from "./pages/NewEntryModal";
import { VaultItem } from "./types";

export default function App() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Start with empty state
  const [items, setItems] = useState<VaultItem[]>([]);

  // 2. LOAD DATA ON STARTUP
  useEffect(() => {
    const loadData = async () => {
      // Check if running in Electron before calling API
      if (window.vaultApi) {
        try {
          const data = await window.vaultApi.getEntries();
          // Ensure data is an array
          setItems(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to load vault data:", error);
        }
      } else {
        // FALLBACK: Mock data for browser development
        setItems([
          {
            id: 1,
            title: "React Component Structure",
            category: "Structures",
            tags: ["react"],
            date: "2h ago",
            blocks: [
              { id: '1', type: 'text', content: "This is the standard boilerplate I use for functional components." },
              { id: '2', type: 'code', content: "export const Button = () => <button>Click</button>;", language: 'tsx' }
            ]
          }
        ]);
      }
    };
    loadData();
  }, []);

  // 3. ACTIONS HANDLERS (With Backend Sync)
  
  const handleCreate = async (title: string, category: string) => {
    const newItem: VaultItem = {
      id: Date.now(),
      title,
      category,
      tags: [],
      date: new Date().toLocaleDateString(),
      // Start with one empty text block
      blocks: [
        { id: crypto.randomUUID(), type: 'text', content: "" }
      ]
    };

    if (window.vaultApi) {
      try {
        const updatedList = await window.vaultApi.saveEntry(newItem);
        setItems(updatedList);
      } catch (e) {
        console.error("Failed to save entry:", e);
      }
    } else {
      setItems([newItem, ...items]); // Web fallback
    }
    
    navigate(`/collection/${category.toLowerCase()}`);
  };

  const handleUpdate = async (id: number, updatedFields: Partial<VaultItem>) => {
    // Optimistic UI update (update screen immediately)
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    
    // Background save to file
    if (window.vaultApi) {
      await window.vaultApi.updateEntry(id, updatedFields);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this?")) {
      if (window.vaultApi) {
        try {
          const updatedList = await window.vaultApi.deleteEntry(id);
          setItems(updatedList);
        } catch (e) {
          console.error("Failed to delete entry:", e);
        }
      } else {
        setItems(prev => prev.filter(item => item.id !== id)); // Web fallback
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      
      {/* --- Global Sidebar --- */}
      <aside className="w-64 bg-zinc-900 flex flex-col border-r border-zinc-800/50">
        <div className="p-4 pt-6">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="text-blue-500" /> DevVault
          </h1>
        </div>

        <div className="px-3 mb-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-6">
          {/* Collections */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Collections</div>
            <SidebarLink to="/collection/structures" icon={Layout} label="Structures" />
            <SidebarLink to="/collection/snippets" icon={Layout} label="Snippets" />
            <SidebarLink to="/collection/tools" icon={Cpu} label="Tools" />
            <SidebarLink to="/collection/plugins" icon={Plug} label="Plugins" />
            <SidebarLink to="/collection/notes" icon={Folder} label="Notes" />
          </div>
          
          {/* Library */}
          <div>
             <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Library</div>
             <SidebarLink to="/library/all" icon={BookOpen} label="All Notes" />
             <SidebarLink to="/library/trash" icon={Trash2} label="Trash" />
          </div>
        </nav>
      </aside>

      {/* --- Main Area (Outlet) --- */}
      {/* Pass state and handlers down to Dashboard */}
      <Outlet context={{ items, handleCreate, handleUpdate, handleDelete }} />

      {/* --- Modal --- */}
      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreate}
      />
      
    </div>
  );
}

// Helper: A NavLink wrapper to handle active states automatically
function SidebarLink({ to, icon: Icon, label }: any) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 mx-2 rounded-md cursor-pointer transition-colors group
        ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
      `}
    >
      <Icon size={16} />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}