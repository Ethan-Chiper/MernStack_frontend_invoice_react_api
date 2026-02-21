import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProductDashboard.css";

export default function ProductDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      name: "Greenout Superfruit Supplements",
      category: "Supplements",
      price: 23.99,
      stock: 120,
      status: "In Stock",
      sales: 267,
      published: "Published"
    },
    {
      id: 2,
      name: "Herbal Tea Beverage",
      category: "Beverage",
      price: 15.49,
      stock: 85,
      status: "In Stock",
      sales: 184,
      published: "Published"
    },
    {
      id: 3,
      name: "Glow + True Skincare",
      category: "Skincare",
      price: 34.99,
      stock: 60,
      status: "Out of Stock",
      sales: 92,
      published: "Draft"
    },
    {
      id: 4,
      name: "Detox Soft Gel Supplements",
      category: "Supplements",
      price: 19.99,
      stock: 95,
      status: "Low Stock",
      sales: 215,
      published: "Inactive"
    },
    {
      id: 5,
      name: "Organic Juice Beverage",
      category: "Beverage",
      price: 12.50,
      stock: 200,
      status: "In Stock",
      sales: 350,
      published: "Published"
    },
    {
      id: 6,
      name: "Face Care Kit Skincare",
      category: "Skincare",
      price: 45.00,
      stock: 75,
      status: "In Stock",
      sales: 142,
      published: "Published"
    },
    {
      id: 7,
      name: "Protein Mix Supplements",
      category: "Supplements",
      price: 29.99,
      stock: 110,
      status: "Low Stock",
      sales: 178,
      published: "Inactive"
    },
    {
      id: 8,
      name: "Herbal Capsule Supplements",
      category: "Supplements",
      price: 18.75,
      stock: 140,
      status: "In Stock",
      sales: 305,
      published: "Published"
    }
  ];

  const handleAddProduct = () => {
    toast.info("Add Product functionality");
  };

  const handleListProducts = () => {
    toast.info("List Products functionality");
  };

  const handleViewDetails = (productId) => {
    toast.info(`Viewing details for product ID: ${productId}`);
  };

  const handleUpdateProduct = (productId) => {
    toast.info(`Update product ID: ${productId}`);
  };

  const handleDeleteProduct = (productId) => {
    toast.warning(`Delete product ID: ${productId}`);
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "In Stock": return "status-instock";
      case "Out of Stock": return "status-outofstock";
      case "Low Stock": return "status-lowstock";
      default: return "status-inactive";
    }
  };

  const getPublishedClass = (published) => {
    switch(published) {
      case "Published": return "published-badge";
      case "Draft": return "draft-badge";
      default: return "inactive-badge";
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Flora Sales</h2>
            <p>Management Dashboard</p>
          </div>

          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="nav-menu">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>
            <li className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </li>
            <li className={`nav-item ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
              <i className="fas fa-store"></i>
              <span>My Store</span>
            </li>
            <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <i className="fas fa-box"></i>
              <span>Products</span>
            </li>
            <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <i className="fas fa-shopping-cart"></i>
              <span>Orders</span>
            </li>
            <li className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
              <i className="fas fa-warehouse"></i>
              <span>Inventory</span>
            </li>
            <li className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-title">
              <h1>Products Dashboard</h1>
              <p>Manage your products and inventory</p>
            </div>
            <div className="header-actions">
              <div className="notification-icon">
                <i className="fas fa-bell"></i>
                <span className="badge">3</span>
              </div>
              <div className="user-profile" onClick={handleLogout}>
                <i className="fas fa-user-circle"></i>
                <span>Admin User</span>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleAddProduct}>
              <i className="fas fa-plus"></i> Add Product
            </button>
            <button className="btn btn-secondary" onClick={handleListProducts}>
              <i className="fas fa-list"></i> List Products
            </button>
            <button className="btn btn-info" onClick={() => handleViewDetails(1)}>
              <i className="fas fa-eye"></i> Details
            </button>
            <button className="btn btn-warning" onClick={() => handleUpdateProduct(1)}>
              <i className="fas fa-edit"></i> Update
            </button>
            <button className="btn btn-danger" onClick={() => handleDeleteProduct(1)}>
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>

          {/* Products List Section */}
          <div className="products-section">
            <div className="section-header">
              <h2>Products List</h2>
              <div className="filter-options">
                <select className="filter-select">
                  <option>All Categories</option>
                  <option>Supplements</option>
                  <option>Beverage</option>
                  <option>Skincare</option>
                </select>
                <select className="filter-select">
                  <option>All Status</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Sales</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="product-name">{product.name}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>{product.sales}</td>
                      <td>
                        <div className="action-icons">
                          <div className="action-icon view" title="View Details" onClick={() => handleViewDetails(product.id)}>
                            <i className="fas fa-eye"></i>
                          </div>
                          <div className="action-icon edit" title="Edit Product" onClick={() => handleUpdateProduct(product.id)}>
                            <i className="fas fa-edit"></i>
                          </div>
                          <div className="action-icon delete" title="Delete Product" onClick={() => handleDeleteProduct(product.id)}>
                            <i className="fas fa-trash"></i>
                          </div>
                          <div className={`action-icon ${getPublishedClass(product.published).replace('-badge', '')}`} title={product.published}>
                            <i className="fas fa-check-circle"></i>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Showing: 1-8 of 100
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">4</button>
                <button className="pagination-btn">5</button>
                <button className="pagination-btn">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}