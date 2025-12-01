import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tasks')({
  component: TasksComponent,
})

/**
 * @summary Tasks page - renders inside DashboardLayout
 */
function TasksComponent() {
  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>
      <p>This is the tasks page - rendered as a child of DashboardLayout</p>

      {/* Task list will go here */}
      <div className="task-list">
        <p>No tasks to display...</p>
      </div>
    </div>
  )
}
