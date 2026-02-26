import api from './api';

// Create new customer
// POST /api/customers/create
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers/create', customerData);
    return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Get customer list
// GET /api/customers/list
export const getCustomerList = async (params = {}) => {
  try {
    const response = await api.get('/customers/list', { params });
    return response;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get customer by ID
// GET /api/customers/detail/:customerId
export const getCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/customers/detail/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error);
    throw error;
  }
};

// Update customer
// PUT /api/customers/update
export const updateCustomer = async (customerData) => {
  try {
    const response = await api.put('/customers/update', customerData);
    return response;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// // Update customer status
// // PATCH /api/customers/update-status
// export const updateCustomerStatus = async (statusData) => {
//   try {
//     const response = await api.patch('/customers/update-status', statusData);
//     return response;
//   } catch (error) {
//     console.error('Error updating customer status:', error);
//     throw error;
//   }
// };

// Delete customer
// DELETE /api/customers/delete/:customerId
export const deleteCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/customers/delete/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    throw error;
  }
};