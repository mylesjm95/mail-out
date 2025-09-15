'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { checkAdminStatus } from '@/lib/clientAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user && !loading) {
        console.log('🔍 Checking admin status for user:', user.id);
        try {
          const result = await checkAdminStatus(user.id);
          console.log('🔍 Admin check result:', result);
          setIsAdminUser(result.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
        } finally {
          setCheckingAdmin(false);
        }
      } else if (!loading) {
        console.log('🔍 No user or still loading');
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user, loading]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page
    window.location.href = '/auth';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    // Redirect to home page
    window.location.href = '/';
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard userId={user.id} />;
}