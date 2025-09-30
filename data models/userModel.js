const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },             // Store hash, not plain text

  fullName: { type: String, required: true },
  phone: { type: String },

  addresses: [
    {
      label: { type: String }, // e.g. "Home", "Office"
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }
  ],

  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
      size: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ],

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Linking orders

}, { timestamps: true });

const UserSchema = mongoose.model("User", userSchema);
module.exports = UserSchema;
