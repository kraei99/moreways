import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen flex w-full dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}