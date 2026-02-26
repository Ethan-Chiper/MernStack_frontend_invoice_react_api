// import React, { Component } from "react";
// import "../styles/Customer.css";

// class CustomerProfile extends Component {
//   handleDelete = () => {
//     if (window.confirm("Delete this customer?")) {
//       alert("Customer deleted (connect API later)");
//       this.props.navigate("dashboard");
//     }
//   };

//   render() {
//     const data = this.props.customer || {};

//     return (
//       <div className="cust-wrapper">
//         {/* Top Bar */}
//         <div className="cust-topbar">
//           <h2>CUSTOMER</h2>
          
//           <button className="back-btn" onClick={this.goBack}>
//             ← Back
//           </button>

//         </div>

//         {/* Card */}
//         <div className="cust-view-card">
//           <h2 className="cust-title-center">Customer</h2>

//           <div className="cust-view-body">
//             <div className="cust-row">
//               <label>name</label>
//               <div className="cust-value">{data.name || "—"}</div>
//             </div>

//             <div className="cust-row">
//               <label>email</label>
//               <div className="cust-value">{data.email || "—"}</div>
//             </div>

//             <div className="cust-row">
//               <label>mobile</label>
//               <div className="cust-value">{data.mobile || "—"}</div>
//             </div>

//             <div className="cust-row grid-2-view">
//               <div>
//                 <label>city</label>
//                 <div className="cust-value">{data.city || "—"}</div>
//               </div>

//               <div>
//                 <label>State</label>
//                 <div className="cust-value">
//                   {data.stateName || "—"}
//                 </div>
//               </div>
//             </div>

//             <div className="cust-row grid-2-view">
//               <div>
//                 <label>Pincode</label>
//                 <div className="cust-value">
//                   {data.pincode || "—"}
//                 </div>
//               </div>

//               <div>
//                 <label>GST</label>
//                 <div className="cust-value">{data.gst || "—"}</div>
//               </div>
//             </div>

//             {/* Delete button */}
//             <div className="cust-delete-wrap">
//               <button
//                 className="cust-delete-btn"
//                 onClick={this.handleDelete}
//               >
//                 Delete
//               </button>

//               <button
//                 className="back-btn"
//                 onClick={() => this.props.navigate("customerList")}
//             >
//                 ← Back
//                 </button>
//             </div>

            
            
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default CustomerProfile;

import React, { Component } from "react";
import "../styles/CustomerProfile.css";
import { getCustomerById, deleteCustomer } from "../services/customerService";

class CustomerProfile extends Component {
  state = {
    customer: null,
    loading: true,
    error: null,
    deleting: false
  };

  async componentDidMount() {
    console.log("CustomerProfile received props:", this.props);
    
    // Check if customer data was passed directly
    if (this.props.customer) {
      console.log("Loading customer from props:", this.props.customer);
      this.setState({
        customer: this.props.customer,
        loading: false
      });
    } 
    // If no customer data in props, try to fetch from API using ID
    else {
      await this.fetchCustomerDetails();
    }
  }

  // Fetch customer details from API
  fetchCustomerDetails = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      // Get customer ID from props
      const customerId = this.props.customerId || this.props.match?.params?.customerId;
      
      if (!customerId) {
        this.setState({
          loading: false,
          error: "Customer ID not found"
        });
        return;
      }
      
      console.log(`Fetching customer details for ID: ${customerId}`);
      
