// import api from "./api";

// // // ✅ list
// // export const getProductList = (params) => {
// //   return api.get("/products/list", { params });
// // };

// // // ✅ delete (optional)
// // export const deleteProductApi = (id) => {
// //   return api.delete(`/products/${id}`);
// // };

// export const getProductList = async () => {
//   try {
//     const response = await api.get("/products/list");
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Get single product
// export const getProductById = async (id) => {
//   try {
//     const response = await api.get(`/products/${id}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Create product
// export const createProduct = async (productData) => {
//   try {
//     const response = await api.post("/products/create", productData);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Update product
// export const updateProduct = async (id, productData) => {
//   try {
//     const response = await api.put(`/products/${id}`, productData);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Delete product
// export const deleteProduct = async (id) => {
//   try {
//     const response = await api.delete(`/products/${id}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

import api from './api';

// Get product list with filters
// GET /api/products/list?page=1&limit=10&search=fertilizer&status=active
export const getProductList = async (params = {}) => {
  try {
    const response = await api.get('/products/list', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single product details
// GET /api/products/detail/:productId
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/detail/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Create new product
// POST /api/products/create
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products/create', productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update product
// PUT /api/products/update
export const updateProduct = async (productData) => {
  try {
    const response = await api.put('/products/update', productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update product status
// PATCH /api/products/update-status
export const updateProductStatus = async (statusData) => {
  try {
    const response = await api.patch('/products/update-status', statusData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete product
// DELETE /api/products/delete/:productId
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/delete/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};