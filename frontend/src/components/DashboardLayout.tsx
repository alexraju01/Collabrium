import { Outlet, Link } from '@tanstack/react-router'

export default function DashboardLayout() {
  return (
    <div className="dashboard-container min-h-screen flex">
      {/* Sidebar */}
      <aside className="dashboard-sidebar w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-700"
            activeProps={{ className: 'bg-gray-700' }}
          >
            Home
          </Link>
          <Link
            to="/dashboard/tasks"
            className="block px-4 py-2 rounded hover:bg-gray-700"
            activeProps={{ className: 'bg-gray-700' }}
          >
            Tasks
          </Link>
          {/* Add more navigation links here */}
        </nav>
      </aside>

      {/* Main Content Area - where child routes render */}
      <main className="dashboard-content flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
