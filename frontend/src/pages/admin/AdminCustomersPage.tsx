import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Eye, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Users,
  UserCheck,
  UserX
} from 'lucide-react'

type Customer = { 
  id: number; 
  name: string; 
  email: string; 
  role: string;
  contactNumber?: string;
  deliveryAddress?: string;
  businessAddress?: string;
  cnicNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  created_at?: string;
  orderCount?: number;
  totalSpent?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get<Customer[]>('/api/v1/admin/buyers')
        setCustomers(res.data)
        setFilteredCustomers(res.data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter customers based on search term and role
  useEffect(() => {
    let filtered = customers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.id.toString().includes(searchTerm) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactNumber?.includes(searchTerm)
      )
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(customer => customer.role === roleFilter)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, roleFilter])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user': return <UserCheck className="h-4 w-4" />
      case 'admin': return <UserX className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Customer Management</h1>
          <p className="text-slate-600 text-lg">Manage your customers and view their information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <span className="ml-2 text-slate-600">Loading customers...</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
              <p className="text-xs text-slate-500">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Buyers</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.role === 'user').length}
              </div>
              <p className="text-xs text-slate-500">Regular customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Sellers</CardTitle>
              <UserX className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.role === 'admin').length}
              </div>
              <p className="text-xs text-slate-500">Admin users</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search customers by name, email, or contact number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Buyers</SelectItem>
                    <SelectItem value="admin">Sellers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers ({filteredCustomers.length})
            </CardTitle>
            <CardDescription>
              {searchTerm || roleFilter !== 'all' 
                ? `Filtered results from ${customers.length} total customers`
                : 'All registered customers'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div key={customer.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(customer.role)}
                          <span className="font-semibold text-lg">#{customer.id}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{customer.name}</p>
                          <p className="text-sm text-slate-500">{customer.email}</p>
                          {customer.contactNumber && (
                            <p className="text-sm text-slate-500">{customer.contactNumber}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                          {customer.totalSpent && (
                            <p className="font-medium text-green-600">${customer.totalSpent.toFixed(2)}</p>
                          )}
                        </div>
                        
                        <Badge className={getRoleColor(customer.role)}>
                          {customer.role === 'user' ? 'Buyer' : 'Seller'}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomerDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
                  <p className="text-slate-500">
                    {searchTerm || roleFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No customers have registered yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Modal */}
        {showCustomerDetails && selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-slate-900">
                  Customer Details #{selectedCustomer.id}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Complete customer information and profile
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-slate-600">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-sm text-slate-600">{selectedCustomer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(selectedCustomer.role)}>
                        {selectedCustomer.role === 'user' ? 'Buyer' : 'Seller'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {selectedCustomer.contactNumber && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium">Contact Number</p>
                          <p className="text-sm text-slate-600">{selectedCustomer.contactNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {(selectedCustomer.deliveryAddress || selectedCustomer.businessAddress) && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      {selectedCustomer.deliveryAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                          <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-sm text-slate-600">{selectedCustomer.deliveryAddress}</p>
                          </div>
                        </div>
                      )}
                      {selectedCustomer.businessAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                          <div>
                            <p className="font-medium">Business Address</p>
                            <p className="text-sm text-slate-600">{selectedCustomer.businessAddress}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Business Information (for sellers) */}
                {selectedCustomer.role === 'admin' && (selectedCustomer.cnicNumber || selectedCustomer.bankAccountNumber || selectedCustomer.bankName) && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Business Information
                    </h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      {selectedCustomer.cnicNumber && (
                        <div>
                          <p className="font-medium">CNIC Number</p>
                          <p className="text-sm text-slate-600">{selectedCustomer.cnicNumber}</p>
                        </div>
                      )}
                      {selectedCustomer.bankName && (
                        <div>
                          <p className="font-medium">Bank Name</p>
                          <p className="text-sm text-slate-600">{selectedCustomer.bankName}</p>
                        </div>
                      )}
                      {selectedCustomer.bankAccountNumber && (
                        <div>
                          <p className="font-medium">Account Number</p>
                          <p className="text-sm text-slate-600">{selectedCustomer.bankAccountNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Account Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Customer ID:</span> #{selectedCustomer.id}</p>
                    <p><span className="font-medium">Member Since:</span> {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : 'N/A'}</p>
                    {selectedCustomer.orderCount && (
                      <p><span className="font-medium">Total Orders:</span> {selectedCustomer.orderCount}</p>
                    )}
                    {selectedCustomer.totalSpent && (
                      <p><span className="font-medium">Total Spent:</span> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



