import Button from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import Navigation from '@/components/Navigation';

export default function GroupPage() {
  const router = useRouter()

  return (
    <div>
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Button>
        </div>
        {/* Rest of the group page content */}
      </main>
    </div>
  )
} 