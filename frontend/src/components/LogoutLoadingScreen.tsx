import { Loader2 } from 'lucide-react'

export default function LogoutLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-700 font-medium">Logging out...</p>
        <p className="text-sm text-gray-500">Please wait while we sign you out</p>
      </div>
    </div>
  )
}
