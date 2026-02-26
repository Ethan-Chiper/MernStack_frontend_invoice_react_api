// import React, { Component } from "react";
// import "../styles/ProductDetails.css";
// import { getProductById } from "../services/productService";

// class ProductDetails extends Component {
//   state = {
//     product_id: "",
//     name: "",
//     description: "",
//     price: "",
//     hsn_code: "",
//     tax_rate: "",
//     unit: "",
//     stock_quantity: "",
//     status: "",
//     loading: true,
//     error: null
//   };

//   // ✅ back to productDashboard
//   goBack = () => {
//     this.props.navigate && this.props.navigate("productDashboard");
//   };

//   async componentDidMount() {
//     console.log("ProductDetails received props:", this.props);
    
//     // Check if product data was passed directly
//     if (this.props.product) {
//       console.log("Loading product from props:", this.props.product);
      
//       // Map the product data to state fields
//       const productData = this.props.product;
//       this.setState({
//         product_id: productData.product_id || productData._id || productData.id || "",
//         name: productData.name || productData.productName || "",
//         description: productData.description || "",
//         price: productData.price || "",
//         hsn_code: productData.hsn_code || productData.hsnCode || "",
//         tax_rate: productData.tax_rate || productData.taxRate || "",
//         unit: productData.unit || productData.unit1 || "",
//         stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
//         status: productData.status || "",
//         loading: false
//       });
//     } 
//     // If no product data in props, try to fetch from API using ID from URL
//     else {
//       await this.fetchProductDetails();
//     }
//   }

//   // Fetch product details from API
//   fetchProductDetails = async () => {
//     try {
//       this.setState({ loading: true, error: null });
      
//       // Get product ID from props or URL params
//       const productId = this.props.productId || this.props.match?.params?.productId;
      
//       if (!productId) {
//         this.setState({
//           loading: false,
//           error: "Product ID not found"
//         });
//         return;
//       }
      
//       console.log(`Fetching product details for ID: ${productId}`);
      
//       const response = await getProductById(productId);
//       console.log("Product Details API Response:", response);
      
//       const responseData = response.data;
      
//       if (responseData.error === false) {
//         const productData = responseData.data || responseData;
//         console.log("Product data from API:", productData);
        
//         this.setState({
//           product_id: productData.product_id || productData._id || productData.id || "",
//           name: productData.name || productData.productName || "",
//           description: productData.description || "",
//           price: productData.price || "",
//           hsn_code: productData.hsn_code || productData.hsnCode || "",
//           tax_rate: productData.tax_rate || productData.taxRate || "",
//           unit: productData.unit || productData.unit1 || "",
//           stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
//           status: productData.status || "",
//           loading: false
//         });
//       } else {
//         this.setState({
//           loading: false,
//           error: responseData.message || "Failed to fetch product details"
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//       this.setState({
//         loading: false,
//         error: error.response?.data?.message || "Failed to fetch product details"
//       });
//     }
//   };

//   handleChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   // BACK BUTTON
//   goBack = () => {
//     this.props.navigate("productDashboard");
//   };

//   render() {
//     const { 
//       loading, 
//       error, 
//       product_id,
//       name, 
//       description, 
//       price, 
//       hsn_code, 
//       tax_rate, 
//       unit, 
//       stock_quantity,
//       status 
//     } = this.state;

//     if (loading) {
//       return <div className="loading-spinner">Loading product details...</div>;
//     }

//     if (error) {
//       return (
//         <div className="error-message">
//           <p>{error}</p>
//           <button onClick={this.goBack} className="back-btn">
//             ← Back to Products
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="pd-wrapper">
//         {/* Top Header WITH BACK */}
//         <div className="pd-topbar">
//           <h2>PRODUCT DETAILS</h2>
//           <button className="back-btn" onClick={this.goBack}>
//             ← Back
//           </button>
//         </div>

//         {/* Card */}
//         <div className="pd-card">
//           <h3 className="pd-title">Product Information</h3>

