const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//controller function to create super admin
exports.createSuperAdmin = async (req, res) => {
  try {
    // Check if the username provided already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new super admin user
    const user = new User({
      username: req.body.username,
      password: hashedPassword, // Store the hashed password
      role: "admin",
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: "Super admin created successfully", user });
  } catch (error) {
    // Handle any errors and send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//controller function to register user
exports.registerUser = async (req, res) => {
  try {
    // Check if the username provided already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      role: "user",
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    // Handle any errors and send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//controller function to login
exports.loginUser = async (req, res) => {
  try {
    const username = req.body.username;
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_REFRESH,
      { expiresIn: "7d" }
    );

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      secure: process.env.NODE_ENV === "production" // Set secure flag in production
    });

    // Send access token in response header and both tokens in response body
    res.header("Authorization", `Bearer ${accessToken}`).json({ accessToken, refreshToken });
  } catch (error) {
    // Handle any errors and send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

