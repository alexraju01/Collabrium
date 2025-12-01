import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexComponent,
})

/**
 * @summary Default dashboard content - shows when user visits /dashboard
 */
function DashboardIndexComponent() {
  return (
    <div className="dashboard-home">
      <h1>Welcome to Your Dashboard</h1>
      <p>This is the default dashboard view.</p>

      {/* Dashboard widgets, stats, etc. will go here */}
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Recent Tasks</h3>
          <p>No tasks yet...</p>
        </div>

        <div className="widget">
          <h3>Workspaces</h3>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  )
}
