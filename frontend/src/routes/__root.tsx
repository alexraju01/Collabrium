import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
    <div>
      <Outlet />
      {/* Footer */}
    </div>
      {/* TanStack DevTools - Commented out for cleaner UI */}
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
})
