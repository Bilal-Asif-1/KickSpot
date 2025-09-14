import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
  role: z.enum(['buyer', 'seller']),
  // Common fields for both buyers and sellers
  contactNumber: z.string().min(10),
  deliveryAddress: z.string().min(10).optional(),
  // Seller-specific fields
  businessAddress: z.string().optional(),
  cnicNumber: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
}).refine((data) => {
  // If role is buyer, deliveryAddress is required
  if (data.role === 'buyer') {
    return data.deliveryAddress && data.deliveryAddress.trim().length > 0
  }
  // For sellers, delivery address is not required
  return true
}, {
  message: "Delivery address is required for buyers",
  path: ["deliveryAddress"]
}).refine((data) => {
  // If role is seller, make seller fields required
  if (data.role === 'seller') {
    return data.businessAddress && data.businessAddress.trim().length > 0 &&
           data.cnicNumber && data.cnicNumber.trim().length > 0 &&
           data.bankAccountNumber && data.bankAccountNumber.trim().length > 0 &&
           data.bankName && data.bankName.trim().length > 0
  }
  return true
}, {
  message: "All seller fields are required when registering as a seller",
  path: ["businessAddress"] // This will show the error on the businessAddress field
})

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer')
  const form = useForm<z.infer<typeof schema>>({ 
    resolver: zodResolver(schema), 
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      role: 'buyer',
      contactNumber: '',
      deliveryAddress: '',
      businessAddress: '',
      cnicNumber: '',
      bankAccountNumber: '',
      bankName: ''
    } 
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log('🚀 FORM SUBMITTED!')
    console.log('Form values:', values)
    console.log('Selected role:', selectedRole)
    
    const res = await dispatch(registerUser(values))
    console.log('Registration response:', res)
    
    if ((res as any).meta.requestStatus === 'fulfilled') {
      const user = (res as any).payload
      console.log('Registration successful, user:', user)
      
      toast.success(`Registration successful! Welcome to KickSpot, ${user.name}!`, {
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
      
      // Redirect to login page with success message
      console.log('Registration successful, redirecting to login')
      navigate('/login', { 
        state: { 
          message: `Registration successful! Welcome to KickSpot, ${user.name}! Please login to continue.`,
          email: user.email 
        } 
      })
    } else {
      const error = (res as any).payload || (res as any).error?.message || 'Registration failed'
      console.error('Registration failed:', error)
      
      toast.error(`Registration failed: ${error}`, {
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
                <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          {/* KICKSPOT Branding - Left Side */}
          <div className="text-center lg:text-center flex flex-col items-center lg:items-center p-0 m-0">
            <h1 className="text-6xl font-bold text-white mb-3">
              KICKSPOT
            </h1>
            <p className="text-gray-300 text-lg mb-1">
              Join the Ultimate Sneaker Experience
            </p>
            <p className="text-gray-400">
              Create your account and start your journey
            </p>
          </div>

          {/* Registration Form - Right Side */}
          <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl mx-auto transition-all duration-300 m-0 ${
            selectedRole === 'seller' ? 'max-w-2xl' : 'max-w-sm'
          }`}>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
              <p className="text-gray-300 text-sm">Start your sneaker journey today</p>
            </div>

      <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {/* Role Selection - Always show */}
                <FormField name="role" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-sm">Account Type</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedRole(value as 'buyer' | 'seller')
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-white/50 h-10">
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="buyer" className="text-white hover:bg-gray-700">Customer (Buyer)</SelectItem>
                        <SelectItem value="seller" className="text-white hover:bg-gray-700">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )} />

                {/* Customer fields - Show when Customer is selected */}
                {selectedRole === 'buyer' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />

                      <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField name="contactNumber" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Contact Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+92 300 1234567" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
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
                              placeholder="Create a strong password" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <FormField name="deliveryAddress" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium text-sm">Delivery Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your complete delivery address" 
                            {...field} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300 text-xs" />
                      </FormItem>
                    )} />
                  </div>
                )}

                {/* Seller fields - Show when Seller is selected */}
                {selectedRole === 'seller' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Full Name</FormLabel>
              <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
              </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
            </FormItem>
          )} />

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Email Address</FormLabel>
              <FormControl>
                              <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
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
                                placeholder="Create a strong password" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
                            </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
                          </FormItem>
                        )} />

                        <FormField name="contactNumber" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Contact Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+92 300 1234567" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
                            </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
                          </FormItem>
                        )} />

                      </div>

                      {/* Right Column - Seller-specific fields */}
                      <div className="space-y-3">
                        <FormField name="businessAddress" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Business Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your business address" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
                            </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
                          </FormItem>
                        )} />

                        <FormField name="cnicNumber" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium text-sm">CNIC Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="12345-1234567-1" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
                            </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
                          </FormItem>
                        )} />

                        <FormField name="bankName" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Bank Name</FormLabel>
              <FormControl>
                              <Input 
                                placeholder="Enter bank name (e.g., HBL, MCB, UBL)" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
              </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
            </FormItem>
          )} />

                        <FormField name="bankAccountNumber" control={form.control} render={({ field }) => (
            <FormItem>
                            <FormLabel className="text-white font-medium text-sm">Account Number</FormLabel>
                <FormControl>
                              <Input 
                                placeholder="1234567890123456" 
                                {...field} 
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              />
                </FormControl>
                            <FormMessage className="text-red-300 text-xs" />
            </FormItem>
          )} />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading} 
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('🔘 BUTTON CLICKED!')
                    console.log('Form values:', form.getValues())
                    console.log('Form errors:', form.formState.errors)
                    console.log('Form is valid:', form.formState.isValid)
                    
                    // Test direct API call
                    const values = form.getValues()
                    
                    // Clean up the data - remove empty deliveryAddress for sellers
                    const cleanValues = { ...values }
                    if (cleanValues.role === 'seller' && (!cleanValues.deliveryAddress || cleanValues.deliveryAddress.trim() === '')) {
                      delete cleanValues.deliveryAddress
                    }
                    
                    console.log('Testing direct API call with values:', cleanValues)
                    console.log('JSON stringified:', JSON.stringify(cleanValues))
                    
                    fetch('http://localhost:5000/api/v1/auth/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(cleanValues)
                    })
                    .then(response => {
                      console.log('Response status:', response.status)
                      return response.json()
                    })
                    .then(data => {
                      console.log('✅ API response:', data)
                      if (data.id) {
                        alert('Registration successful! User ID: ' + data.id)
                      } else {
                        alert('Registration failed: ' + (data.message || 'Unknown error'))
                        console.log('Full response:', data)
                      }
                    })
                    .catch(error => {
                      console.error('❌ Direct API call failed:', error)
                      alert('Registration failed: ' + error.message)
                    })
                  }}
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 text-base rounded-lg transition-all duration-200 mt-4"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
        </form>
      </Form>

            {/* Login Link */}
            <div className="text-center mt-4">
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


