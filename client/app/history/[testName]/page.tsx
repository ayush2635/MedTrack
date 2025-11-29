'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import TrendChart from '@/components/TrendChart';
import Link from 'next/link';

interface HistoryRecord {
    date: string;
    value: number;
    unit: string;
    flag: string;
}

export default function HistoryPage() {
    const { testName } = useParams();
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/history/${testName}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [testName, user]);

    if (loading) return <div className="p-8 text-center">Loading history...</div>;

    const decodedTestName = typeof testName === 'string' ? decodeURIComponent(testName) : '';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        History: {decodedTestName}
                    </h1>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                        Back to Dashboard
                    </Link>
                </div>

                <div className="mb-8">
                    <TrendChart
                        data={history}
                        testName={decodedTestName}
                        unit={history[0]?.unit || ''}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((record, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.value} {record.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.flag}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
