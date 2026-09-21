'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export function GpaGradeCalculatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Computer Science 101', credits: 4, grade: 'A' },
    { id: '2', name: 'Linear Algebra & Calculus', credits: 3, grade: 'A-' },
    { id: '3', name: 'Data Structures & Algorithms', credits: 4, grade: 'B+' },
    { id: '4', name: 'Technical Communication', credits: 2, grade: 'A' },
  ]);

  const hasRecorded = useRef(false);
  useEffect(() => {
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      recordToolUse(tool);
      trackClientEvent('tool_use', { toolSlug: tool.slug });
    }
  }, [recordToolUse, tool]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Course ${prev.length + 1}`, credits: 3, grade: 'A' },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Calculate GPA
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((c) => {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    totalPoints += pts * (c.credits || 0);
    totalCredits += c.credits || 0;
  });

  const calculatedGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const percentageEstimate = totalCredits > 0 ? ((parseFloat(calculatedGpa) / 4.0) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Top GPA Result Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
          <span className="text-xs uppercase font-mono text-cyan-400 font-bold block mb-1">
            Calculated Cumulative GPA (4.0 Scale)
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-cyan-300">
            {calculatedGpa}
          </span>
        </div>

        <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
          <span className="text-xs uppercase font-mono text-emerald-400 font-bold block mb-1">
            Total Credit Hours
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-300">
            {totalCredits}
          </span>
        </div>

        <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center">
          <span className="text-xs uppercase font-mono text-indigo-400 font-bold block mb-1">
            Percentage Equivalent
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-indigo-300">
            {percentageEstimate}%
          </span>
        </div>
      </div>

      {/* Course List Editor */}
      <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            Course & Grade Roster
          </h3>

          <button
            onClick={addCourse}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-12 gap-2.5 items-center p-3 bg-[#0D0F13] border border-slate-800 rounded-xl"
            >
              <div className="col-span-12 sm:col-span-6">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="Course title..."
                  className="w-full text-xs font-semibold text-white bg-transparent border-0 focus:outline-none placeholder-slate-600"
                />
              </div>

              <div className="col-span-5 sm:col-span-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">Credits:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs font-mono font-bold text-cyan-400 bg-slate-800/60 rounded px-2 py-1 border border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-5 sm:col-span-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">Grade:</span>
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-full text-xs font-mono font-bold text-emerald-400 bg-slate-800/60 rounded px-2 py-1 border border-slate-700 focus:outline-none"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 text-right">
                {courses.length > 1 && (
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
