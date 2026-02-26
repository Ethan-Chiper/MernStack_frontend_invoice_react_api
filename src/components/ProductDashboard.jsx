import React, { Component } from "react";
import "../styles/ProductDashboard.css";
import {
  getProductList,
  getProductById,
  updateProductStatus
} from "../services/productService";

class ProductDashboard extends Component {
  state = {
    activeMenu: "Product",
    // Filter states
    filters: {
      fromDate: "",
      toDate: "",
      productName: "",
      status: "",
      taxRate: "",
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: ""
    },
    products: [],
    filteredProducts: [],
    taxRates: [],
    statuses: [],
    showFilters: false,
    loading: false,
    error: null,
    updatingStatus: false,
    updatingProductId: null,
    viewLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  };

  componentDidMount() {
    this.fetchProducts();
  }

  // Fetch products from backend - SHOW ALL PRODUCTS (active AND inactive)
  fetchProducts = async () => {
    this.setState({ loading: true, error: null });
    try {
      // Build params object with only valid values
      const params = {
        page: this.state.pagination.page,
        limit: this.state.pagination.limit,
      };
      
      // Only add search if it has value
      if (this.state.filters.productName) {
        params.search = this.state.filters.productName;
      }
      
      console.log("Fetching with params:", params);
      
      const response = await getProductList(params);
      console.log("API Response:", response);

      // Extract data based on your backend response structure
      const responseData = response.data;
      
      if (responseData.error === false) {
        const productsData = responseData.data?.products || responseData.data || [];
        const paginationData = responseData.data?.pagination || {
          page: params.page,
          limit: params.limit,
          total: productsData.length,
          pages: Math.ceil(productsData.length / params.limit)
        };
        
        // Extract unique tax rates and statuses
        const taxRates = [...new Set(productsData.map(p => p.tax_rate).filter(Boolean))];
        const statuses = [...new Set(productsData.map(p => p.status).filter(Boolean))];
        
        console.log(`Fetched ${productsData.length} products (including inactive)`);
        console.log("Statuses found:", statuses);
        
        this.setState({
          products: productsData,
          filteredProducts: productsData,
          taxRates,
          statuses,
          pagination: paginationData,
          loading: false
        });
      } else {
        this.setState({
          loading: false,
          error: responseData.message || "Failed to fetch products"
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      
      // Get error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.msg || 
                          "Failed to fetch products. Please try again.";
      
      this.setState({
        loading: false,
        error: errorMessage
      });
    }
  };

  // Handle filter input changes
  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [name]: value
      }
    }), () => {
      this.applyFilters();
    });
  };

  // Clear all filters
  clearFilters = () => {
    this.setState({
      filters: {
        fromDate: "",
        toDate: "",
        productName: "",
        status: "",
        taxRate: "",
        minPrice: "",
        maxPrice: "",
        minStock: "",
        maxStock: ""
      },
      pagination: {
        ...this.state.pagination,
        page: 1
      }
    }, () => {
      this.fetchProducts();
    });
  };

  // Toggle filter section
  toggleFilters = () => {
    this.setState(prevState => ({
      showFilters: !prevState.showFilters
    }));
  };

  // Apply all filters (client-side filtering)
  applyFilters = () => {
    const { products, filters } = this.state;
    
    let filtered = [...products];

    // Filter by Date Range (From Date - To Date)
    if (filters.fromDate || filters.toDate) {
      filtered = filtered.filter(p => {
        if (!p.createdAt && !p.created_at) return true;
        
        const productDate = new Date(p.createdAt || p.created_at);
        productDate.setHours(0, 0, 0, 0);
        
        let isValid = true;
        
        if (filters.fromDate) {
          const fromDate = new Date(filters.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          isValid = isValid && productDate >= fromDate;
        }
        
        if (filters.toDate) {
          const toDate = new Date(filters.toDate);
          toDate.setHours(23, 59, 59, 999);
          isValid = isValid && productDate <= toDate;
        }
        
        return isValid;
      });
    }

    // Filter by Product Name
    if (filters.productName) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(filters.productName.toLowerCase())
      );
    }

    // Filter by Status (client-side filtering)
    if (filters.status) {
      filtered = filtered.filter(p =>
        p.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filter by Tax Rate
    if (filters.taxRate) {
      filtered = filtered.filter(p =>
        parseFloat(p.tax_rate) === parseFloat(filters.taxRate)
      );
    }

    // Filter by Price Range
    if (filters.minPrice) {
      filtered = filtered.filter(p => 
        parseFloat(p.price) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => 
        parseFloat(p.price) <= parseFloat(filters.maxPrice)
      );
    }

    // Filter by Stock Range
    if (filters.minStock) {
      filtered = filtered.filter(p => 
        parseInt(p.stock_quantity || p.stock) >= parseInt(filters.minStock)
      );
    }
    if (filters.maxStock) {
      filtered = filtered.filter(p => 
        parseInt(p.stock_quantity || p.stock) <= parseInt(filters.maxStock)
      );
    }

    this.setState({ filteredProducts: filtered });
  };

  // Handle page change
  handlePageChange = (newPage) => {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        page: newPage
      }
    }), () => {
      this.fetchProducts();
    });
  };

  // Update product status
  updateProductStatus = async (product, newStatus) => {
    try {
      // Get product ID from the product object
      const productId = product.product_id || product._id || product.id;
      
      if (!productId) {
        alert("Product ID not found");
        return;
      }
      
      // Set updating state for this specific product
      this.setState({ 
        updatingStatus: true,
        updatingProductId: productId 
      });
      
      console.log(`Updating product ${productId} status from ${product.status} to ${newStatus}`);
      
      // Update status via API
      const response = await updateProductStatus({
        product_id: productId,
        status: newStatus
      });
      
      console.log("Update Status Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        // Update the local state immediately for better UX
        const updatedProducts = this.state.products.map(p => {
          const pId = p.product_id || p._id || p.id;
          if (pId === productId) {
            return { ...p, status: newStatus };
          }
          return p;
        });
        
        // Also update filtered products
        const updatedFilteredProducts = this.state.filteredProducts.map(p => {
          const pId = p.product_id || p._id || p.id;
          if (pId === productId) {
            return { ...p, status: newStatus };
          }
          return p;
        });
        
        this.setState({
          products: updatedProducts,
          filteredProducts: updatedFilteredProducts,
          updatingStatus: false,
          updatingProductId: null
        });
        
        console.log(`Product ${productId} status updated to ${newStatus} successfully`);
      } else {
        alert(responseData.message || "Failed to update product status");
        this.setState({ 
          updatingStatus: false,
          updatingProductId: null 
        });
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      alert(error.response?.data?.message || "Failed to update product status");
      this.setState({ 
        updatingStatus: false,
        updatingProductId: null 
      });
    }
  };

  // View product - Fetch details from API and navigate
viewProduct = async (product) => {
  try {
    this.setState({ viewLoading: true });
    
    // Get product ID from the product object
    const productId = product.product_id || product._id || product.id;
    
    if (!productId) {
      alert("Product ID not found");
      this.setState({ viewLoading: false });
      return;
    }
    
    console.log(`Fetching details for product ID: ${productId}`);
    
    // Fetch product details from API using the ID
    const response = await getProductById(productId);
    console.log("Product Details API Response:", response);
    
    const responseData = response.data;
    
    if (responseData.error === false) {
      // Get the product data from response
      const productData = responseData.data || responseData;
      
      console.log("Product data to display:", productData);
      
      // Navigate to product details page with the full product data
      // Using "productDetails" as per your App.js
      this.props.navigate("productDetails", productData);
    } else {
      alert(responseData.message || "Failed to fetch product details");
    }
    
    this.setState({ viewLoading: false });
  } catch (error) {
    console.error("Error fetching product details:", error);
    alert(error.response?.data?.message || "Failed to fetch product details");
    this.setState({ viewLoading: false });
  }
};

  // OPEN ADD PRODUCT PAGE
  openAddProduct = () => {
    this.props.navigate("productCreate");
  };

  // open customer
  openCustomer = () => {
    this.props.navigate("customerCreate");
  };

  // back to login
  goBack = () => {
    this.props.navigate("login");
  };

  // sidebar highlight only
setMenu = (menu) => {
  this.setState({ activeMenu: menu });
  
  // Navigate based on menu item
  switch(menu) {
    case "Home":
      this.props.navigate("dashboard");
      break;
    case "Product":
      // Already on Product page
      break;
    case "Inventory":
      // Navigate to Invoice page when Inventory is clicked
      console.log("Navigating to Invoice page");
      
      // You can pass product data if needed
      const invoiceData = {
        // Add any data you want to pass to the invoice
        items: this.state.products || [],
        customer: {
          name: "Walk-in Customer",
          address: "Store Address"
        },
        date: new Date()
      };
      
      this.props.navigate("invoice", { 
        invoiceData: invoiceData 
      });
      break;
    case "Customer":
      this.props.navigate("customerList");
      break;
    default:
      break;
  }
};

  // search
  handleSearch = (e) => {
    const value = e.target.value;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        productName: value
      },
      pagination: {
        ...prevState.pagination,
        page: 1
      }
    }), () => {
      this.fetchProducts();
    });
  };

  // Render filter section
  renderFilters() {
    const { filters, showFilters, taxRates, statuses } = this.state;

    return (
      <div className="filters-container">
        <div className="filters-header">
          <h3>Filter Products</h3>
          <button className="toggle-filters-btn" onClick={this.toggleFilters}>
            {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filters-section">
            <div className="filters-grid">
              {/* From Date Filter */}
              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={this.handleFilterChange}
                  max={filters.toDate || undefined}
                />
              </div>

              {/* To Date Filter */}
              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={this.handleFilterChange}
                  min={filters.fromDate || undefined}
                />
              </div>

              {/* Product Name Filter */}
              <div className="filter-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={filters.productName}
                  onChange={this.handleFilterChange}
                  placeholder="Search by name..."
                />
              </div>

              {/* Status Filter - Dropdown */}
              <div className="filter-group">
                <label>Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={this.handleFilterChange}
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Tax Rate Filter - Dropdown */}
              <div className="filter-group">
                <label>Tax Rate (%)</label>
                <select
                  name="taxRate"
                  value={filters.taxRate}
                  onChange={this.handleFilterChange}
                >
                  <option value="">All Tax Rates</option>
                  {taxRates.map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>

              {/* Min Price Filter */}
              <div className="filter-group">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={this.handleFilterChange}
                  placeholder="Min price"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Max Price Filter */}
              <div className="filter-group">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={this.handleFilterChange}
                  placeholder="Max price"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Min Stock Filter */}
              <div className="filter-group">
                <label>Min Stock</label>
                <input
                  type="number"
                  name="minStock"
                  value={filters.minStock}
                  onChange={this.handleFilterChange}
                  placeholder="Min stock"
                  min="0"
                />
              </div>

              {/* Max Stock Filter */}
              <div className="filter-group">
                <label>Max Stock</label>
                <input
                  type="number"
                  name="maxStock"
                  value={filters.maxStock}
                  onChange={this.handleFilterChange}
                  placeholder="Max stock"
                  min="0"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={this.clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render pagination
  renderPagination() {
    const { pagination } = this.state;
    const { page, pages } = pagination;

    if (pages <= 1) return null;

    return (
      <div className="pagination">
        <button
          onClick={() => this.handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        
        {[...Array(pages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => this.handlePageChange(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        
        <button
          onClick={() => this.handlePageChange(page + 1)}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
    );
  }

  // Render status toggle buttons
  renderStatusButtons(product) {
    const { updatingStatus, updatingProductId } = this.state;
    const currentStatus = product.status?.toLowerCase();
    const productId = product.product_id || product._id || product.id;
    const isThisProductUpdating = updatingStatus && updatingProductId === productId;
    
    return (
      <div className="status-toggle">
        <button
          className={`status-btn active ${currentStatus === 'active' ? 'selected' : ''}`}
          onClick={() => this.updateProductStatus(product, 'active')}
          disabled={isThisProductUpdating || currentStatus === 'active'}
        >
          {isThisProductUpdating && currentStatus === 'inactive' ? 'Activating...' : 'Active'}
        </button>
        <button
          className={`status-btn inactive ${currentStatus === 'inactive' ? 'selected' : ''}`}
          onClick={() => this.updateProductStatus(product, 'inactive')}
          disabled={isThisProductUpdating || currentStatus === 'inactive'}
        >
          {isThisProductUpdating && currentStatus === 'active' ? 'Deactivating...' : 'Inactive'}
        </button>
      </div>
    );
  }

  // Render products table
  renderProductsTable() {
    const { filteredProducts, filters, loading, error, pagination, updatingStatus, viewLoading } = this.state;

    if (loading) {
      return <div className="loading-spinner">Loading products...</div>;
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={this.fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      );
    }

    // Count active and inactive products
    const activeCount = filteredProducts.filter(p => p.status?.toLowerCase() === 'active').length;
    const inactiveCount = filteredProducts.filter(p => p.status?.toLowerCase() === 'inactive').length;

    return (
      <>
        {/* TOP BAR */}
        <div className="product-top">
          <h2>
            Products {pagination.total > 0 && `(${pagination.total})`}
            {pagination.total > 0 && (
              <span className="status-summary">
                <span className="active-count"> Active: {activeCount}</span>
                <span className="inactive-count"> Inactive: {inactiveCount}</span>
              </span>
            )}
          </h2>

          <div className="search-add-container">
            <input
              className="search-box"
              placeholder="Quick search by name..."
              value={filters.productName}
              onChange={this.handleSearch}
            />

            <button className="add-btn" onClick={this.openAddProduct}>
              + Add Product
            </button>

            <button className="back-btn" onClick={this.goBack}>
              ← Back
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {this.renderFilters()}

        {/* Table */}
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Tax Rate (%)</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    No products found
                  </td>
                </tr>
              )}

              {filteredProducts.map((p) => {
                const productId = p.product_id || p._id || p.id;
                const isInactive = p.status?.toLowerCase() === 'inactive';
                
                return (
                  <tr key={productId} className={isInactive ? 'inactive-row' : ''}>
                    <td>
                      <span className="product-id-badge">{productId}</span>
                    </td>
                    <td>{p.name || p.productName}</td>
                    <td>{p.tax_rate || p.taxRate || 0}%</td>
                    <td>${parseFloat(p.price || 0).toFixed(2)}</td>
                    <td>{p.stock_quantity || p.stock || p.quantity || 0}</td>
                    <td>
                      {this.renderStatusButtons(p)}
                    </td>
                    <td className="action-cell">
                      <button
                        className="view-btn"
                        onClick={() => this.viewProduct(p)}
                        disabled={updatingStatus || viewLoading}
                      >
                        {viewLoading ? 'Loading...' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {this.renderPagination()}
        </div>
      </>
    );
  }

  renderContent() {
    if (this.state.activeMenu === "Product") {
      return this.renderProductsTable();
    }

    return (
      <div className="placeholder">
        <h2>{this.state.activeMenu}</h2>
        <p>Content coming soon...</p>
      </div>
    );
  }

  render() {
    return (
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <h3 className="logo">PRODUCT</h3>

          <div
            className={`menu-item ${
              this.state.activeMenu === "Home" ? "active" : ""
            }`}
            onClick={() => this.setMenu("Home")}
          >
            Home
          </div>

          <div
            className={`menu-item ${
              this.state.activeMenu === "Product" ? "active" : ""
            }`}
            onClick={() => this.setMenu("Product")}
          >
            Product
          </div>

          <div
            className={`menu-item ${
              this.state.activeMenu === "Inventory" ? "active" : ""
            }`}
            onClick={() => this.setMenu("Inventory")}
          >
            Invoice
          </div>

          <div
            className={`menu-item ${
              this.state.activeMenu === "Customer" ? "active" : ""
            }`}
            onClick={this.openCustomer}
          >
            Customer
          </div>
        </div>

        {/* Main */}
        <div className="main-content">{this.renderContent()}</div>
      </div>
    );
  }
}

export default ProductDashboard;