'use client';

import { User, Stethoscope } from 'lucide-react';

export default function Summary({ patientSummary, clinicianSummary }) {
    if (!patientSummary && !clinicianSummary) return null;

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {patientSummary && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Patient Summary</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {patientSummary}
                    </p>
                </div>
            )}

            {clinicianSummary && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Stethoscope className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Clinician Summary</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-mono text-sm">
                        {clinicianSummary}
                    </p>
                </div>
            )}
        </div>
    );
}
