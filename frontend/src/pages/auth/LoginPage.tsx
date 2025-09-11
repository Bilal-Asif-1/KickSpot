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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useAppSelector(s => s.auth)
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

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
      if (user.role === 'admin') {
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
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </Form>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  )
}


