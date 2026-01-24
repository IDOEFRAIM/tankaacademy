"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {
    name: "Lun",
    minutes: 45,
  },
  {
    name: "Mar",
    minutes: 60,
  },
  {
    name: "Mer",
    minutes: 120,
  },
  {
    name: "Jeu",
    minutes: 30,
  },
  {
    name: "Ven",
    minutes: 90,
  },
  {
    name: "Sam",
    minutes: 15,
  },
  {
    name: "Dim",
    minutes: 0,
  },
];

export const ActivityChart = () => {
    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 text-white p-2 rounded-md text-xs shadow-xl">
            <p className="font-semibold">{`${label} : ${payload[0].value} min`}</p>
            </div>
        );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32}>
                <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                <Bar 
                dataKey="minutes" 
                fill="#0ea5e9" // sky-500
                radius={[6, 6, 6, 6]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                />
            </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
