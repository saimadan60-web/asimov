import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

const FirebaseMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMigration = async () => {
    setIsMigrating(true);
    setError(null);

    try {
      await firebaseService.migrateLocalDataToFirebase();
      setMigrationComplete(true);
      
      // Clear local storage after successful migration
      localStorage.removeItem('isaacLabData');
      localStorage.removeItem('isaacLabPasswords');
      
      // Refresh the page to use Firebase data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Migration failed:', error);
      setError('Migration failed. Please try again.');
    } finally {
      setIsMigrating(false);
    }
  };

  if (migrationComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div className="bg-dark-800 rounded-2xl border border-green-500/20 p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-4">Migration Complete!</h3>
          <p className="text-green-300 mb-4">
            Your data has been successfully migrated to Firebase. The page will refresh automatically.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-dark-800 rounded-2xl border border-peacock-500/20 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-peacock-500/20 rounded-full mb-4">
            <Database className="w-8 h-8 text-peacock-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Migrate to Firebase</h3>
          <p className="text-peacock-300">
            Migrate your existing data to Firebase for better performance and real-time updates.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-peacock-500/10 border border-peacock-500/20 rounded-lg p-4">
            <h4 className="text-peacock-400 font-semibold mb-2">What will be migrated:</h4>
            <ul className="text-peacock-300 text-sm space-y-1">
              <li>• All user accounts and profiles</li>
              <li>• Component inventory data</li>
              <li>• Borrow requests and history</li>
              <li>• Notifications and system data</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMigration}
            disabled={isMigrating}
            className="w-full bg-gradient-to-r from-peacock-500 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              {isMigrating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Migrating Data...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Start Migration
                </>
              )}
            </div>
          </motion.button>

          <p className="text-dark-400 text-xs text-center">
            This process is safe and your local data will be preserved until migration is complete.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FirebaseMigration;