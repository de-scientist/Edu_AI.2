import { motion } from 'framer-motion';
import { Progress } from '../../types/student';

interface ProgressCardProps {
  progress: Progress;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ProgressCard({ progress, title, description, icon }: ProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress.timeSpent} minutes
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress.score}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Progress</span>
        <span>{progress.score}%</span>
      </div>
    </motion.div>
  );
} 