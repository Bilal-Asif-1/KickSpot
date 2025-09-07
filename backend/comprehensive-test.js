import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let userToken = '';
let adminToken = '';
let testUserId = '';
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

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Backend API Tests...\n');

  // === BASIC HEALTH CHECKS ===
  console.log('📋 === BASIC HEALTH CHECKS ===');
  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('API Test Endpoint', 'GET', '/api/test');

  // === AUTHENTICATION TESTS ===
  console.log('\n🔐 === AUTHENTICATION TESTS ===');
  
  // Test user registration
  const userData = {
    name: 'Comprehensive Test User',
    email: 'comprehensive@test.com',
    password: 'test123456'
  };
  const registerResult = await testEndpoint('Register New User', 'POST', '/api/auth/register', userData, {}, 201);
  if (registerResult?.data?.token) {
    userToken = registerResult.data.token;
    testUserId = registerResult.data.user?.id;
  }

  // Test user login
  const loginResult = await testEndpoint('Login User', 'POST', '/api/auth/login', 
    { email: userData.email, password: userData.password });
  if (loginResult?.data?.token) {
    userToken = loginResult.data.token;
  }

  // Test admin login
  const adminLoginResult = await testEndpoint('Login Admin', 'POST', '/api/auth/login', 
    { email: 'admin@example.com', password: 'admin123' });
  if (adminLoginResult?.data?.token) {
    adminToken = adminLoginResult.data.token;
  }

  // Test duplicate registration
  await testEndpoint('Duplicate Email Registration', 'POST', '/api/auth/register', userData, {}, 400);

  // Test invalid login
  await testEndpoint('Invalid Login Credentials', 'POST', '/api/auth/login', 
    { email: 'wrong@email.com', password: 'wrongpassword' }, {}, 401);

  // === PROFILE MANAGEMENT ===
  console.log('\n👤 === PROFILE MANAGEMENT ===');
  
  if (userToken) {
    const authHeader = { Authorization: `Bearer ${userToken}` };
    
    // Get profile
    await testEndpoint('Get User Profile', 'GET', '/api/auth/profile', null, authHeader);
    
    // Update profile
    await testEndpoint('Update Profile', 'PUT', '/api/auth/profile', 
      { name: 'Updated Test User', email: 'updated@test.com' }, authHeader);
    
    // Change password
    await testEndpoint('Change Password', 'PUT', '/api/auth/change-password', 
      { currentPassword: 'test123456', newPassword: 'newpassword123' }, authHeader);
  }

  // === PRODUCT OPERATIONS ===
  console.log('\n🛍️ === PRODUCT OPERATIONS ===');
  
  // Public product endpoints
  await testEndpoint('Get All Products (Public)', 'GET', '/api/products');
  await testEndpoint('Get Products with Pagination', 'GET', '/api/products?page=1&limit=5');
  await testEndpoint('Search Products', 'GET', '/api/products?search=sneaker');
  await testEndpoint('Filter Products by Category', 'GET', '/api/products/category/Sneakers');

  // Admin product creation
  if (adminToken) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    
    const newProduct = {
      name: 'Test Admin Product',
      description: 'This is a test product created by admin',
      price: 150.00,
      category: 'Testing',
      stock: 25
    };
    
    const createResult = await testEndpoint('Create Product (Admin)', 'POST', '/api/products', newProduct, authHeader, 201);
    if (createResult?.data?.product?.id) {
      testProductId = createResult.data.product.id;
    }
  }

  // Protected product endpoints
  if (userToken) {
    const authHeader = { Authorization: `Bearer ${userToken}` };
    
    await testEndpoint('Get User Products', 'GET', '/api/products/user/my-products', null, authHeader);
    
    if (testProductId) {
      await testEndpoint('Get Product by ID', 'GET', `/api/products/${testProductId}`, null, authHeader);
    }
  }

  // Product CRUD operations (Admin only)
  if (adminToken && testProductId) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    
    const updateData = {
      name: 'Updated Test Product',
      price: 175.00,
      stock: 15
    };
    
    await testEndpoint('Update Product (Admin)', 'PUT', `/api/products/${testProductId}`, updateData, authHeader);
    await testEndpoint('Delete Product (Admin)', 'DELETE', `/api/products/${testProductId}`, null, authHeader);
  }

  // === USER MANAGEMENT (ADMIN) ===
  console.log('\n👥 === USER MANAGEMENT (ADMIN) ===');
  
  if (adminToken) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    
    await testEndpoint('Get All Users (Admin)', 'GET', '/api/users', null, authHeader);
    
    if (testUserId) {
      await testEndpoint('Get User by ID (Admin)', 'GET', `/api/users/${testUserId}`, null, authHeader);
      // Don't delete the user as it might break other tests
    }
  }

  // === AUTHORIZATION TESTS ===
  console.log('\n🚫 === AUTHORIZATION TESTS ===');
  
  // Test unauthorized access
  await testEndpoint('Unauthorized Profile Access', 'GET', '/api/auth/profile', null, {}, 401);
  await testEndpoint('Unauthorized User Creation', 'POST', '/api/products', 
    { name: 'Unauthorized Product', price: 99 }, {}, 401);
  
  // Test user trying admin endpoints
  if (userToken) {
    const userHeader = { Authorization: `Bearer ${userToken}` };
    await testEndpoint('User Access Admin Endpoint', 'GET', '/api/users', null, userHeader, 403);
  }

  // === INPUT VALIDATION TESTS ===
  console.log('\n✅ === INPUT VALIDATION TESTS ===');
  
  // Invalid registration data
  await testEndpoint('Invalid Registration - Short Name', 'POST', '/api/auth/register', 
    { name: 'A', email: 'test@test.com', password: 'password123' }, {}, 400);
  
  await testEndpoint('Invalid Registration - Bad Email', 'POST', '/api/auth/register', 
    { name: 'Test User', email: 'invalid-email', password: 'password123' }, {}, 400);
  
  await testEndpoint('Invalid Registration - Short Password', 'POST', '/api/auth/register', 
    { name: 'Test User', email: 'test@test.com', password: '123' }, {}, 400);

  // Invalid product data (if admin token available)
  if (adminToken) {
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    
    await testEndpoint('Invalid Product - Missing Required Fields', 'POST', '/api/products', 
      { name: 'A' }, authHeader, 400);
    
    await testEndpoint('Invalid Product - Negative Price', 'POST', '/api/products', 
      { name: 'Test Product', description: 'Test description', price: -10, category: 'Test' }, authHeader, 400);
  }

  // === RESULTS SUMMARY ===
  console.log('\n📊 ===============================');
  console.log('📊 COMPREHENSIVE TEST RESULTS');
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
    console.log('\n🎉 ALL TESTS PASSED! Backend is fully functional! 🎉');
  }

  // Test summary by category
  const categories = {
    'Health Checks': results.tests.filter(t => t.name.includes('Health') || t.name.includes('API Test')),
    'Authentication': results.tests.filter(t => t.name.includes('Register') || t.name.includes('Login') || t.name.includes('Profile') || t.name.includes('Password')),
    'Products': results.tests.filter(t => t.name.includes('Product') && !t.name.includes('User')),
    'Authorization': results.tests.filter(t => t.name.includes('Unauthorized') || t.name.includes('Access')),
    'Validation': results.tests.filter(t => t.name.includes('Invalid'))
  };

  console.log('\n📋 TEST BREAKDOWN BY CATEGORY:');
  Object.entries(categories).forEach(([category, tests]) => {
    const passed = tests.filter(t => t.passed).length;
    const total = tests.length;
    const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
    console.log(`  ${category}: ${passed}/${total} (${percentage}%)`);
  });

  process.exit(0);
}

runComprehensiveTests().catch(console.error);
