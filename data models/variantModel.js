const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const variantSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId,  auto: true},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sku: {type: String,unique: true,required: true,trim: true,},
    color: {type: String, required: true, trim: true,},
    size: [{type: String, required: true, trim: true,}],
    price: {type: Number, required: true,},
    discountPrice: {type: Number, default: null,},
    currency: {type: String, default: "INR",},
    stock: {type: Number, required: true, min: 0,},
    sold: {type: Number, default: 0, min: 0,},
    images: [{type: String, trim: true,}],
    additionalAttributes: {type: Map, of: String},
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const VariantSchema = mongoose.model("Variant", variantSchema);
module.exports = VariantSchema;