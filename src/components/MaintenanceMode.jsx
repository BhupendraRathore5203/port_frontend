import React, { useState, useEffect } from 'react';
import { publicApi } from '../services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const MaintenanceMode = () => {
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await publicApi.getMaintenanceStatus();
        setMaintenance(response.data);
      } catch (err) {
        console.error('Failed to check maintenance:', err);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
    // Check every 30 seconds
    const interval = setInterval(checkMaintenance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !maintenance?.maintenance_mode) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">
          {maintenance.site_name} is Under Maintenance
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {maintenance.maintenance_message || 'We are performing scheduled maintenance. Please check back soon.'}
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh Page
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          This page will automatically refresh when maintenance is complete.
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;