const express = require('express');
const { loginUser, signupUser, getUserProfile, getUserOrders, getUserCart, addToCart, addOrder, updateProfile, removeFromCart, updateOrder, updateCartItem } = require('../controller/userController');
const { authMiddleware } = require('../controller/auth');
const userRoutes = express.Router();

userRoutes.post("/login", loginUser );
userRoutes.post("/signup", signupUser );

userRoutes.get("/profile/:id",  getUserProfile);
userRoutes.get("/orders/:id",  getUserOrders);
userRoutes.get("/cart/:id",  getUserCart);
userRoutes.post("/cart/add/",  addToCart);
userRoutes.post("/orders/add/", addOrder);
userRoutes.patch("/profile/update/", updateProfile);
userRoutes.delete("/cart/remove/", removeFromCart);
userRoutes.patch("/orders/update/", updateOrder);
userRoutes.patch("/cart/update/", updateCartItem);

/*router.get("/profile", authMiddleware, getUserProfile);
router.get("/orders", authMiddleware, getUserOrders);
router.get("/cart", authMiddleware, getUserCart);
router.post("/addtocart", authMiddleware, addToCart);
router.post("/addorders", authMiddleware, addOrder);
router.post("/updateprofile", authMiddleware, updateProfile);*/

module.exports = userRoutes;