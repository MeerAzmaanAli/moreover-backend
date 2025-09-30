const express = require('express');
const { addProduct,
        getAllProducts,
        getSingleProduct,
        deleteProduct,
        updateProduct,
        addVariant,
        deleteVariant,
        getSingleVariant,
        getAllByCategory,
        getAllByTag,
        getAllVariants,
        searchProducts
      } = require('../controller/productController');

const productsRoutes = express.Router();

productsRoutes.get('/', getAllProducts);
productsRoutes.get('/variants/:id', getAllVariants);

productsRoutes.get('/filter/categories/:category', getAllByCategory);
productsRoutes.get('/filter/tags/:tag', getAllByTag);

productsRoutes.get('/product/:id', getSingleProduct);
productsRoutes.get('/variant/:id', getSingleVariant);

productsRoutes.post('/add/product/', addProduct);
productsRoutes.post('/add/variant/', addVariant);

productsRoutes.delete('/delete/product/:id', deleteProduct);
productsRoutes.delete('/delete/variant/:id', deleteVariant);

productsRoutes.patch('/update/product/:id', updateProduct);
productsRoutes.patch('/update/variant/:id', updateProduct);

productsRoutes.get("/search", searchProducts);

module.exports = productsRoutes;