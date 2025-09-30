
const ProductSchema = require('../data models/productModel');
const { all } = require('../routes/products');
const VariantSchema = require('../data models/variantModel');

//get all
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductSchema.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Failed to fetch all products" });
  }
};


const getAllVariants = async (req, res) => {
  const {id } = req.params;
   let variants=[];
  try {
    if(id !== "-1"){
      variants = await VariantSchema.find({ productId: id });
    }else if(id === "-1"){
      variants = await VariantSchema.find();
    }
    if (!variants.length) {
      return res.status(404).json({ message: "No variants found for this product" });
    }
    res.status(200).json({ variants });
  } catch (error) {
    console.error("Error fetching all variants:", error);
    res.status(500).json({ error: "Failed to fetch all variants" });
  }
};


const getAllByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await ProductSchema.find({ categories:  category });
    if (!products.length) {
      return res.status(404).json({ message: "No products found in this category" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllByTag = async (req, res) => {
const { tag } = req.params;
  try {
    const products = await ProductSchema.find({ tags: tag }); // for array field
    if (!products.length) {
      return res.status(404).json({ message: "No products found with this tag" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//get single
const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    
    try {
        const product = await ProductSchema.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
const getSingleVariant = async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await VariantSchema.findById(id);
        if (!variant) {
            return res.status(404).json({ error: 'Variant not found' });
        }
        res.status(200).json({ variant });
    } catch (error) {
        console.error('Error fetching variant:', error);
        res.status(500).json({ error: 'Failed to fetch variant' });
    }
};
// addProduct API
const addProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    categories,
    attributes,
    tags,
    seo,
    status
  } = req.body;

  try {
    // Create product without variants
    const product = new ProductSchema({
      name,
      slug,
      description,
      categories,
      attributes,
      tags,
      seo,
      status,
      variants: [] // variants will be added later
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};
// addVariant API
const addVariant = async (req, res) => {
  const {
    productId,
    sku,
    color,
    size,
    price,
    discountPrice,
    currency,
    stock,
    images,
    additionalAttributes
  } = req.body;

  try {
    // Check if product exists
    const product = await ProductSchema.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create variant
    const variant = new VariantSchema({
      productId,
      sku,
      color,
      size,
      price,
      discountPrice,
      currency: currency || "INR",
      stock,
      images,
      additionalAttributes
    });

    await variant.save();

    // Push variant id into product
    product.variants.push(variant._id);
    await product.save();

    res.status(201).json({
      message: "Variant added successfully",
      variant,
      product
    });
  } catch (error) {
    console.error("Error creating variant:", error);
    res.status(500).json({ error: "Failed to create variant" });
  }
};

/* addProduct API
const addProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    category,
    attributes,
    tags,
    seo,
    status,
    variants // this is an array of variant objects
  } = req.body;

  try {
//Create Product
    const product = new ProductSchema({
      name,
      slug,
      description,
      category,
      attributes,   
      tags,
      seo,
      status,
      variants: [] // empty initially, we'll push variant ids later
    });

    await product.save();

    // Create Variants
    const variantDocs = [];
    for (const v of variants) {
      const variant = new VariantSchema({
        productId: product._id,
        sku: v.sku,
        color: v.color,
        size: v.size,
        price: v.price,
        discountPrice: v.discountPrice,
        currency: v.currency || "INR",
        stock: v.stock,
        images: v.images,
        additionalAttributes: v.additionalAttributes
      });

      await variant.save();
      variantDocs.push(variant);
      product.variants.push(variant._id); // add variant id to product
    }

    // Update Product with Variant IDs
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
      variants: variantDocs
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};
*/

//delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductSchema.findById(id);
        for(const variantId of product.variants) {
            await VariantSchema.findByIdAndDelete(variantId);
        }
        await ProductSchema.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

const deleteVariant = async(req, res)=>{
  const {id } = req.params;
  try{
    const variant = await VariantSchema.findByIdAndDelete(id);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    const product = await ProductSchema.findById(variant.productId);
    product.variants.pull(variant._id);
    await product.save();
    res.status(200).json({ message: 'Variant deleted' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ error: 'Failed to delete variant' });
  }
}

//update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const product = await ProductSchema.findByIdAndUpdate(id, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");

    const products = await ProductSchema.find({
      $or: [
        { name: regex },
        { slug: regex },
        { categories: { $in: [regex] } },
        { tags: { $in: [regex] } },
        { "seo.keywords": { $in: [regex] } },
      ],
    }).limit(20);

    res.json(products);
  } catch (error) {
    console.error("Search error:", error.message, error.stack);
    res.status(500).json({ message: "Error searching products" });
  }
};


module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    getSingleVariant,
    updateProduct,
    deleteProduct,
    addVariant,
    getAllByCategory,
    getAllByTag,
    getAllVariants,
    deleteVariant,
    searchProducts
}