import React, { useState } from "react";
import "../styles/InvoicePage.css";

const InvoicePage = (props) => {
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");

  // 👇 receive data from ProductDashboard (safe)
  const invoiceData = props?.data?.invoiceData || {};

  // demo items (replace later with backend)
  const [items, setItems] = useState([
    {
      name: "Green Tea",
      desc: "Organic Green Tea",
      price: 200,
      quantity: 2,
    },
    {
      name: "Digital Watch",
      desc: "Smart Digital Tracker",
      price: 1500,
      quantity: 1,
    },
    {
      name: "Wireless Mouse",
      desc: "Bluetooth Mouse",
      price: 800,
      quantity: 1,
    },
  ]);

  // ✅ ADD ITEM HANDLER
  const handleAddItem = () => {
    if (!itemName || !qty) return;

    const newItem = {
      name: itemName,
      desc: itemName,
      price: 0,
      quantity: Number(qty),
    };

    setItems((prev) => [...prev, newItem]);
    setItemName("");
    setQty("");
  };

  // ✅ BACK TO PRODUCT DASHBOARD - FIXED
  const handleBack = () => {
    if (props.navigate) {
      // Navigate to "dashboard" which is your ProductDashboard route in App.js
      props.navigate("dashboard");
    }
  };

  // calculations
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return (
    <div className="inv-layout">
      <main className="inv-main">
        <div className="inv-top">
          <h1>Invoice</h1>
          <button className="back-btn" onClick={handleBack}>
            ← Back to Products
          </button>
        </div>

        <div className="inv-card">
          {/* Add Row */}
          <div className="add-row">
            <div>
              <label>Item:</label>
              <input
                placeholder="Enter item name..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div>
              <label>Quantity:</label>
              <input
                placeholder="Enter quantity..."
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <button className="add-btn" onClick={handleAddItem}>
              Add
            </button>

            {/* Right Meta */}
            <div className="meta-box">
              <p>
                <b>Date:</b>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Table */}
          <table className="inv-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>
                    <div className="item-title">{it.name}</div>
                    <div className="item-sub">{it.desc}</div>
                  </td>
                  <td>{it.desc}</td>
                  <td>
                    <input
                      className="price-input"
                      value={`₹ ${it.price.toFixed(2)}`}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      className="qty-input"
                      value={it.quantity}
                      readOnly
                    />
                  </td>
                  <td className="total-cell">
                    ₹ {(it.price * it.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals">
            <p>
              Subtotal: <span>₹ {subtotal.toFixed(2)}</span>
            </p>
            <p>
              GST (18%): <span>₹ {gst.toFixed(2)}</span>
            </p>
            <h3>
              Grand Total:{" "}
              <span>₹ {grandTotal.toFixed(2)}</span>
            </h3>

            <button className="pdf-btn">
              📄 Generate PDF Invoice
            </button>
          </div>

          <p className="thank-text">
            Thank you for your business!
          </p>
        </div>
      </main>
    </div>
  );
};

export default InvoicePage;