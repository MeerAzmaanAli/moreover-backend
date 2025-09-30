const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId,  auto: true },
    name: {
        //"Men's Oversized T-Shirt"
      type: String,
      required: true,
      trim: true,
    },
    slug: {
        //"mens-oversized-tshirt"
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
    },
    categories: [
      {
        //"men", "t-shirts", "oversized"
        type: String,
        index: true,
      },
    ],
    attributes: {
        // "material": "100% Cotton", "fit": "Oversized"
      type: Map, // flexible key/value storage
      of: String,
    },
    tags: [
      {
        //"summer", "new-arrival", "casual"
        type: String,
        index: true,
      },
    ],
    variants:[
      {
        type: mongoose.Schema.Types.ObjectId, ref: "Variant"
      }
    ],
    seo: {
        /* "title": "Men's Oversized T-Shirt | Premium Cotton",
            "description": "Buy premium oversized t-shirts for men...",
            "keywords": ["oversized t-shirt", "mens cotton tee"]*/
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const ProductSchema = mongoose.model('Product', productSchema);

module.exports = ProductSchema;