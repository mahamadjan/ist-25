import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col max-w-3xl mx-auto">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
