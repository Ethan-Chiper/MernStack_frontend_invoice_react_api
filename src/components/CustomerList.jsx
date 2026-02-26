// import React, { Component } from "react";
// import "../styles/CustomerList.css";

// class CustomerList extends Component {
//   state = {
//     search: "",
//     customers: [
//       {
//         id: 1,
//         name: "Adam Smith",
//         email: "adam@example.com",
//         mobile: "9012233111",
//         pincode: "12345",
//         city: "Chennai",
//         stateName: "TN",
//         country: "India",
//       },
//     ],
//   };

//   // 🔹 search
//   handleSearch = (e) => {
//     this.setState({ search: e.target.value });
//   };

//   // 🔹 view profile
//   viewCustomer = (cust) => {
//     this.props.navigate("customerProfile", cust);
//   };

//   // 🔹 back
//   goBack = () => {
//     this.props.navigate("dashboard");
//   };

//   getFiltered() {
//     const { customers, search } = this.state;
//     return customers.filter((c) =>
//       c.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }

//   render() {
//     const data = this.getFiltered();

//     return (
//       <div className="cl-wrapper">
//         {/* top bar */}
//         <div className="cl-topbar">
//           <h2>CUSTOMER</h2>
          
//           <button className="back-btn" onClick={this.goBack}>
//             ← Back
//           </button>
//         </div>

//         <div className="cl-container">
//           <h2 className="cl-title">Customers</h2>

//           {/* search */}
//           <div className="cl-search-row">
//             <input
//               placeholder="Name"
//               value={this.state.search}
//               onChange={this.handleSearch}
//             />
//             <button className="search-btn">Search</button>
//           </div>

//           {/* table */}
//           <div className="cl-table-card">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Mobile No</th>
//                   <th>Pincode</th>
//                   <th>City</th>
//                   <th>State</th>
//                   <th>Country</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {data.map((c) => (
//                   <tr key={c.id}>
//                     <td>{c.id}</td>
//                     <td>{c.name}</td>
//                     <td>{c.email}</td>
//                     <td>{c.mobile}</td>
//                     <td>{c.pincode}</td>
//                     <td>{c.city}</td>
//                     <td>{c.stateName}</td>
//                     <td>{c.country}</td>
//                     <td>
//                       <button
//                         className="view-btn"
//                         onClick={() => this.viewCustomer(c)}
//                       >
//                         🔍 View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default CustomerList;

import React, { Component } from "react";
import "../styles/CustomerList.css";
import { getCustomerList, getCustomerById } from "../services/customerService";

class CustomerList extends Component {
  state = {
    search: "",
    customers: [],
    filteredCustomers: [],
    loading: false,
    error: null,
    viewLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  };

  componentDidMount() {
    this.fetchCustomers();
    
    // Check if new customer data was passed from create page
    if (this.props.customer) {
      console.log("New customer data received:", this.props.customer);
      // The list will be refreshed by fetchCustomers anyway
    }
  }

