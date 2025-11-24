import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})


/**
 * @summary The users personalized dashboard
 * @returns 
 */
function RouteComponent() {
  return <div className="">Hello "/dashboard"!</div>
}