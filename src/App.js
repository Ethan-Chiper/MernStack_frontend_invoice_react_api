import React, { Component } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/ProductDashboard";
import ProductDetails from "./components/ProductDetails";
import ProductCreate from "./components/ProductCreate";
import CustomerCreate from "./components/CustomerCreate";
import CustomerProfile from "./components/CustomerProfile";
import CustomerList from "./components/CustomerList";
import InvoicePage from "./components/InvoicePage";

class App extends Component {
  state = {
    page: "register",
    selectedProduct: null,
    invoiceData: null // Add this to store invoice data
  };

  // ✅ 🔥 ADD HERE (ONLY ONE navigate in whole app)
  navigate = (page, data = null) => {
    console.log(`Navigating to: ${page}`, data);
    
    // Special handling for invoice page
    if (page === "invoice") {
      this.setState({
        page: "invoice",
        invoiceData: data // Store invoice data separately
      });
    } else {
      this.setState({
        page,
        selectedProduct: data,
        invoiceData: null // Clear invoice data when navigating away
      });
    }
  };

  renderPage() {
    const { page, selectedProduct, invoiceData } = this.state;

    if (page === "register")
      return <Register navigate={this.navigate} />;

    if (page === "login")
      return <Login navigate={this.navigate} />;

    if (page === "dashboard")
      return (
        <Dashboard
          navigate={this.navigate}
          newProduct={selectedProduct}
        />
      );

    if (page === "productDetails")
      return (
        <ProductDetails
          navigate={this.navigate}
          product={selectedProduct}
        />
      );

    if (page === "productCreate")
      return <ProductCreate navigate={this.navigate} />;

    if (page === "customerCreate")
      return <CustomerCreate navigate={this.navigate} />;

    if (page === "customerProfile")
      return (
        <CustomerProfile
          navigate={this.navigate}
          customer={selectedProduct}
        />
      );

    if (page === "customerList")
      return (
        <CustomerList
          navigate={this.navigate}
          customer={selectedProduct}
        />
      );

    // Add Invoice page route - FIXED
    if (page === "invoice")
      return (
        <InvoicePage
          navigate={this.navigate}
          data={invoiceData}
        />
      );

    return null;
  }

  render() {
    return <div>{this.renderPage()}</div>;
  }
}

export default App;