import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react'

export default function HelpSupportPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-black hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-black">Help & Support</h1>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-16">
          <div className="mb-8">
            <HelpCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              This feature will be available in future
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We're working hard to bring you the best support experience. 
              Our help center, live chat, and customer support features are coming soon!
            </p>
          </div>

          {/* Future Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <Mail className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Email Support</h3>
              <p className="text-sm text-gray-500">
                Get help via email with detailed responses to your queries
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <Phone className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Phone Support</h3>
              <p className="text-sm text-gray-500">
                Speak directly with our support team for immediate assistance
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-500">
                Chat with our support team in real-time for quick help
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-700 mb-4">Need immediate help?</h3>
            <p className="text-gray-600 mb-4">
              For now, you can reach us at:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> support@kickspot.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Back to Shopping Button */}
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
