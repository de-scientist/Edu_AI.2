"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Activity, 
  Zap, 
  Clock, 
  BarChart2,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface AIMetrics {
  accuracy: number;
  responseTime: number;
  errorRate: number;
  usageCount: number;
  timestamp: string;
}

interface AISettings {
  modelVersion: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
}

interface ModelParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
}

interface TrainingStatus {
  id: string;
  modelType: string;
  status: "idle" | "training" | "completed" | "error";
  startTime: string;
  endTime?: string;
  accuracy?: number;
  loss?: number;
  totalSamples: number;
  trainingSet: number;
  validationSet: number;
  errorMessage?: string;
}

export default function AISystemTuning() {
  const [metrics, setMetrics] = useState<AIMetrics[]>([]);
  const [settings, setSettings] = useState<AISettings>({
    modelVersion: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: "You are a helpful AI assistant."
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [activeTab, setActiveTab] = useState<"overview" | "parameters" | "training">("overview");
  const [parameters, setParameters] = useState<ModelParameter[]>([
    {
      id: "learning_rate",
      name: "Learning Rate",
      value: 0.001,
      min: 0.0001,
      max: 0.01,
      description: "Controls how quickly the model adapts to new data"
    },
    {
      id: "batch_size",
      name: "Batch Size",
      value: 32,
      min: 8,
      max: 128,
      description: "Number of samples processed before model update"
    },
    {
      id: "epochs",
      name: "Training Epochs",
      value: 10,
      min: 1,
      max: 50,
      description: "Number of complete passes through the training dataset"
    },
    {
      id: "dropout_rate",
      name: "Dropout Rate",
      value: 0.2,
      min: 0.1,
      max: 0.5,
      description: "Prevents overfitting by randomly dropping neurons"
    }
  ]);
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "completed" | "error">("idle");
  const [selectedModel, setSelectedModel] = useState("recommendation");
  const [trainingData, setTrainingData] = useState<TrainingStatus | null>(null);

  useEffect(() => {
    fetchMetrics();
    fetchSettings();
    fetchParameters();
    fetchTrainingStatus();
  }, [timeRange, selectedModel]);

  // Poll for training status updates when training is in progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (trainingStatus === "training") {
      interval = setInterval(() => {
        fetchTrainingStatus();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingStatus]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/ai/metrics?timeRange=${timeRange}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      toast.error("Failed to load AI metrics");
      console.error("Error fetching metrics:", error);
      
      // Fallback to mock data if API fails
      const mockData: AIMetrics[] = Array.from({ length: 10 }, (_, i) => ({
        accuracy: 85 + Math.random() * 10,
        responseTime: 100 + Math.random() * 200,
        errorRate: Math.random() * 5,
        usageCount: 100 + Math.random() * 900,
        timestamp: new Date(Date.now() - (9 - i) * 3600000).toISOString()
      }));
      
      setMetrics(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/ai/settings', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load AI settings");
      console.error("Error fetching settings:", error);
    }
  };

  const fetchParameters = async () => {
    try {
      const response = await fetch(`/api/admin/ai/parameters?modelType=${selectedModel}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setParameters(data);
    } catch (error) {
      toast.error("Failed to load model parameters");
      console.error("Error fetching parameters:", error);
    }
  };

  const fetchTrainingStatus = async () => {
    try {
      const response = await fetch(`/api/admin/ai/training-status?modelType=${selectedModel}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status) {
        setTrainingStatus(data.status);
        setTrainingData(data);
      }
    } catch (error) {
      console.error("Error fetching training status:", error);
    }
  };

  const handleSettingChange = (key: keyof AISettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/admin/ai/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSettings(data);
      toast.success("AI settings saved successfully");
    } catch (error) {
      toast.error("Failed to save AI settings");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshMetrics = () => {
    fetchMetrics();
  };

  const getAverageMetric = (metric: keyof Omit<AIMetrics, "timestamp">) => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, curr) => acc + curr[metric], 0);
    return (sum / metrics.length).toFixed(2);
  };

  const handleParameterChange = (id: string, value: number) => {
    setParameters(parameters.map(param =>
      param.id === id ? { ...param, value } : param
    ));
  };

  const handleSaveParameters = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/admin/ai/parameters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          parameters,
          modelType: selectedModel
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setParameters(data);
      toast.success("Model parameters saved successfully");
    } catch (error) {
      toast.error("Failed to save model parameters");
      console.error("Error saving parameters:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const startTraining = async () => {
    try {
      setTrainingStatus("training");
      
      const response = await fetch('/api/admin/ai/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          modelType: selectedModel
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success("Training started successfully");
      
      // Start polling for status updates
      fetchTrainingStatus();
    } catch (error) {
      toast.error("Failed to start training");
      console.error("Error starting training:", error);
      setTrainingStatus("error");
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Accuracy</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {getAverageMetric("accuracy")}%
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Average response accuracy
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {getAverageMetric("responseTime")}ms
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Average response time
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Error Rate</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {getAverageMetric("errorRate")}%
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Average error rate
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage</h3>
            <BarChart2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {getAverageMetric("usageCount")}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Average daily usage
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3B82F6" 
                name="Accuracy (%)"
              />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#F59E0B" 
                name="Response Time (ms)"
              />
              <Line 
                type="monotone" 
                dataKey="errorRate" 
                stroke="#EF4444" 
                name="Error Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Settings</h3>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>Save Settings</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Model Version
            </label>
            <select
              value={settings.modelVersion}
              onChange={(e) => handleSettingChange("modelVersion", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Temperature
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleSettingChange("temperature", parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>More Focused</span>
              <span>More Creative</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => handleSettingChange("maxTokens", parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              System Prompt
            </label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => handleSettingChange("systemPrompt", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderParametersTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Model Parameters</h3>
          <button
            onClick={handleSaveParameters}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>Save Parameters</span>
          </button>
        </div>
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  {param.name}
                </label>
                <span className="text-sm text-gray-500">{param.value}</span>
              </div>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={(param.max - param.min) / 100}
                value={param.value}
                onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm text-gray-500">{param.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Model Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedModel === "recommendation"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setSelectedModel("recommendation")}
          >
            <h4 className="font-medium mb-2">Recommendation Engine</h4>
            <p className="text-sm text-gray-500">
              Personalizes content and course recommendations
            </p>
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedModel === "assessment"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setSelectedModel("assessment")}
          >
            <h4 className="font-medium mb-2">Assessment Model</h4>
            <p className="text-sm text-gray-500">
              Evaluates student performance and progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Model Training</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Training Status</h4>
              <p className="text-sm text-gray-500">
                {trainingStatus === "idle" && "Ready to start training"}
                {trainingStatus === "training" && "Training in progress..."}
                {trainingStatus === "completed" && "Training completed successfully"}
                {trainingStatus === "error" && "Training failed"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {trainingStatus === "training" && (
                <RefreshCw className="animate-spin text-blue-500" size={20} />
              )}
              {trainingStatus === "completed" && (
                <CheckCircle className="text-green-500" size={20} />
              )}
              {trainingStatus === "error" && (
                <XCircle className="text-red-500" size={20} />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Training Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Total Samples</p>
                <p className="text-2xl font-bold">{trainingData?.totalSamples || 10000}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Training Set</p>
                <p className="text-2xl font-bold">{trainingData?.trainingSet || 8000}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Validation Set</p>
                <p className="text-2xl font-bold">{trainingData?.validationSet || 2000}</p>
              </div>
            </div>
          </div>

          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={startTraining}
            disabled={trainingStatus === "training"}
          >
            {trainingStatus === "idle" && "Start Training"}
            {trainingStatus === "training" && "Training in Progress..."}
            {trainingStatus === "completed" && "Retrain Model"}
            {trainingStatus === "error" && "Retry Training"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Model Performance</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-green-600">
                {trainingData?.accuracy ? `${(trainingData.accuracy * 100).toFixed(1)}%` : "94.5%"}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Loss</p>
              <p className="text-2xl font-bold text-blue-600">
                {trainingData?.loss ? trainingData.loss.toFixed(3) : "0.023"}
              </p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Training History</p>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {/* Add chart component here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI System Tuning</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshMetrics}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "parameters"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("parameters")}
        >
          Parameters
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "training"
              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("training")}
        >
          Training
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverviewTab()}
      {activeTab === "parameters" && renderParametersTab()}
      {activeTab === "training" && renderTrainingTab()}
    </div>
  );
} 