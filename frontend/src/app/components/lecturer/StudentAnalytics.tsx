"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { CourseAnalytics, StudentProgress } from "../../types/lecturer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function StudentAnalytics() {
  const { selectedCourse, analytics, loading, error } = useLecturerDashboard();
  const [selectedMetric, setSelectedMetric] = useState<string>("attendance");
  const [timeRange, setTimeRange] = useState<string>("week");

  const renderMetricChart = () => {
    if (!analytics) return null;

    const data = analytics.studentProgress.map((progress) => ({
      name: progress.studentName,
      value: progress[selectedMetric as keyof StudentProgress] as number,
    }));

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAttendanceTrend = () => {
    if (!analytics) return null;

    const data = [
      { name: "Week 1", attendance: analytics.averageAttendance },
      { name: "Week 2", attendance: analytics.averageAttendance + 5 },
      { name: "Week 3", attendance: analytics.averageAttendance - 2 },
      { name: "Week 4", attendance: analytics.averageAttendance + 3 },
    ];

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!analytics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Average Quiz Score</h4>
          <p className="text-2xl font-semibold mt-2">
            {analytics.averageQuizScore}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
          <p className="text-2xl font-semibold mt-2">
            {analytics.completionRate}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Average Attendance</h4>
          <p className="text-2xl font-semibold mt-2">
            {analytics.averageAttendance}%
          </p>
        </div>
      </div>
    );
  };

  const renderModulePerformance = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-4">
        {analytics.modulePerformance.map((module) => (
          <div
            key={module.moduleId}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{module.moduleName}</h4>
              <span className="text-sm text-gray-500">
                {module.averageScore}% average
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${module.averageScore}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {module.completionRate}% completion rate
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSentimentAnalysis = () => {
    if (!analytics?.sentimentAnalysis) return null;

    const { overall, trends } = analytics.sentimentAnalysis;

    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2">Overall Sentiment</h4>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                overall === "positive"
                  ? "bg-green-500"
                  : overall === "negative"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <span className="capitalize">{overall}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2">Sentiment Trends</h4>
          <div className="space-y-2">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{trend.topic}</span>
                <span
                  className={`text-sm ${
                    trend.sentiment === "positive"
                      ? "text-green-600"
                      : trend.sentiment === "negative"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {trend.sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to view analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading analytics: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Course Analytics</h2>
        {renderPerformanceMetrics()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Student Performance</h3>
          <div className="flex space-x-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="attendance">Attendance</option>
              <option value="quizScore">Quiz Score</option>
              <option value="assignmentScore">Assignment Score</option>
              <option value="participation">Participation</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
        {renderMetricChart()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
        {renderAttendanceTrend()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Module Performance</h3>
        {renderModulePerformance()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Student Sentiment</h3>
        {renderSentimentAnalysis()}
      </div>
    </div>
  );
} 