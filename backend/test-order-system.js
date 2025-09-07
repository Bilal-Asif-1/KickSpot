import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let userToken = '';
let adminToken = '';
let testOrderId = '';
let testProductId = '';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name}${message ? ': ' + message : ''}`);
  results.tests.push({ name, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

async function testEndpoint(name, method, url, data = null, headers = {}, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: { 'Content-Type': 'application/json', ...headers },
      ...(data && { data })
    };
    
    const response = await axios(config);
    const success = response.status === expectedStatus;
    logTest(name, success, success ? `Status: ${response.status}` : `Expected ${expectedStatus}, got ${response.status}`);
    return response.data;
  } catch (error) {
    const actualStatus = error.response?.status || 'No response';
    const success = actualStatus === expectedStatus;
    logTest(name, success, `Status: ${actualStatus}${error.response?.data?.message ? ' - ' + error.response.data.message : ''}`);
    return error.response?.data;
  }
}

async function runOrderSystemTests() {
  console.log('🛒 Starting Order Management System Tests...\n');

  // === SETUP: LOGIN AS USER AND ADMIN ===
  console.log('🔧 === SETUP: AUTHENTICATION ===');
  
  // Login as regular user
  const userLoginResult = await testEndpoint('Login as User', 'POST', '/api/auth/login', 
    { email: 'user@example.com', password: 'admin123' });
  if (userLoginResult?.data?.token) {
    userToken = userLoginResult.data.token;
  }

  // Login as admin
  const adminLoginResult = await testEndpoint('Login as Admin', 'POST', '/api/auth/login', 
    { email: 'admin@example.com', password: 'admin123' });
  if (adminLoginResult?.data?.token) {
    adminToken = adminLoginResult.data.token;
  }

  // Get a product to use in orders
  const productsResult = await testEndpoint('Get Products for Testing', 'GET', '/api/products');
  if (productsResult?.data?.products?.length > 0) {
    testProductId = productsResult.data.products[0].id;
  }

  // === USER ORDER OPERATIONS ===
  console.log('\n👤 === USER ORDER OPERATIONS ===');
  
  if (userToken && testProductId) {
    const authHeader = { Authorization: `Bearer ${userToken}` };

    // Test creating an order
    const orderData = {
      items: [
        {
          productId: testProductId,
          quantity: 2,
          size: '10',
          color: 'Black'
        }
      ],
      shippingDetails: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      },
      paymentDetails: {
        method: 'cash_on_delivery'
      },
      orderNotes: 'Please handle with care'
    };

    const createOrderResult = await testEndpoint('Create Order', 'POST', '/api/orders', orderData, authHeader, 201);
    if (createOrderResult?.data?.order?.id) {
      testOrderId = createOrderResult.data.order.id;
    }

    // Test getting user's orders
    await testEndpoint('Get User Orders', 'GET', '/api/orders/my-orders', null, authHeader);

    if (testOrderId) {
      // Test getting specific order
      await testEndpoint('Get Order by ID (User)', 'GET', `/api/orders/${testOrderId}`, null, authHeader);

      // Test order cancellation
      await testEndpoint('Cancel Order (User)', 'PUT', `/api/orders/${testOrderId}/cancel`, null, authHeader);
    }
  }

  // === ADMIN ORDER OPERATIONS ===
  console.log('\n👑 === ADMIN ORDER OPERATIONS ===');
  
  if (adminToken) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };

    // Create another order as user for admin testing
    if (userToken && testProductId) {
      const userAuthHeader = { Authorization: `Bearer ${userToken}` };
      const adminOrderData = {
        items: [
          {
            productId: testProductId,
            quantity: 1,
            size: '9'
          }
        ],
        shippingDetails: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          address: '456 Oak Ave',
          city: 'Another City',
          state: 'NY',
          zip: '54321'
        }
      };

      const adminTestOrderResult = await testEndpoint('Create Order for Admin Testing', 'POST', '/api/orders', adminOrderData, userAuthHeader, 201);
      if (adminTestOrderResult?.data?.order?.id) {
        testOrderId = adminTestOrderResult.data.order.id;
      }
    }

    // Test admin order operations
    await testEndpoint('Get All Orders (Admin)', 'GET', '/api/orders/admin/all', null, authHeader);
    
    await testEndpoint('Get Order Statistics (Admin)', 'GET', '/api/orders/admin/stats', null, authHeader);

    if (testOrderId) {
      await testEndpoint('Get Order Details (Admin)', 'GET', `/api/orders/admin/${testOrderId}/details`, null, authHeader);

      // Update order status
      const statusUpdateData = {
        status: 'confirmed',
        adminNotes: 'Order confirmed and ready for processing',
        trackingNumber: 'TRACK123456',
        estimatedDelivery: '2025-09-14T00:00:00Z'
      };
      await testEndpoint('Update Order Status (Admin)', 'PUT', `/api/orders/admin/${testOrderId}/status`, statusUpdateData, authHeader);
      
      // Update to shipped
      await testEndpoint('Update Order to Shipped (Admin)', 'PUT', `/api/orders/admin/${testOrderId}/status`, 
        { status: 'shipped', adminNotes: 'Order has been shipped' }, authHeader);
    }
  }

  // === AUTHORIZATION TESTS ===
  console.log('\n🔒 === AUTHORIZATION TESTS ===');
  
  // Test unauthorized access
  await testEndpoint('Unauthorized Order Creation', 'POST', '/api/orders', 
    { items: [{ productId: testProductId, quantity: 1 }] }, {}, 401);

  // Test user accessing admin endpoints
  if (userToken) {
    const userAuthHeader = { Authorization: `Bearer ${userToken}` };
    await testEndpoint('User Access Admin Orders', 'GET', '/api/orders/admin/all', null, userAuthHeader, 403);
    await testEndpoint('User Access Order Stats', 'GET', '/api/orders/admin/stats', null, userAuthHeader, 403);
  }

  // === VALIDATION TESTS ===
  console.log('\n✅ === VALIDATION TESTS ===');
  
  if (userToken) {
    const authHeader = { Authorization: `Bearer ${userToken}` };

    // Test invalid order data
    await testEndpoint('Invalid Order - No Items', 'POST', '/api/orders', 
      { items: [], shippingDetails: { name: 'Test' } }, authHeader, 400);

    await testEndpoint('Invalid Order - Missing Shipping Details', 'POST', '/api/orders', 
      { items: [{ productId: testProductId, quantity: 1 }] }, authHeader, 400);

    await testEndpoint('Invalid Order - Invalid Product ID', 'POST', '/api/orders', 
      { 
        items: [{ productId: 99999, quantity: 1 }],
        shippingDetails: {
          name: 'Test User',
          email: 'test@example.com',
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345'
        }
      }, authHeader, 400);
  }

  // Test admin validation
  if (adminToken && testOrderId) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    
    await testEndpoint('Invalid Status Update', 'PUT', `/api/orders/admin/${testOrderId}/status`, 
      { status: 'invalid_status' }, authHeader, 400);
  }

  // === RESULTS SUMMARY ===
  console.log('\n📊 ===============================');
  console.log('📊 ORDER SYSTEM TEST RESULTS');
  console.log('📊 ===============================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.tests.filter(t => !t.passed).forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
  } else {
    console.log('\n🎉 ALL ORDER SYSTEM TESTS PASSED! 🎉');
  }

  // Test summary by category
  const categories = {
    'Setup': results.tests.filter(t => t.name.includes('Login') || t.name.includes('Get Products')),
    'User Orders': results.tests.filter(t => t.name.includes('Create Order') && !t.name.includes('Admin') || t.name.includes('Get User') || t.name.includes('Cancel Order (User)')),
    'Admin Orders': results.tests.filter(t => t.name.includes('Admin') || t.name.includes('Statistics') || t.name.includes('Update Order')),
    'Authorization': results.tests.filter(t => t.name.includes('Unauthorized') || t.name.includes('User Access')),
    'Validation': results.tests.filter(t => t.name.includes('Invalid'))
  };

  console.log('\n📋 TEST BREAKDOWN BY CATEGORY:');
  Object.entries(categories).forEach(([category, tests]) => {
    const passed = tests.filter(t => t.passed).length;
    const total = tests.length;
    const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
    console.log(`  ${category}: ${passed}/${total} (${percentage}%)`);
  });

  console.log('\n🛒 Order Management System is ready for frontend integration!');

  process.exit(0);
}

runOrderSystemTests().catch(console.error);
