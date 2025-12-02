import Layout from '@/components/Layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {
  return (
  
    <div className="bg-white-500">
      <Layout>
      </Layout>
    </div>
      
  
  )
}
