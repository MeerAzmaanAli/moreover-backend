const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Snapshot price at purchase time
    }
  ],

  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"], 
    default: "Pending" 
  },

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },

  payment: {
    method: { type: String, enum: ["COD", "CreditCard", "UPI", "NetBanking"], required: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
    transactionId: { type: String }
  },

}, { timestamps: true });

const OrderSchema = mongoose.model("Order", orderSchema);
module.exports = OrderSchema;
