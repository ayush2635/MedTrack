'use client';

import { CheckCircle, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
    canonicalName: string;
    value: string | number;
    unit: string;
    flag: string;
    aliases?: string[];
    referenceRange?: {
        low: number;
        high: number;
    };
}

interface ResultsTableProps {
    results: TestResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
    if (!results || results.length === 0) return null;

    const getStatusConfig = (flag: string) => {
        switch (flag?.toLowerCase()) {
            case 'high':
                return { color: 'text-red-700 bg-red-50 border-red-100', icon: <ArrowUp className="w-4 h-4" /> };
            case 'low':
                return { color: 'text-amber-700 bg-amber-50 border-amber-100', icon: <ArrowDown className="w-4 h-4" /> };
            case 'normal':
                return { color: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: <CheckCircle className="w-4 h-4" /> };
            default:
                return { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: <HelpCircle className="w-4 h-4" /> };
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-100">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Name</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference Range</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {results.map((item, idx) => {
                        const status = getStatusConfig(item.flag);
                        return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors duration-200">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <Link
                                            href={`/history/${encodeURIComponent(item.canonicalName)}`}
                                            className="text-base font-medium text-gray-900 hover:text-teal-600 transition-colors"
                                        >
                                            {item.canonicalName}
                                        </Link>
                                        {item.aliases && item.aliases.length > 0 && (
                                            <span className="text-xs text-gray-400 mt-1">{item.aliases.join(', ')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-lg font-bold text-gray-900">{item.value}</span>
                                        <span className="text-sm text-gray-500 font-medium">{item.unit}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-mono bg-gray-50/30 rounded-lg">
                                    {item.referenceRange ? `${item.referenceRange.low} - ${item.referenceRange.high}` : '-'}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color}`}>
                                        {status.icon}
                                        {item.flag?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
