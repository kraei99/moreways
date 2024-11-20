import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import AuthPage from '@/pages/auth/AuthPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import MarketingPage from '@/pages/marketing/MarketingPage';
import LeadsPage from '@/pages/leads/LeadsPage';
import TransactionsPage from '@/pages/transactions/TransactionsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import { PrivateRoute } from '@/components/auth/PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}