  // Fetch customers from backend
  fetchCustomers = async () => {
    this.setState({ loading: true, error: null });
    try {
      const params = {
        page: this.state.pagination.page,
        limit: this.state.pagination.limit,
        search: this.state.search || undefined
      };

      console.log("Fetching customers with params:", params);
      
      const response = await getCustomerList(params);
      console.log("Customer List Response:", response);

      const responseData = response.data;
      
      if (responseData.error === false) {
        const customersData = responseData.data?.customers || responseData.data || [];
        const paginationData = responseData.data?.pagination || {
          page: params.page,
          limit: params.limit,
          total: customersData.length,
          pages: Math.ceil(customersData.length / params.limit)
        };
        
        this.setState({
          customers: customersData,
          filteredCustomers: customersData,
          pagination: paginationData,
          loading: false
        });
      } else {
        this.setState({
          loading: false,
          error: responseData.message || "Failed to fetch customers"
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.msg || 
                          "Failed to fetch customers. Please try again.";
      
      this.setState({
        loading: false,
        error: errorMessage
      });
    }
  };

  // Handle search
  handleSearch = (e) => {
    const value = e.target.value;
    this.setState({ search: value }, () => {
      // Apply client-side filtering
      this.applySearchFilter();
    });
  };

  // Apply search filter
  applySearchFilter = () => {
    const { customers, search } = this.state;
    
    if (!search.trim()) {
      this.setState({ filteredCustomers: customers });
      return;
    }

    const filtered = customers.filter(c => 
      (c.name?.full?.toLowerCase().includes(search.toLowerCase())) ||
      (c.email?.toLowerCase().includes(search.toLowerCase())) ||
      (c.mobile?.national_number?.includes(search))
    );
    
    this.setState({ filteredCustomers: filtered });
  };

  // Trigger search with button
  handleSearchClick = () => {
    this.applySearchFilter();
  };

  // View customer details - Fetch from API and navigate
  viewCustomer = async (customer) => {
    try {
      this.setState({ viewLoading: true });
      
      // Get customer ID from the customer object
      const customerId = customer.customer_id || customer._id || customer.id;
      
      if (!customerId) {
        alert("Customer ID not found");
        this.setState({ viewLoading: false });
        return;
      }
      
      console.log(`Fetching details for customer ID: ${customerId}`);
      
      // Fetch customer details from API
      const response = await getCustomerById(customerId);
      console.log("Customer Details Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        const customerData = responseData.data || responseData;
        
        // Navigate to customer profile with full customer data
        this.props.navigate("customerProfile", customerData);
      } else {
        alert(responseData.message || "Failed to fetch customer details");
      }
      
      this.setState({ viewLoading: false });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      alert(error.response?.data?.message || "Failed to fetch customer details");
      this.setState({ viewLoading: false });
    }
  };

  // Handle page change
  handlePageChange = (newPage) => {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        page: newPage
      }
    }), () => {
      this.fetchCustomers();
    });
  };

  // Back button
  goBack = () => {
    this.props.navigate("dashboard");
  };

  // Format customer data for display
  formatCustomerData = (customer) => {
    return {
      id: customer.customer_id || customer._id || customer.id || 'N/A',
      name: customer.name?.full || customer.name || 'N/A',
      email: customer.email || 'N/A',
      mobile: customer.mobile?.national_number || customer.mobile || 'N/A',
      countryCode: customer.mobile?.country_code || '+91',
      address: customer.address || {},
      city: customer.address?.city || customer.city || 'N/A',
      state: customer.address?.state || customer.stateName || customer.state || 'N/A',
      zipcode: customer.address?.zipcode || customer.pincode || 'N/A',
      country: customer.address?.country || customer.country || 'India',
      gst: customer.gst_number || 'N/A'
    };
  };

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

  render() {
    const { filteredCustomers, search, loading, error, viewLoading, pagination } = this.state;

    if (loading) {
      return <div className="loading-spinner">Loading customers...</div>;
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={this.fetchCustomers} className="retry-btn">
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="cl-wrapper">
        {/* top bar */}
        <div className="cl-topbar">
          <h2>CUSTOMER MANAGEMENT</h2>
          <button className="back-btn" onClick={this.goBack}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="cl-container">
          <div className="cl-header">
            <h2 className="cl-title">Customers List</h2>
            <span className="total-count">Total: {pagination.total}</span>
          </div>

          {/* search */}
          <div className="cl-search-row">
            <input
              placeholder="Search by name, email or mobile..."
              value={search}
              onChange={this.handleSearch}
              onKeyPress={(e) => e.key === 'Enter' && this.handleSearchClick()}
            />
            <button className="search-btn" onClick={this.handleSearchClick}>
              Search
            </button>
          </div>

          {/* table */}
          <div className="cl-table-card">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile No</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", padding: "30px" }}>
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => {
                    const formatted = this.formatCustomerData(customer);
                    const serialNo = ((pagination.page - 1) * pagination.limit) + index + 1;
                    
                    return (
                      <tr key={formatted.id}>
                        <td>{serialNo}</td>
                        <td>
                          <span className="customer-id-badge">{formatted.id}</span>
                        </td>
                        <td>{formatted.name}</td>
                        <td>{formatted.email}</td>
                        <td>{formatted.countryCode} {formatted.mobile}</td>
                        <td>{formatted.city}</td>
                        <td>{formatted.state}</td>
                        <td>{formatted.country}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => this.viewCustomer(customer)}
                            disabled={viewLoading}
                          >
                            {viewLoading ? 'Loading...' : '🔍 View'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default CustomerList;