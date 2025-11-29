'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import FileUpload from '@/components/FileUpload';
import ResultsTable from '@/components/ResultsTable';
import Summary from '@/components/Summary';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LogOut, Activity, History, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
    canonicalName: string;
    value: string | number;
    unit: string;
    flag: string;
}

interface Report {
    _id?: string;
    reportDate: string;
    interpretation: TestResult[];
    summaries?: {
        patient: string;
        clinician: string;
    };
    modelMeta?: any;
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<Report | null>(null);
    const [error, setError] = useState('');
    const [recentReports, setRecentReports] = useState<Report[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/records`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentReports(data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const handleFileSelect = async (file: File) => {
        setIsProcessing(true);
        setError('');
        setResults(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reportDate', new Date().toISOString().split('T')[0]);

            const token = localStorage.getItem('token');

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/interpret`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(data);

            // Save record
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/records`, {
                reportDate: new Date().toISOString().split('T')[0],
                rawCandidates: [],
                interpretation: data.interpretation,
                summary: data.summaries,
                modelMeta: data.modelMeta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchHistory(); // Refresh history

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to process report');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-teal-100">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-teal-200/50">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                MedTrack
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                <Link href="/profile" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    Edit Profile
                                </Link>
                            </div>
                            <Link href="/profile" className="sm:hidden p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-gray-50">
                                <User className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-all px-4 py-2 rounded-xl hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-teal-200/40 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                                            Welcome back, {user.name?.split(' ')[0]}
                                        </h1>
                                        <p className="text-teal-50 text-lg max-w-xl leading-relaxed">
                                            Your health journey continues. Upload your latest report for a detailed AI analysis tailored to you.
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center min-w-[100px]">
                                            <span className="text-2xl font-bold">{user.age}</span>
                                            <span className="text-xs text-teal-100 uppercase tracking-wider font-medium">{user.sex}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center justify-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {results && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
                                        Analysis Summary
                                    </h2>
                                    <Summary
                                        patientSummary={results.summaries?.patient}
                                        clinicianSummary={results.summaries?.clinician}
                                    />
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
                                        Detailed Results
                                    </h2>
                                    <ResultsTable results={results.interpretation} />
                                </section>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / History */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <History className="w-5 h-5 text-gray-400" />
                                    Recent Reports
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {recentReports.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">No reports yet.</p>
                                ) : (
                                    recentReports.slice(0, 5).map((report, idx) => (
                                        <Link href={`/report/${report._id}`} key={idx} className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group hover:border-teal-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-teal-700 transition-colors">
                                                    <Calendar className="w-4 h-4 text-teal-500" />
                                                    {new Date(report.reportDate).toLocaleDateString()}
                                                </div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                    {report.interpretation?.length || 0} tests
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {report.interpretation?.slice(0, 2).map((test, i) => (
                                                    <div key={i} className="flex justify-between text-xs">
                                                        <span className="text-gray-500 truncate max-w-[120px]">{test.canonicalName}</span>
                                                        <span className={`font-medium ${test.flag?.toLowerCase() === 'high' ? 'text-red-600' :
                                                            test.flag?.toLowerCase() === 'low' ? 'text-amber-600' : 'text-emerald-600'
                                                            }`}>
                                                            {test.value} {test.unit}
                                                        </span>
                                                    </div>
                                                ))}
                                                {report.interpretation?.length > 2 && (
                                                    <p className="text-xs text-gray-400 mt-1">+{report.interpretation.length - 2} more</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
