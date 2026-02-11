import React, { useState } from "react";
import {
  Search,
  Plus,
  Hash,
  Folder,
  Star,
  MoreHorizontal,
  Copy,
  Check,
  Tag,
  BookOpen,
  Layout,
  Cpu,
  Plug,
  Trash2,
  Code2
} from "lucide-react";

export default function DevVault() {
  const [selectedId, setSelectedId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data reflecting your use cases
  const items = [
    {
      id: 1,
      title: "React Component Structure",
      category: "Structures",
      tags: ["react", "typescript", "pattern"],
      date: "2h ago",
      type: "snippet",
      language: "tsx",
      description: "Standard boilerplate for functional components with typed props.",
    },
    {
      id: 2,
      title: "Docker Clean Up",
      category: "Tools",
      tags: ["docker", "shell", "devops"],
      date: "1d ago",
      type: "snippet",
      language: "bash",
      description: "Command to prune all stopped containers and unused images.",
    },
    {
      id: 3,
      title: "Tailwind Grid Layouts",
      category: "Notes",
      tags: ["css", "design"],
      date: "3d ago",
      type: "note",
      language: "css",
      description: "Common grid patterns I use for dashboard layouts.",
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      
      {/* --- Pane 1: Navigation Sidebar --- */}
      <aside className="w-64 bg-zinc-900 flex flex-col border-r border-zinc-800/50">
        <div className="p-4 pt-6">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="text-blue-500" /> DevVault
          </h1>
        </div>

        <div className="px-3 mb-4">
          <button className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} /> New Entry
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-6">
          {/* Library Section */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Library</div>
            <NavItem icon={BookOpen} label="All Notes" active />
            <NavItem icon={Star} label="Favorites" />
            <NavItem icon={Trash2} label="Trash" />
          </div>

          {/* Categories Section */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Collections</div>
            <NavItem icon={Layout} label="Structures" count={12} />
            <NavItem icon={Cpu} label="Tools & Scripts" count={8} />
            <NavItem icon={Plug} label="Plugins" count={5} />
            <NavItem icon={Folder} label="Uncategorized" count={2} />
          </div>

          {/* Tags Section */}
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Popular Tags</div>
            <div className="px-3 flex flex-wrap gap-2">
              <TagBadge label="react" />
              <TagBadge label="typescript" />
              <TagBadge label="devops" />
            </div>
          </div>
        </nav>

        {/* User / Settings Footer */}
      </aside>

      {/* --- Pane 2: Item List --- */}
      <div className="w-80 bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search vault..." 
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-md py-2 pl-9 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`
                group p-4 border-b border-zinc-800/50 cursor-pointer transition-all
                ${selectedId === item.id ? 'bg-zinc-800/80 border-l-2 border-l-blue-500' : 'hover:bg-zinc-800/30 border-l-2 border-l-transparent'}
              `}
            >
              <h3 className={`font-medium mb-1 ${selectedId === item.id ? 'text-white' : 'text-zinc-300'}`}>{item.title}</h3>
              <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {item.language}
                    </span>
                    <span className="text-[10px] text-zinc-600">{item.date}</span>
                 </div>
                 {selectedId === item.id && <MoreHorizontal size={14} className="text-zinc-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Pane 3: Main Content (Preview/Read) --- */}
      <main className="flex-1 bg-zinc-950 flex flex-col min-w-0">
        
        {/* Content Header */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <Folder size={12} />
              <span>Structures</span>
              <span>/</span>
              <span>React</span>
            </div>
            <h2 className="text-lg font-bold text-white">React Component Structure</h2>
          </div>
          <div className="flex gap-2">
            <IconButton icon={Star} />
            <IconButton icon={Tag} />
            <button className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-3 py-1.5 rounded text-sm font-medium transition-colors">
              Edit
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl mx-auto w-full">
          
          {/* Metadata Tags */}
          <div className="flex gap-2 mb-8">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">#react</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">#typescript</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">#pattern</span>
          </div>

          {/* Documentation Text */}
          <div className="prose prose-invert prose-zinc max-w-none">
            <p className="text-zinc-400 leading-7">
              This is my standard structure for creating reusable UI components in React. 
              It includes interface definitions for props and ensures we are exporting the component correctly.
            </p>
            
            <h3 className="text-white font-semibold mt-6 mb-3">Usage Notes</h3>
            <p className="text-zinc-400 leading-7 mb-6">
              Always ensure that <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300 text-sm">className</code> is passed down to the root element to allow for style overrides from the parent.
            </p>
          </div>

          {/* Snippet Block */}
          <div className="mt-6 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-xs font-medium text-zinc-400">Component.tsx</span>
              <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors">
                <Copy size={12} /> Copy
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-sm leading-6">
                <code className="block">
                  <span className="text-purple-400">import</span> <span className="text-blue-400">React</span> <span className="text-purple-400">from</span> <span className="text-orange-300">'react'</span>;<br/>
                  <br/>
                  <span className="text-purple-400">interface</span> <span className="text-yellow-300">Props</span> {"{"}<br/>
                  &nbsp;&nbsp;<span className="text-red-300">label</span>: <span className="text-blue-400">string</span>;<br/>
                  &nbsp;&nbsp;<span className="text-red-300">isActive</span>?: <span className="text-blue-400">boolean</span>;<br/>
                  {"}"}<br/>
                  <br/>
                  <span className="text-purple-400">export const</span> <span className="text-blue-400">Button</span> = ({"{"} <span className="text-red-300">label</span>, <span className="text-red-300">isActive</span> {"}"}: <span className="text-yellow-300">Props</span>) <span className="text-purple-400">=&gt;</span> {"{"}<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{"<"}<span className="text-green-400">button</span> <span className="text-blue-300">className</span>={`btn ${"{"}<span className="text-red-300">isActive</span> ? <span className="text-orange-300">'active'</span> : <span className="text-orange-300">''</span>${"}"}`}{">"}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}<span className="text-red-300">label</span>{"}"}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{"</"}<span className="text-green-400">button</span>{">"}<br/>
                  &nbsp;&nbsp;);<br/>
                  {"}"};
                </code>
              </pre>
            </div>
          </div>
          
          <div className="h-20"></div> {/* Spacer */}

        </div>
      </main>

    </div>
  );
}

// --- Components ---

function NavItem({ icon: Icon, label, active, count }: any) {
  return (
    <div className={`
      flex items-center justify-between px-3 py-2 mx-2 rounded-md cursor-pointer transition-colors group
      ${active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
    `}>
      <div className="flex items-center gap-3">
        <Icon size={16} className={active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400"} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count && <span className="text-xs text-zinc-600 group-hover:text-zinc-500">{count}</span>}
    </div>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-400 cursor-pointer transition-colors">
      <Hash size={10} />
      <span>{label}</span>
    </div>
  );
}

function IconButton({ icon: Icon }: any) {
  return (
    <button className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
      <Icon size={18} />
    </button>
  );
}