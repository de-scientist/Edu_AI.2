import { motion } from 'framer-motion';
import { LearningPath, Module } from '../../types/student';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface LearningPathCardProps {
  learningPath: LearningPath;
  onModuleClick: (moduleId: string) => void;
}

export default function LearningPathCard({ learningPath, onModuleClick }: LearningPathCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {learningPath.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {learningPath.description}
        </p>
        <div className="mt-2 flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Duration: {learningPath.estimatedDuration}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Difficulty: {learningPath.difficulty}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {learningPath.modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onModuleClick(module.id)}
          >
            <div className="flex-shrink-0">
              {module.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : module.progress > 0 ? (
                <Circle className="w-6 h-6 text-blue-500" />
              ) : (
                <Lock className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {module.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {module.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {module.progress}% Complete
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 