      const response = await getCustomerById(customerId);
      console.log("Customer Details API Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        const customerData = responseData.data || responseData;
        console.log("Customer data from API:", customerData);
        
        this.setState({
          customer: customerData,
          loading: false
        });
      } else {
        this.setState({
          loading: false,
          error: responseData.message || "Failed to fetch customer details"
        });
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      this.setState({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch customer details"
      });
    }
  };

  // Handle delete customer
  handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    
    try {
      this.setState({ deleting: true });
      
      const customerId = this.state.customer?.customer_id || 
                        this.state.customer?._id || 
                        this.state.customer?.id;
      
      if (!customerId) {
        alert("Customer ID not found");
        this.setState({ deleting: false });
        return;
      }
      
      const response = await deleteCustomer(customerId);
      console.log("Delete Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        alert("Customer deleted successfully");
        this.props.navigate("customerList");
      } else {
        alert(responseData.message || "Failed to delete customer");
      }
      
      this.setState({ deleting: false });
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.response?.data?.message || "Failed to delete customer");
      this.setState({ deleting: false });
    }
  };

  // Format customer data for display
  formatCustomerData = () => {
    const { customer } = this.state;
    if (!customer) return {};
    
    return {
      // Customer ID
      customer_id: customer.customer_id || customer._id || customer.id || '—',
      
      // Name handling
      name: customer.name?.full || customer.name || '—',
      
      // Email
      email: customer.email || '—',
      
      // Mobile handling
      mobile_country_code: customer.mobile?.country_code || '+91',
      mobile_number: customer.mobile?.national_number || customer.mobile || '—',
      
      // Address handling
      address_line1: customer.address?.line_1 || customer.addressLine1 || '—',
      address_line2: customer.address?.line_2 || customer.addressLine2 || '',
      city: customer.address?.city || customer.city || '—',
      state: customer.address?.state || customer.stateName || customer.state || '—',
      zipcode: customer.address?.zipcode || customer.pincode || '—',
      country: customer.address?.country || customer.country || 'India',
      
      // GST
      gst_number: customer.gst_number || customer.gst || '—',
      
      // Status
      status: customer.status || 'active'
    };
  };

  // Go back to customer list
  goBack = () => {
    this.props.navigate("customerList");
  };

  render() {
    const { loading, error, deleting } = this.state;
    const data = this.formatCustomerData();

    if (loading) {
      return (
        <div className="cust-wrapper">
          <div className="cust-topbar">
            <h2>CUSTOMER</h2>
            <button className="back-btn" onClick={this.goBack}>
              ← Back
            </button>
          </div>
          <div className="loading-spinner">Loading customer details...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="cust-wrapper">
          <div className="cust-topbar">
            <h2>CUSTOMER</h2>
            <button className="back-btn" onClick={this.goBack}>
              ← Back
            </button>
          </div>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={this.fetchCustomerDetails} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="cust-wrapper">
        {/* Top Bar */}
        <div className="cust-topbar">
          <h2>CUSTOMER PROFILE</h2>
          <button className="back-btn" onClick={this.goBack}>
            ← Back to List
          </button>
        </div>

        {/* Card */}
        <div className="cust-view-card">
          <h2 className="cust-title-center">Customer Details</h2>

          {/* Customer ID Display */}
          <div className="cust-id-display">
            <label>Customer ID:</label>
            <span className="customer-id-badge">{data.customer_id}</span>
          </div>

          <div className="cust-view-body">
            {/* Name */}
            <div className="cust-row">
              <label>Full Name</label>
              <div className="cust-value">{data.name}</div>
            </div>

            {/* Email */}
            <div className="cust-row">
              <label>Email Address</label>
              <div className="cust-value">{data.email}</div>
            </div>

            {/* Mobile */}
            <div className="cust-row">
              <label>Mobile Number</label>
              <div className="cust-value">
                {data.mobile_country_code} {data.mobile_number}
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="cust-row">
              <label>Address Line 1</label>
              <div className="cust-value">{data.address_line1}</div>
            </div>

            {/* Address Line 2 (if exists) */}
            {data.address_line2 && (
              <div className="cust-row">
                <label>Address Line 2</label>
                <div className="cust-value">{data.address_line2}</div>
              </div>
            )}

            {/* City and State */}
            <div className="cust-row grid-2-view">
              <div>
                <label>City</label>
                <div className="cust-value">{data.city}</div>
              </div>
              <div>
                <label>State</label>
                <div className="cust-value">{data.state}</div>
              </div>
            </div>

            {/* Zipcode and Country */}
            <div className="cust-row grid-2-view">
              <div>
                <label>Zipcode</label>
                <div className="cust-value">{data.zipcode}</div>
              </div>
              <div>
                <label>Country</label>
                <div className="cust-value">{data.country}</div>
              </div>
            </div>

            {/* GST Number */}
            <div className="cust-row">
              <label>GST Number</label>
              <div className="cust-value">{data.gst_number}</div>
            </div>

            {/* Status */}
            <div className="cust-row">
              <label>Status</label>
              <div className="cust-value">
                <span className={`status-badge ${data.status}`}>
                  {data.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cust-delete-wrap">
              <button
                className="cust-delete-btn"
                onClick={this.handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Customer'}
              </button>

              <button
                className="back-btn"
                onClick={this.goBack}
                disabled={deleting}
              >
                ← Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerProfile;