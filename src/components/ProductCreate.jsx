import React, { Component } from "react";
import "../styles/ProductDetails.css";
import { createProduct } from "../services/productService";

class ProductCreate extends Component {
  state = {
    name: "",
    description: "",
    price: "",
    hsnCode: "",
    taxRate: "",
    unit: "",
    stockQuantity: "",
    loading: false,
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  goBack = () => {
    this.props.navigate("dashboard");
  };

  // 🔥 FIXED CREATE
  handleCreate = async () => {
    const {
      name,
      description,
      price,
      hsnCode,
      taxRate,
      unit,
      stockQuantity,
    } = this.state;

    // ✅ frontend validation
    if (!name.trim()) {
      return this.setState({ error: "Product name required" });
    }

    if (!price) {
      return this.setState({ error: "Price required" });
    }

    try {
      this.setState({ loading: true });

      // ✅ SAFE PAYLOAD (VERY IMPORTANT)
      const payload = {
        name: name.trim(),
        description: description?.trim() || "",
        price: Number(price) || 0,
        hsn_code: hsnCode?.trim() || "",
        tax_rate: Number(taxRate) || 0,
        unit: unit?.trim() || "pcs",
        stock_quantity: Number(stockQuantity) || 0,
      };

      console.log("🚀 Create product payload:", payload);

      const res = await createProduct(payload);

      console.log("✅ Create response:", res?.data);

      alert(res?.data?.message || "Product created successfully");

      // send to dashboard
      this.props.navigate("dashboard", {
        id: Date.now(),
        name: payload.name,
        category: payload.unit,
        price: payload.price,
        stock: payload.stock_quantity,
        status:
          payload.stock_quantity === 0
            ? "Out of Stock"
            : payload.stock_quantity < 50
            ? "Low Stock"
            : "In Stock",
      });
    } catch (err) {
      console.error("❌ Create product error FULL:", err?.response?.data);

      this.setState({
        error:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Product creation failed",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="pd-wrapper">
        <div className="top-bar top-bar-flex">
          <h2>PRODUCT</h2>
          <button className="back-btn" onClick={this.goBack}>
            ← Back
          </button>
        </div>

        <div className="pd-card">
          <h3 className="pd-title">Create Product</h3>

          {this.state.error && (
            <div className="error-text">{this.state.error}</div>
          )}

          <div className="pd-field">
            <label>Name</label>
            <input name="name" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>Description</label>
            <input name="description" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>Price</label>
            <input name="price" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>HSN Code</label>
            <input name="hsnCode" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>Tax Rate (%)</label>
            <input name="taxRate" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>Unit (kg/pcs)</label>
            <input name="unit" onChange={this.handleChange} />
          </div>

          <div className="pd-field">
            <label>Stock Quantity</label>
            <input name="stockQuantity" onChange={this.handleChange} />
          </div>

          <div className="pd-footer">
            <button
              className="btn-login"
              onClick={this.handleCreate}
              disabled={this.state.loading}
            >
              {this.state.loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCreate;