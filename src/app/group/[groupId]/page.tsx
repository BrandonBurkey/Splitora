import Button from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export default function GroupPage() {
  const router = useRouter()

  return (
    <div>
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <span className="text-2xl font-bold text-emerald-600">Splitora</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/explore')}>
            Explore
          </Button>
        </div>
      </nav>
    </div>
  )
} 