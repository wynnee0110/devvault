import { useState } from "react";
import { X, Save } from "lucide-react";

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, category: string) => void;
}

export default function NewEntryModal({ isOpen, onClose, onCreate }: NewEntryModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Structures");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload
    if (!title.trim()) return;
    
    onCreate(title, category);
    setTitle(""); // Reset form
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
          <h2 className="text-sm font-bold text-white pl-2">New Entry</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-md transition-colors">
            <X size={18} />
          </button>
        </header>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Title</label>
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-zinc-700 transition-all" 
              placeholder="e.g. Authentication Pattern" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 py-2 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="Structures">Structures</option>
              <option value="Snippets">Snippets</option>
              <option value="Tools">Tools</option>
              <option value="Plugins">Plugins</option>
              <option value="Notes">Notes</option>
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
              <Save size={16} /> Create
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}