"use client";

import { motion } from "framer-motion";

interface AnalysisTabsProps {
    active: 'analysis' | 'strategy' | 'quote';
    onChange: (id: 'analysis' | 'strategy' | 'quote') => void;
}

export function AnalysisTabs({ active, onChange }: AnalysisTabsProps) {
    const tabs: { id: 'analysis' | 'strategy' | 'quote'; label: string }[] = [
        { id: 'analysis', label: 'Analysis' },
        { id: 'strategy', label: 'Strategy' },
        { id: 'quote', label: 'Quote' },
    ];

    return (
        <div className="flex p-1 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl w-full relative overflow-hidden mb-6">
            <motion.div
                layoutId="active-analysis-tab"
                className="absolute inset-1 bg-white/5 border border-white/10 rounded-lg shadow-sm"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                style={{
                    width: `calc(${100 / tabs.length}% - 8px)`,
                    left: "4px"
                }}
                animate={{
                    x: `${tabs.findIndex(t => t.id === active) * 100}%`,
                }}
            />

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex-1 relative z-10 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors ${active === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
