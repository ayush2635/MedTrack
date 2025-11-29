'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { User, Calendar, Users, Save, ArrowLeft, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: 'Male',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                age: user.age || '',
                sex: user.sex || 'Male'
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                name: formData.name,
                age: formData.age,
                sex: formData.sex,
                ...(formData.password ? { password: formData.password } : {})
            };

            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('user', JSON.stringify(data));
            // Clear password fields on success
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            setMessage({ type: 'success', text: 'Profile updated successfully' });

            // Optional: Reload to reflect changes globally if needed, or just let the user see the success message
            setTimeout(() => window.location.reload(), 1000);

        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-8 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
                                <p className="text-teal-50 mt-1 text-lg opacity-90">Manage your personal information and security.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10">
                        {message.text && (
                            <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <Shield className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Personal Info Section */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <User className="w-5 h-5 text-teal-500" />
                                    Personal Information
                                </h3>

                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                            </div>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                                </div>
                                                <input
                                                    name="age"
                                                    type="number"
                                                    min="0"
                                                    required
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                                    placeholder="25"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sex</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Users className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                                </div>
                                                <select
                                                    name="sex"
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                                                    value={formData.sex}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Security Section */}
                            <section className="space-y-6 pt-2">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <Lock className="w-5 h-5 text-teal-500" />
                                    Security
                                </h3>

                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                            </div>
                                            <input
                                                name="password"
                                                type="password"
                                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                                placeholder="Leave blank to keep current password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {formData.password && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                                </div>
                                                <input
                                                    name="confirmPassword"
                                                    type="password"
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                                    placeholder="Confirm new password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.01] shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? 'Saving Changes...' : (
                                        <span className="flex items-center gap-2">
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
