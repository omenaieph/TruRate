"use client";

import { motion } from "framer-motion";

interface ScenarioSwitcherProps {
    active: "A" | "B";
    onChange: (id: "A" | "B") => void;
}

export function ScenarioSwitcher({ active, onChange }: ScenarioSwitcherProps) {
    return (
        <div className="flex p-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl w-fit relative overflow-hidden shadow-2xl">
            <motion.div
                layoutId="active-scenario"
                className="absolute inset-1 bg-gradient-to-tr from-white/[0.08] to-white/[0.02] border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                style={{
                    width: "calc(50% - 4px)",
                    left: active === "A" ? "4px" : "4px" // Keep static left
                }}
                animate={{
                    x: active === "A" ? 0 : "100%",
                }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />

            <button
                onClick={() => onChange("A")}
                className={`relative z-10 px-8 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${active === "A" ? "text-white" : "text-zinc-500 hover:text-zinc-400"
                    }`}
            >
                Scenario A
            </button>

            <button
                onClick={() => onChange("B")}
                className={`relative z-10 px-8 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${active === "B" ? "text-white" : "text-zinc-500 hover:text-zinc-400"
                    }`}
            >
                Scenario B
            </button>
        </div>
    );
}
