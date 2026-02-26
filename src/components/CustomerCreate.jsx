// import React, { Component } from "react";
// import "../styles/Customer.css";

// class CustomerCreate extends Component {
//   state = {
//     name: "",
//     mobile: "",
//     email: "",
//     city: "",
//     stateName: "",
//     pincode: "",
//     gst: "",
//   };

//   handleChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   // ✅ UPDATED — Create → Customer List
//   handleCreate = () => {
//     const newCustomer = {
//       ...this.state,
//       id: Date.now(),
//       country: "India",
//     };

//     alert("Customer Created");

//     // 👉 redirect to customer list
//     this.props.navigate("customerList", newCustomer);
//   };

//   // ✅ profile icon still opens profile directly
//   openProfile = () => {
//     this.props.navigate("customerProfile", this.state);
//   };

//   render() {
//     return (
//       <div className="cust-wrapper">
//         {/* Top bar */}
//         <div className="top-bar top-bar-flex">
//           <h2>CUSTOMER</h2>

//           {/* profile icon */}
//           <div className="profile-icon" onClick={this.openProfile}>
//             👤
//           </div>

//           <button className="back-btn" onClick={this.goBack}>
//             ← Back
//           </button>
          
//         </div>

//         {/* Card */}
//         <div className="cust-card">
//           <h2 className="cust-title">Customer Create</h2>

//           <label>name</label>
//           <input
//             name="name"
//             placeholder="name"
//             onChange={this.handleChange}
//           />

//           <label>mobile</label>
//           <div className="mobile-row">
//             <select>
//               <option>+1</option>
//               <option>+91</option>
//             </select>
//             <input
//               name="mobile"
//               placeholder="mobile"
//               onChange={this.handleChange}
//             />
//           </div>

//           <label>email</label>
//           <input
//             name="email"
//             placeholder="address"
//             onChange={this.handleChange}
//           />

//           <label>city</label>
//           <div className="grid-2">
//             <input
//               name="city"
//               placeholder="city"
//               onChange={this.handleChange}
//             />
//             <input
//               name="stateName"
//               placeholder="state"
//               onChange={this.handleChange}
//             />
//           </div>

//           <div className="grid-2">
//             <input
//               name="pincode"
//               placeholder="pincode"
//               onChange={this.handleChange}
//             />
//             <input
//               name="gst"
//               placeholder="gst number"
//               onChange={this.handleChange}
//             />
//           </div>

//           <button className="create-btn" onClick={this.handleCreate}>
//             Create
//           </button>


//         </div>
//       </div>
//     );
//   }
// }

// export default CustomerCreate;

import React, { Component } from "react";
import "../styles/Customer.css";
import { createCustomer } from "../services/customerService";

