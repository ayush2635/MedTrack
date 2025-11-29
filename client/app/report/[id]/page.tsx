'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ResultsTable from '@/components/ResultsTable';
import Summary from '@/components/Summary';

interface TestResult {
    canonicalName: string;
    value: string | number;
    unit: string;
    flag: string;
}

interface Report {
    _id?: string;
    reportDate: string;
    createdAt: string;
    interpretation: TestResult[];
    summary?: {
        patient: string;
        clinician: string;
    };
}

export default function ReportView() {
    const { id } = useParams();
    const { user } = useAuth();
    const [record, setRecord] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/records/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecord(data);
            } catch (err) {
                setError('Failed to load report');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRecord();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/records/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/dashboard');
        } catch (err) {
            alert('Failed to delete report');
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
    );

    if (error || !record) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
            {error || 'Report not found'}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(record.reportDate).toLocaleDateString()}
                        </div>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-white">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <FileText className="w-8 h-8" />
                            Lab Report Analysis
                        </h1>
                        <p className="text-teal-100 mt-2">
                            Analyzed on {new Date(record.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="p-8 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
                                Analysis Summary
                            </h2>
                            <Summary
                                patientSummary={record.summary?.patient}
                                clinicianSummary={record.summary?.clinician}
                            />
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
                                Detailed Results
                            </h2>
                            <ResultsTable results={record.interpretation} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