//           {/* Product ID Display */}
//           <div className="pd-product-id">
//             <label>Product ID:</label>
//             <span className="product-id-value">{product_id}</span>
//           </div>

//           {/* Row 1 */}
//           <div className="pd-grid">
//             <div className="pd-field">
//               <label>Product Name</label>
//               <input
//                 name="name"
//                 value={name || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Description</label>
//               <input
//                 name="description"
//                 value={description || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="pd-grid">
//             <div className="pd-field">
//               <label>Price ($)</label>
//               <input
//                 name="price"
//                 value={price || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>HSN Code</label>
//               <input
//                 name="hsn_code"
//                 value={hsn_code || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>

//           {/* Row 3 */}
//           <div className="pd-grid-4">
//             <div className="pd-field">
//               <label>Tax Rate</label>
//               <div className="tax-box">
//                 <input
//                   name="tax_rate"
//                   value={tax_rate || ''}
//                   onChange={this.handleChange}
//                   readOnly
//                   className="readonly-field"
//                 />
//                 <span>%</span>
//               </div>
//             </div>

//             <div className="pd-field">
//               <label>Unit</label>
//               <input
//                 name="unit"
//                 value={unit || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Stock Quantity</label>
//               <input
//                 name="stock_quantity"
//                 value={stock_quantity || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Status</label>
//               <input
//                 name="status"
//                 value={status || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default ProductDetails;



// import React, { Component } from "react";
// import "../styles/ProductDetails.css";
// import { getProductById } from "../services/productService";

// class ProductDetails extends Component {
//   state = {
//     product_id: "",
//     name: "",
//     description: "",
//     price: "",
//     hsn_code: "",
//     tax_rate: "",
//     unit: "",
//     stock_quantity: "",
//     status: "",
//     loading: true,
//     error: null
//   };

//   async componentDidMount() {
//     console.log("ProductDetails received props:", this.props);
    
//     // Check if product data was passed directly
//     if (this.props.product) {
//       console.log("Loading product from props:", this.props.product);
      
//       // Map the product data to state fields
//       const productData = this.props.product;
//       this.setState({
//         product_id: productData.product_id || productData._id || productData.id || "",
//         name: productData.name || productData.productName || "",
//         description: productData.description || "",
//         price: productData.price || "",
//         hsn_code: productData.hsn_code || productData.hsnCode || "",
//         tax_rate: productData.tax_rate || productData.taxRate || "",
//         unit: productData.unit || productData.unit1 || "",
//         stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
//         status: productData.status || "",
//         loading: false
//       });
//     } 
//     // If no product data in props, try to fetch from API using ID from URL
//     else {
//       await this.fetchProductDetails();
//     }
//   }

//   // Fetch product details from API
//   fetchProductDetails = async () => {
//     try {
//       this.setState({ loading: true, error: null });
      
//       // Get product ID from props or URL params
//       const productId = this.props.productId || this.props.match?.params?.productId;
      
//       if (!productId) {
//         this.setState({
//           loading: false,
//           error: "Product ID not found"
//         });
//         return;
//       }
      
//       console.log(`Fetching product details for ID: ${productId}`);
      
//       const response = await getProductById(productId);
//       console.log("Product Details API Response:", response);
      
//       const responseData = response.data;
      
//       if (responseData.error === false) {
//         const productData = responseData.data || responseData;
//         console.log("Product data from API:", productData);
        
//         this.setState({
//           product_id: productData.product_id || productData._id || productData.id || "",
//           name: productData.name || productData.productName || "",
//           description: productData.description || "",
//           price: productData.price || "",
//           hsn_code: productData.hsn_code || productData.hsnCode || "",
//           tax_rate: productData.tax_rate || productData.taxRate || "",
//           unit: productData.unit || productData.unit1 || "",
//           stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
//           status: productData.status || "",
//           loading: false
//         });
//       } else {
//         this.setState({
//           loading: false,
//           error: responseData.message || "Failed to fetch product details"
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//       this.setState({
//         loading: false,
//         error: error.response?.data?.message || "Failed to fetch product details"
//       });
//     }
//   };

