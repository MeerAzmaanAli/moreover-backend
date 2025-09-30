const UserSchema = require("../data models/userModel");
const OrderSchema = require("../data models/orderModel");
const jwt =require("jsonwebtoken");

//this is the controller function for user signup
const signupUser = async (req , res) => {
  const {   email,
            passwordHash,             // Store hash, not plain text
            fullName,
            phone} = req.body;
  try {
    const newUser = new UserSchema({
      email,
      passwordHash,
      fullName,
      phone
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Here you would normally compare the password with a hashed password
    // For simplicity, we'll just check if the password matches
    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
        token,
        user: {
        id: user._id,
        email: user.email,
        }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};

const getUserProfile = async (req, res) => {
  const{id}=req.params;
  try {
    const user = await UserSchema.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};
const getUserOrders = async (req, res) => {
  const{id}=req.params;
  try {
    const orders = await OrderSchema.find({ userId: id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve user orders" });
  }
};
const getUserCart = async (req, res) => {
  const{id}=req.params;
  try {
    const user = await UserSchema.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve user cart" });
  }
};
const addToCart = async (req, res) => {
  const { userId, productId, variantId, size, quantity } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const existingItemIndex = user.cart.findIndex(item => item.variantId.toString() === variantId && item.size === size);
    if (existingItemIndex >= 0) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId: productId, variantId: variantId, size: size, quantity: quantity });
    }
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to add to cart" });
  }
};
const addOrder = async (req, res) => {
  const { userId, items, totalAmount, status, shippingAddress, payment } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newOrder = new OrderSchema({
      userId: userId,
      items,
      totalAmount,
      status,
      shippingAddress,
      payment
    });   
    await newOrder.save();

    user.orders.push(newOrder._id);
    await user.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to add order" });
  }
};
const updateProfile = async (req, res) => {
  const { _id, fullName, phone, addresses } = req.body;
  try {
    const user = await UserSchema.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.fullName = fullName;
    user.phone = phone;
    user.addresses = addresses;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message, "Failed to update profile");
  }
};
const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.cart.pull({ _id: itemId });
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to remove from cart" });
  }
};
const updateOrder = async (req, res) => {
  const { orderId, status} = req.body;
  try {
    const order = await OrderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update order" });
  }
};
const updateCartItem = async (req, res) => {
  const { userId, itemId, quantity } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cartItem = user.cart._id(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    cartItem.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update cart item" });
  }
};
module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  getUserOrders,
  getUserCart,
  addToCart,
  addOrder,
  updateProfile,
  removeFromCart,
  updateOrder,
  updateCartItem
};