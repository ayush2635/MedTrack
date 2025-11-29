'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Mail, ArrowLeft, Activity } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotpassword`, { email });
            setMessage(data.message);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200/50 mb-6">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email to receive a reset link
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm text-center font-medium border border-green-100 animate-in fade-in slide-in-from-top-2">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm text-center font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