//   handleChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   // SINGLE goBack method - FIXED
//   goBack = () => {
//     console.log("Go back clicked, navigating to productDashboard");
//     // Check if navigate exists and call it directly
//     if (this.props.navigate) {
//       this.props.navigate("productDashboard");
//     } else {
//       console.error("navigate function not found in props");
//     }
//   };

//   render() {
//     const { 
//       loading, 
//       error, 
//       product_id,
//       name, 
//       description, 
//       price, 
//       hsn_code, 
//       tax_rate, 
//       unit, 
//       stock_quantity,
//       status 
//     } = this.state;

//     if (loading) {
//       return <div className="loading-spinner">Loading product details...</div>;
//     }

//     if (error) {
//       return (
//         <div className="error-message">
//           <p>{error}</p>
//           <button onClick={this.goBack} className="back-btn">
//             ← Back to Products
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="pd-wrapper">
//         {/* Top Header WITH BACK */}
//         <div className="pd-topbar">
//           <h2>PRODUCT DETAILS</h2>
//           <button className="back-btn" onClick={this.goBack}>
//             ← Back
//           </button>
//         </div>

//         {/* Card */}
//         <div className="pd-card">
//           <h3 className="pd-title">Product Information</h3>

//           {/* Product ID Display */}
//           <div className="pd-product-id">
//             <label>Product ID:</label>
//             <span className="product-id-value">{product_id}</span>
//           </div>

//           {/* Row 1 */}
//           <div className="pd-grid">
//             <div className="pd-field">
//               <label>Product Name</label>
//               <input
//                 name="name"
//                 value={name || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Description</label>
//               <input
//                 name="description"
//                 value={description || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="pd-grid">
//             <div className="pd-field">
//               <label>Price ($)</label>
//               <input
//                 name="price"
//                 value={price || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>HSN Code</label>
//               <input
//                 name="hsn_code"
//                 value={hsn_code || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>

//           {/* Row 3 */}
//           <div className="pd-grid-4">
//             <div className="pd-field">
//               <label>Tax Rate</label>
//               <div className="tax-box">
//                 <input
//                   name="tax_rate"
//                   value={tax_rate || ''}
//                   onChange={this.handleChange}
//                   readOnly
//                   className="readonly-field"
//                 />
//                 <span>%</span>
//               </div>
//             </div>

//             <div className="pd-field">
//               <label>Unit</label>
//               <input
//                 name="unit"
//                 value={unit || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Stock Quantity</label>
//               <input
//                 name="stock_quantity"
//                 value={stock_quantity || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>

//             <div className="pd-field">
//               <label>Status</label>
//               <input
//                 name="status"
//                 value={status || ''}
//                 onChange={this.handleChange}
//                 readOnly
//                 className="readonly-field"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default ProductDetails;

import React, { Component } from "react";
import "../styles/ProductDetails.css";
import { getProductById } from "../services/productService";

class ProductDetails extends Component {
  state = {
    product_id: "",
    name: "",
    description: "",
    price: "",
    hsn_code: "",
    tax_rate: "",
    unit: "",
    stock_quantity: "",
    status: "",
    loading: true,
    error: null
  };

  async componentDidMount() {
    console.log("ProductDetails received props:", this.props);
    
    // Check if product data was passed directly
    if (this.props.product) {
      console.log("Loading product from props:", this.props.product);
      
      // Map the product data to state fields
      const productData = this.props.product;
      this.setState({
        product_id: productData.product_id || productData._id || productData.id || "",
        name: productData.name || productData.productName || "",
        description: productData.description || "",
        price: productData.price || "",
        hsn_code: productData.hsn_code || productData.hsnCode || "",
        tax_rate: productData.tax_rate || productData.taxRate || "",
        unit: productData.unit || productData.unit1 || "",
        stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
        status: productData.status || "",
        loading: false
      });
    } 
    // If no product data in props, try to fetch from API using ID from URL
    else {
      await this.fetchProductDetails();
    }
  }

