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
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  role: z.enum(['buyer', 'seller']),
  
  // Common fields for both buyers and sellers
  contactNumber: z.string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid contact number"),
  
  deliveryAddress: z.string().optional(),
  
  // Seller-specific fields
  businessAddress: z.string().optional(),
  cnicNumber: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
}).refine((data) => {
  // If role is buyer, deliveryAddress is required
  if (data.role === 'buyer') {
    return data.deliveryAddress && data.deliveryAddress.trim().length >= 10
  }
  return true
}, {
  message: "Delivery address is required and must be at least 10 characters for buyers",
  path: ["deliveryAddress"]
}).refine((data) => {
  // If role is seller, make seller fields required
  if (data.role === 'seller') {
    return data.businessAddress && data.businessAddress.trim().length >= 10 &&
           data.cnicNumber && data.cnicNumber.trim().length >= 13 &&
           data.bankAccountNumber && data.bankAccountNumber.trim().length >= 10 &&
           data.bankName && data.bankName.trim().length >= 2
  }
  return true
}, {
  message: "All seller fields are required when registering as a seller",
  path: ["businessAddress"]
}).refine((data) => {
  // CNIC validation for sellers
  if (data.role === 'seller' && data.cnicNumber) {
    return /^\d{5}-\d{7}-\d{1}$/.test(data.cnicNumber.trim())
  }
  return true
}, {
  message: "CNIC must be in format: 12345-1234567-1",
  path: ["cnicNumber"]
}).refine((data) => {
  // Bank account validation for sellers
  if (data.role === 'seller' && data.bankAccountNumber) {
    return /^\d{10,20}$/.test(data.bankAccountNumber.trim())
  }
  return true
}, {
  message: "Bank account number must be 10-20 digits",
  path: ["bankAccountNumber"]
})

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer')
  const [password, setPassword] = useState('')
  
  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 6) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    return score
  }
  
  const passwordStrength = getPasswordStrength(password)
  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
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
    try {
      console.log('🚀 FORM SUBMITTED!')
      console.log('Form values:', values)
      console.log('Selected role:', selectedRole)
      
      // Clean up the data before sending
      const cleanValues = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        contactNumber: values.contactNumber.trim(),
        deliveryAddress: values.deliveryAddress?.trim() || '',
        businessAddress: values.businessAddress?.trim() || '',
        cnicNumber: values.cnicNumber?.trim() || '',
        bankAccountNumber: values.bankAccountNumber?.trim() || '',
        bankName: values.bankName?.trim() || ''
      }
      
      console.log('Cleaned values:', cleanValues)
      
      const res = await dispatch(registerUser(cleanValues))
      console.log('Registration response:', res)
      
      if ((res as any).meta.requestStatus === 'fulfilled') {
        const user = (res as any).payload
        console.log('Registration successful, user:', user)
        
        toast.success(`Registration successful! Welcome to KickSpot, ${user.name}!`, {
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
        
        // Redirect based on user role
        console.log('Registration successful, redirecting based on role:', user.role)
        if (user.role === 'seller') {
          navigate('/admin') // Redirect sellers to admin dashboard
        } else {
          navigate('/') // Redirect buyers to homepage
        }
      } else {
        const error = (res as any).payload || (res as any).error?.message || 'Registration failed'
        console.error('Registration failed:', error)
        
        // Handle specific error messages
        let errorMessage = 'Registration failed. Please try again.'
        if (error.includes('email')) {
          errorMessage = 'This email is already registered. Please use a different email.'
        } else if (error.includes('password')) {
          errorMessage = 'Password does not meet requirements.'
        } else if (error.includes('validation')) {
          errorMessage = 'Please check all fields and try again.'
        } else if (error.includes('network') || error.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
        
        toast.error(errorMessage, {
          style: {
            background: '#ef4444',
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
    } catch (error) {
      console.error('Unexpected error during registration:', error)
      toast.error('An unexpected error occurred. Please try again.', {
        style: {
          background: '#ef4444',
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
              KICKSPOT
            </h1>
          
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
                    <FormControl>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedRole(value as 'buyer' | 'seller')
                      }} defaultValue={field.value}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-white/50 h-10">
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="buyer" className="text-white hover:bg-gray-700">Customer (Buyer)</SelectItem>
                          <SelectItem value="seller" className="text-white hover:bg-gray-700">Seller</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                              placeholder="e.g., John Doe" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={50}
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
                              placeholder="john.doe@example.com" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={100}
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
                              maxLength={15}
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
                              placeholder="Password123" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e)
                                setPassword(e.target.value)
                              }}
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={50}
                            />
                          </FormControl>
                          <div className="mt-1 min-h-[20px]">
                            {password && (
                              <div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`h-1 w-full rounded ${
                                        level <= passwordStrength 
                                          ? getStrengthColor(passwordStrength)
                                          : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-300 mt-1">
                                  Password strength: {
                                    passwordStrength <= 2 ? 'Weak' :
                                    passwordStrength <= 3 ? 'Medium' : 'Strong'
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <FormField name="deliveryAddress" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium text-sm">Delivery Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="House 123, Street 45, City, Country" 
                            {...field} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                            maxLength={200}
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
                      <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., John Doe" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={50}
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
                              placeholder="john.doe@example.com" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="password" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Password123" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e)
                                setPassword(e.target.value)
                              }}
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={50}
                            />
                          </FormControl>
                          <div className="mt-1 min-h-[20px]">
                            {password && (
                              <div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`h-1 w-full rounded ${
                                        level <= passwordStrength 
                                          ? getStrengthColor(passwordStrength)
                                          : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-300 mt-1">
                                  Password strength: {
                                    passwordStrength <= 2 ? 'Weak' :
                                    passwordStrength <= 3 ? 'Medium' : 'Strong'
                                  }
                                </p>
                              </div>
                            )}
                          </div>
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
                              maxLength={15}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="businessAddress" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Business Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Shop 123, Mall Road, City" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={200}
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
                              maxLength={15}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="bankAccountNumber" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium text-sm">Account Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1234567890123456" 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={20}
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
                              placeholder="HBL, MCB, UBL, etc." 
                              {...field} 
                              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white/50 h-10"
                              maxLength={50}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )} />
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
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 text-base rounded-lg transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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


