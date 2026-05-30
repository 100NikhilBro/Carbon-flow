import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  FileText,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Lock,
} from 'lucide-react';
import { useMe } from '../hooks/useMe';
import { Link, useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const {
    summary,
    scopeData,
    reviewData,
    flaggedRecords,
    loading,
    error,
  } = useDashboard();

  const { user } = useMe();
//   console.log('User from hook:', user);

  // IMPROVED AUTH CHECK - multiple token keys + user object
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

  const isAuthenticated = !!getToken() || !!user?.id; // user.id exists means definitely logged in

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    navigate('/');
  };

  // If not authenticated, show "Need to Authenticate"
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Need to Authenticate</h2>
          <p className="text-gray-500 mb-6">Please log in to access the dashboard.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ... rest of your stats, charts, etc. (same as before)
 const stats = [
  {
    label: 'Total Records',
    value: summary?.total_records || 0,
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    label: 'Approved',
    value: summary?.approved_records || 0,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    label: 'Pending',
    value: summary?.pending_records || 0,
    icon: Clock,
    color: 'text-yellow-600',
  },
  {
    label: 'Flagged',
    value: summary?.flagged_records || 0,
    icon: AlertCircle,
    color: 'text-red-600',
  },
];
  
  const PIE_COLORS = ['#16a34a', '#facc15', '#dc2626'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => navigate(1)} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              CARBONFLOW
            </h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {greeting}, {user?.username || 'User'}
              <p className="text-base font-normal text-gray-500 mt-1">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} - {user?.company?.name}
              </p>
            </h1>
            <p className="text-gray-500 mt-1">Here's your ESG performance overview</p>
          </div>
          <Link to="/upload" className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4" /> New Upload
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Emissions By Scope</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scopeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scope" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total_emissions" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Review Status</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reviewData} dataKey="count" nameKey="review_status" outerRadius={90} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {reviewData.map((_, index) => (<Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Flagged Records */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Flagged Records</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr><th className="px-5 py-3">Activity</th><th className="px-5 py-3">Scope</th><th className="px-5 py-3">Quantity</th><th className="px-5 py-3">Reason</th></tr>
              </thead>
              <tbody>
                {flaggedRecords?.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-800">{record.activity_type}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{record.scope}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{record.quantity}</td>
                    <td className="px-5 py-3 text-sm text-red-500">{record.flag_reason}</td>
                  </tr>
                ))}
                {(!flaggedRecords || flaggedRecords.length === 0) && <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No flagged records</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-4"><Link to="/records" className="inline-flex items-center text-sm text-green-600 hover:text-green-700">View all <ArrowUpRight className="w-3 h-3 ml-1" /></Link></div>
        </div>
      </div>
    </div>
  );
}