  // Fetch product details from API
  fetchProductDetails = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      // Get product ID from props or URL params
      const productId = this.props.productId || this.props.match?.params?.productId;
      
      if (!productId) {
        this.setState({
          loading: false,
          error: "Product ID not found"
        });
        return;
      }
      
      console.log(`Fetching product details for ID: ${productId}`);
      
      const response = await getProductById(productId);
      console.log("Product Details API Response:", response);
      
      const responseData = response.data;
      
      if (responseData.error === false) {
        const productData = responseData.data || responseData;
        console.log("Product data from API:", productData);
        
        this.setState({
          product_id: productData.product_id || productData._id || productData.id || "",
          name: productData.name || productData.productName || "",
          description: productData.description || "",
          price: productData.price || "",
          hsn_code: productData.hsn_code || productData.hsnCode || "",
          tax_rate: productData.tax_rate || productData.taxRate || "",
          unit: productData.unit || productData.unit1 || "",
          stock_quantity: productData.stock_quantity || productData.stock || productData.quantity || "",
          status: productData.status || "",
          loading: false
        });
      } else {
        this.setState({
          loading: false,
          error: responseData.message || "Failed to fetch product details"
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      this.setState({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch product details"
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // FIXED: Back button to navigate to dashboard (product dashboard)
  goBack = () => {
    console.log("Go back clicked, navigating to dashboard");
    // Check if navigate exists and call it directly
    if (this.props.navigate) {
      // Use "dashboard" as per your App.js
      this.props.navigate("dashboard");
    } else {
      console.error("navigate function not found in props");
      // Fallback - try to use window history
      window.history.back();
    }
  };

  render() {
    const { 
      loading, 
      error, 
      product_id,
      name, 
      description, 
      price, 
      hsn_code, 
      tax_rate, 
      unit, 
      stock_quantity,
      status 
    } = this.state;

    if (loading) {
      return <div className="loading-spinner">Loading product details...</div>;
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={this.goBack} className="back-btn">
            ← Back to Products
          </button>
        </div>
      );
    }

    return (
      <div className="pd-wrapper">
        {/* Top Header WITH BACK */}
        <div className="pd-topbar">
          <h2>PRODUCT DETAILS</h2>
          <button className="back-btn" onClick={this.goBack}>
            ← Back
          </button>
        </div>

        {/* Card */}
        <div className="pd-card">
          <h3 className="pd-title">Product Information</h3>

          {/* Product ID Display */}
          <div className="pd-product-id">
            <label>Product ID:</label>
            <span className="product-id-value">{product_id}</span>
          </div>

          {/* Row 1 */}
          <div className="pd-grid">
            <div className="pd-field">
              <label>Product Name</label>
              <input
                name="name"
                value={name || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="pd-field">
              <label>Description</label>
              <input
                name="description"
                value={description || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="pd-grid">
            <div className="pd-field">
              <label>Price ($)</label>
              <input
                name="price"
                value={price || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="pd-field">
              <label>HSN Code</label>
              <input
                name="hsn_code"
                value={hsn_code || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="pd-grid-4">
            <div className="pd-field">
              <label>Tax Rate</label>
              <div className="tax-box">
                <input
                  name="tax_rate"
                  value={tax_rate || ''}
                  onChange={this.handleChange}
                  readOnly
                  className="readonly-field"
                />
                <span>%</span>
              </div>
            </div>

            <div className="pd-field">
              <label>Unit</label>
              <input
                name="unit"
                value={unit || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="pd-field">
              <label>Stock Quantity</label>
              <input
                name="stock_quantity"
                value={stock_quantity || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="pd-field">
              <label>Status</label>
              <input
                name="status"
                value={status || ''}
                onChange={this.handleChange}
                readOnly
                className="readonly-field"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetails;