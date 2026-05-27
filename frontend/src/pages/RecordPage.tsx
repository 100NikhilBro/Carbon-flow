import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flag,
  FileSpreadsheet,
  File as FileIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Lock,
} from 'lucide-react';
import { useRecords } from '../hooks/useRecords';
import { useNavigate } from 'react-router-dom';

export default function RecordsPage() {
  const navigate = useNavigate();
  const {
    records,
    loading,
    error,
    filters,
    setFilters,
    handleApprove,
    handleReject,
    handleExportCSV,
    handleExportExcel,
  } = useRecords();

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

  const [sortField, setSortField] = useState('occurred_on');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState({
    open: false,
    recordId: null as string | null,
    notes: '',
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // SORTING
  const sortedRecords = useMemo(() => {
    const sorted = [...records];
    sorted.sort((a: any, b: any) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === 'occurred_on') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [records, sortField, sortDirection]);

  // PAGINATION
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const approveAction = async (recordId: string) => {
    try {
      setActionLoading(recordId);
      await handleApprove(recordId);
      showToast('Record approved', 'success');
    } catch {
      showToast('Approval failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectAction = async () => {
    if (!rejectModal.recordId) return;
    try {
      setActionLoading(rejectModal.recordId);
      await handleReject(rejectModal.recordId, rejectModal.notes);
      showToast('Record rejected', 'success');
      setRejectModal({ open: false, recordId: null, notes: '' });
    } catch {
      showToast('Reject failed', 'error');
    } finally {
      setActionLoading(null);
    }
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

  const StatusBadge = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
    const config = {
      pending: { icon: AlertCircle, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      approved: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      rejected: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };
    const { icon: Icon, bg, text, label } = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  // If not authenticated and not loading (avoid flash while loading)
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Need to Authenticate</h2>
          <p className="text-gray-500 mb-6">Please log in to access records.</p>
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

  // Show loading state while fetching data (but only if authenticated)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading records...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ESG Records Management</h1>
          <p className="text-gray-500 mt-1">Review and manage uploaded ESG datasets</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <select value={filters.review_status} onChange={(e) => setFilters({ ...filters, review_status: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={filters.scope} onChange={(e) => setFilters({ ...filters, scope: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option value="">All Scopes</option>
              <option value="scope_1">Scope 1</option>
              <option value="scope_2">Scope 2</option>
              <option value="scope_3">Scope 3</option>
            </select>
            <select value={filters.is_flagged} onChange={(e) => setFilters({ ...filters, is_flagged: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option value="">All Records</option>
              <option value="true">Flagged Only</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <FileIcon className="w-4 h-4" /> CSV
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search activity or company" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Activity</th>
                  <th className="px-4 py-3 text-left font-medium">Scope</th>
                  <th className="px-4 py-3 text-right font-medium cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />)}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Unit</th>
                  <th className="px-4 py-3 text-right font-medium cursor-pointer" onClick={() => handleSort('co2e_emissions')}>
                    CO₂e {sortField === 'co2e_emissions' && (sortDirection === 'asc' ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />)}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Flagged</th>
                  <th className="px-4 py-3 text-left font-medium">Occurred On</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRecords.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
                ) : (
                  paginatedRecords.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{record.activity_type}</td>
                      <td className="px-4 py-3">{record.scope}</td>
                      <td className="px-4 py-3 text-right">{record.quantity}</td>
                      <td className="px-4 py-3">{record.unit}</td>
                      <td className="px-4 py-3 text-right">{record.co2e_emissions}</td>
                      <td className="px-4 py-3"><StatusBadge status={record.review_status} /></td>
                      <td className="px-4 py-3">
                        {record.is_flagged ? (
                          <span className="inline-flex items-center gap-1 text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full"><Flag className="w-3 h-3" /> Flagged</span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">{record.occurred_on}</td>
                      <td className="px-4 py-3">
                        {record.review_status === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => approveAction(record.id)} disabled={actionLoading === record.id} className="text-green-600 hover:text-green-700 disabled:opacity-50">
                              {actionLoading === record.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setRejectModal({ open: true, recordId: record.id, notes: '' })} className="text-red-600 hover:text-red-700">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : <span className="text-gray-400 text-xs">{record.review_status}</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {sortedRecords.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 gap-3">
              <div className="text-xs text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedRecords.length)} of {sortedRecords.length}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 rounded disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1 rounded disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reject Record</h3>
              <button onClick={() => setRejectModal({ open: false, recordId: null, notes: '' })}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <textarea value={rejectModal.notes} onChange={(e) => setRejectModal(prev => ({ ...prev, notes: e.target.value }))} placeholder="Analyst notes" className="w-full border border-gray-200 rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setRejectModal({ open: false, recordId: null, notes: '' })} className="px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={rejectAction} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}