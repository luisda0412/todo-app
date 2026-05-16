"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Link from 'next/link'

interface Stats {
  completionRate: number;
  byPriority: { priority: string; count: number }[];
  completedByDay: { day: string; completed: number }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
        <Link 
  href="/"
  className="text-sm text-gray-400 hover:text-gray-900 transition-colors mb-6 block"
>
  ← Back
</Link>
      <div className="max-w-lg">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">Statistics</h1>
      </div>
      {/* Completion Rate */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
          Completion Rate
        </p>
        <div className="flex items-end gap-3">
          <p className="text-5xl font-medium text-gray-900">
            {stats.completionRate}%
          </p>
          <p className="text-sm text-gray-400 mb-2">of tasks completed</p>
        </div>
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-700"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
      {/* Completed by Day */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
          Completed by Day
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.completedByDay}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="completed" fill="#111827" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* By Priority */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
          By Priority
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={stats.byPriority}
              dataKey="count"
              nameKey="priority"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill="#f87171" />
              <Cell fill="#fbbf24" />
              <Cell fill="#4ade80" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