class CustomerCreate extends Component {
  state = {
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    gst_number: "",
    loading: false,
    error: null
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCountryCodeChange = (e) => {
    this.setState({ countryCode: e.target.value });
  };

  // Validate form fields
  validateForm = () => {
    const { name, email, mobile, addressLine1, city, state, zipcode } = this.state;
    
    if (!name.trim()) {
      alert("Please enter customer name");
      return false;
    }
    if (!email.trim()) {
      alert("Please enter email address");
      return false;
    }
    if (!mobile.trim()) {
      alert("Please enter mobile number");
      return false;
    }
    if (!addressLine1.trim()) {
      alert("Please enter address line 1");
      return false;
    }
    if (!city.trim()) {
      alert("Please enter city");
      return false;
    }
    if (!state.trim()) {
      alert("Please enter state");
      return false;
    }
    if (!zipcode.trim()) {
      alert("Please enter zipcode");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    
    // Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return false;
    }
    
    // Zipcode validation (6 digits)
    const zipcodeRegex = /^\d{6}$/;
    if (!zipcodeRegex.test(zipcode)) {
      alert("Please enter a valid 6-digit zipcode");
      return false;
    }
    
    return true;
  };

  // Create customer
  handleCreate = async () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true, error: null });
    
    try {
      // Prepare customer data as per backend format
      const customerData = {
        name: {
          full: this.state.name.trim()
        },
        email: this.state.email.trim(),
        mobile: {
          country_code: this.state.countryCode,
          national_number: this.state.mobile.trim()
        },
        address: {
          line_1: this.state.addressLine1.trim(),
          ...(this.state.addressLine2.trim() && { line_2: this.state.addressLine2.trim() }),
          city: this.state.city.trim(),
          state: this.state.state.trim(),
          zipcode: this.state.zipcode.trim(),
          country: this.state.country
        }
      };

      // Add GST number if provided
      if (this.state.gst_number.trim()) {
        customerData.gst_number = this.state.gst_number.trim().toUpperCase();
      }
      
      console.log("Creating customer with data:", JSON.stringify(customerData, null, 2));
      
      // Call API to create customer
      const response = await createCustomer(customerData);
      console.log("Customer Create Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        alert("Customer created successfully!");
        
        // Navigate to customer list with the new customer data
        this.props.navigate("customerList", responseData.data);
      } else {
        this.setState({ 
          loading: false,
          error: responseData.message || "Failed to create customer" 
        });
        alert(responseData.message || "Failed to create customer");
      }
      
      this.setState({ loading: false });
    } catch (error) {
      console.error("Error creating customer:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.msg || 
                          "Failed to create customer. Please try again.";
      this.setState({ 
        loading: false,
        error: errorMessage 
      });
      alert(errorMessage);
    }
  };

  // Navigate to customer list
  goToList = () => {
    this.props.navigate("customerList");
  };

  // Navigate to customer profile with current form data
  openProfile = () => {
    // Prepare customer data as per backend format for preview
    const customerData = {
      name: { full: this.state.name },
      email: this.state.email,
      mobile: {
        country_code: this.state.countryCode,
        national_number: this.state.mobile
      },
      address: {
        line_1: this.state.addressLine1,
        line_2: this.state.addressLine2,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
        country: this.state.country
      },
      gst_number: this.state.gst_number
    };
    this.props.navigate("customerProfile", customerData);
  };

  // Back button
  goBack = () => {
    this.props.navigate("dashboard");
  };

  render() {
    const { loading, countryCode } = this.state;

    return (
      <div className="cust-wrapper">
        {/* Top bar */}
        <div className="top-bar top-bar-flex">
          <h2>CUSTOMER</h2>

          {/* profile icon */}
          <div className="profile-icon" onClick={this.openProfile}>
            👤
          </div>

          <button className="back-btn" onClick={this.goBack}>
            ← Back
          </button>
        </div>

        {/* Card */}
        <div className="cust-card">
          <h2 className="cust-title">Customer Create</h2>

          {this.state.error && (
            <div className="error-message" style={{ marginBottom: '15px' }}>
              {this.state.error}
            </div>
          )}

          <label>Full Name *</label>
          <input
            name="name"
            placeholder="Enter full name"
            value={this.state.name}
            onChange={this.handleChange}
            disabled={loading}
          />

          <label>Email Address *</label>
          <input
            name="email"
            type="email"
            placeholder="customer@example.com"
            value={this.state.email}
            onChange={this.handleChange}
            disabled={loading}
          />

          <label>Mobile Number *</label>
          <div className="mobile-row">
            <select 
              value={countryCode} 
              onChange={this.handleCountryCodeChange}
              disabled={loading}
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (India)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
              <option value="+86">+86 (China)</option>
              <option value="+971">+971 (UAE)</option>
            </select>
            <input
              name="mobile"
              placeholder="10-digit mobile number"
              value={this.state.mobile}
              onChange={this.handleChange}
              disabled={loading}
              maxLength="10"
            />
          </div>

          <h3 className="section-title">Address Details</h3>

          <label>Address Line 1 *</label>
          <input
            name="addressLine1"
            placeholder="Street address, P.O. box"
            value={this.state.addressLine1}
            onChange={this.handleChange}
            disabled={loading}
          />

          <label>Address Line 2</label>
          <input
            name="addressLine2"
            placeholder="Apartment, suite, unit, building (optional)"
            value={this.state.addressLine2}
            onChange={this.handleChange}
            disabled={loading}
          />

          <div className="grid-2">
            <div>
              <label>City *</label>
              <input
                name="city"
                placeholder="City"
                value={this.state.city}
                onChange={this.handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label>State *</label>
              <input
                name="state"
                placeholder="State"
                value={this.state.state}
                onChange={this.handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Zipcode *</label>
              <input
                name="zipcode"
                placeholder="6-digit zipcode"
                value={this.state.zipcode}
                onChange={this.handleChange}
                disabled={loading}
                maxLength="6"
              />
            </div>
            <div>
              <label>Country</label>
              <select
                name="country"
                value={this.state.country}
                onChange={this.handleChange}
                disabled={loading}
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
                <option value="UAE">UAE</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
          </div>

          <label>GST Number (Optional)</label>
          <input
            name="gst_number"
            placeholder="15-digit GST number"
            value={this.state.gst_number}
            onChange={this.handleChange}
            disabled={loading}
            maxLength="15"
            style={{ textTransform: 'uppercase' }}
          />

          <button 
            className="create-btn" 
            onClick={this.handleCreate}
            disabled={loading}
          >
            {loading ? 'Creating Customer...' : 'Create Customer'}
          </button>

          <button 
            className="view-list-btn" 
            onClick={this.goToList}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            View Customer List
          </button>
        </div>
      </div>
    );
  }
}

export default CustomerCreate;