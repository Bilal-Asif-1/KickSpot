import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerUser } from '@/store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { SparklesCore } from '@/components/ui/sparkles'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']),
})

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '', role: 'user' } })

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await dispatch(registerUser(values))
    if ((res as any).meta.requestStatus === 'fulfilled') {
      const user = (res as any).payload
      toast.success(`Welcome to KickSpot, ${user.name}!`, {
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
      // Role-based redirect after registration
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      toast.error('Registration failed. Please try again.', {
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
          id="register-sparkles"
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
        <div className="w-full max-w-md">
          {/* KICKSPOT Branding */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-2 tracking-wider">
              KICKSPOT
            </h1>
            <p className="text-gray-300 text-lg">
              Join the Ultimate Sneaker Experience
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-300">Start your sneaker journey today</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )} />

                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        {...field} 
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )} />

                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a strong password" 
                        {...field} 
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )} />

                <FormField name="role" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-white/50">
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="user" className="text-white hover:bg-gray-700">Customer (Buyer)</SelectItem>
                        <SelectItem value="admin" className="text-white hover:bg-gray-700">Admin (Can add products)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-300" />
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
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 text-lg rounded-lg transition-all duration-200"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-white font-semibold hover:text-gray-200 transition-colors underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


