import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Zap,
  Info,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUpload } from '../hooks/useUpload';

type SourceType = 'SAP' | 'Utility' | 'Travel';

const sourceRules = {
  SAP: {
    columns: ['fuel_type', 'quantity', 'unit'],
    description: 'Fuel consumption data from ERP systems',
  },
  Utility: {
    columns: ['kwh', 'billing_date', 'meter_id'],
    description: 'Electricity / gas utility bills',
  },
  Travel: {
    columns: ['distance_km', 'travel_type', 'date'],
    description: 'Business travel emissions',
  },
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [sourceType, setSourceType] = useState<SourceType>('SAP');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading, success, error, handleUpload } = useUpload();

  // IMPROVED AUTH CHECK - multiple token keys
  const getToken = () => {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token') ||
      localStorage.getItem('jwt') ||
      sessionStorage.getItem('jwt')
    );
  };

  const isAuthenticated = !!getToken();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const uploadAction = async () => {
    if (!selectedFile) return;
    await handleUpload(selectedFile, sourceType);
    setSelectedFile(null);
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleLogout = () => {
    // Clear all possible token keys
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    navigate('/');
  };

  // If not authenticated, show "Need to Authenticate" screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Need to Authenticate</h2>
          <p className="text-gray-500 mb-6">Please log in to access the upload page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/30"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/30"
                aria-label="Go forward"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              CARBONFLOW
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Upload ESG Data</h1>
          <p className="text-gray-500 mt-1">Ingest CSV files from SAP, Utility, or Travel sources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Dataset</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Type *</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="SAP">SAP</option>
                  <option value="Utility">Utility</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CSV File</label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {selectedFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={uploadAction}
                disabled={!selectedFile || loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload CSV
                  </>
                )}
              </button>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-xl flex items-center gap-2 text-sm bg-green-50 text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 text-red-700"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-5 border border-green-100">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">⚡ Pro tip</h3>
              <p className="text-xs text-gray-600">Large files are processed asynchronously using Celery workers.</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-800">Upload Rules</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Database className="w-4 h-4 text-green-600" />
                    {sourceType} Format
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-600 mb-2">{sourceRules[sourceType].description}</p>
                    <div className="flex flex-wrap gap-2">
                      {sourceRules[sourceType].columns.map((col) => (
                        <span key={col} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 font-mono">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    CSV must include valid headers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-800">Processing Pipeline</h2>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <p>Upload CSV</p>
                <p>→ Celery Processing</p>
                <p>→ Parser Validation</p>
                <p>→ ESG Record Creation</p>
                <p>→ Dashboard Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}