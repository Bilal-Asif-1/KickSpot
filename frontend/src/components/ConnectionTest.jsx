import React, { useState, useEffect } from 'react';
import { productService, authService } from '../services';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState({
    apiStatus: 'Testing...',
    products: [],
    error: null,
    loading: true
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test API health
      const response = await fetch('http://localhost:5000/health');
      const healthData = await response.json();
      
      if (healthData.success) {
        // Test products endpoint
        const productsData = await productService.getAllProducts();
        
        setTestResults({
          apiStatus: 'Connected Successfully!',
          products: productsData.products || [],
          error: null,
          loading: false
        });
      } else {
        throw new Error('API health check failed');
      }
    } catch (error) {
      setTestResults({
        apiStatus: 'Connection Failed',
        products: [],
        error: error.message,
        loading: false
      });
    }
  };

  if (testResults.loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Testing Backend Connection...</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Connecting to: http://localhost:5000
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px' }}>
      <h3>Backend Connection Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Status: </strong>
        <span style={{ 
          color: testResults.apiStatus === 'Connected Successfully!' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {testResults.apiStatus}
        </span>
      </div>

      {testResults.error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          <strong>Error: </strong> {testResults.error}
        </div>
      )}

      {testResults.products.length > 0 && (
        <div>
          <strong>Products Found: </strong> {testResults.products.length} items
          <ul style={{ marginTop: '10px' }}>
            {testResults.products.slice(0, 3).map(product => (
              <li key={product.id}>{product.name} - ${product.price}</li>
            ))}
            {testResults.products.length > 3 && (
              <li>... and {testResults.products.length - 3} more</li>
            )}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        Backend: http://localhost:5000 | Frontend: http://localhost:5173
      </div>
    </div>
  );
};

export default ConnectionTest;