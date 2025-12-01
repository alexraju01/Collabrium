import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$workspaceId')({
  component: RouteComponent,
  // params: {workspaceId}
})

function RouteComponent() {
  return (
  <div className='bg-neutral-400 flex w-full h-96'>
    <div>
      Title text
    </div>
  </div>)
}
