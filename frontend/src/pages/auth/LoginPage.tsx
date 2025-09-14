import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { login } from '@/store/authSlice'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { SparklesCore } from '@/components/ui/sparkles'
import { useEffect } from 'react'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useAppSelector(s => s.auth)
  
  // Get registration success message and email from location state
  const registrationMessage = (location.state as any)?.message
  const registrationEmail = (location.state as any)?.email
  
  const form = useForm<z.infer<typeof schema>>({ 
    resolver: zodResolver(schema), 
    defaultValues: { 
      email: registrationEmail || '', 
      password: '' 
    } 
  })

  // Show registration success message
  useEffect(() => {
    if (registrationMessage) {
      toast.success(registrationMessage, {
        style: {
          background: '#10b981',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    }
  }, [registrationMessage])

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await dispatch(login(values))
    if ((res as any).meta.requestStatus === 'fulfilled') {
      const user = (res as any).payload.user
      const from = (location.state as any)?.from?.pathname
      
      toast.success(`Welcome back, ${user.name}!`, {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
      
      // Role-based redirect
      if (user.role === 'seller') {
        navigate(from || '/admin', { replace: true })
      } else {
        navigate(from || '/', { replace: true })
      }
    } else {
      toast.error('Login failed. Please check your credentials.', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    }
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Sparkling Background Effect */}
      <div className="absolute inset-0">
        <SparklesCore
          id="login-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#ffffff"
          speed={2}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          {/* KICKSPOT Branding - Left Side */}
          <div className="text-center lg:text-center flex flex-col items-center lg:items-center p-0 m-0">
            <h1 className="text-6xl font-bold text-white mb-3">
              KICKSPOT
            </h1>
            <p className="text-gray-300 text-lg mb-1">
              Welcome Back to Your Sneaker World
            </p>
            <p className="text-gray-400">
              Sign in to continue your journey
            </p>
          </div>

          {/* Login Form - Right Side */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl mx-auto max-w-sm transition-all duration-300 m-0">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-300 text-sm">Sign in to your account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-sm">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )} />

                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-sm">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )} />

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold h-10 transition-all duration-200"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-white font-semibold hover:text-gray-200 underline transition-colors duration-200"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


