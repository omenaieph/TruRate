"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BreakdownChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    formatter?: (value: number | any) => string;
}

export function BreakdownChart({ data, formatter }: BreakdownChartProps) {
    return (
        <div className="h-full w-full bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} style={{ background: 'transparent' }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={24}
                        outerRadius={30}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={formatter}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
