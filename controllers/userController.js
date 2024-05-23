const User = require("../models/User.model");

//controller function to create super admin
exports.createSuperAdmin = async (req, res) => {
  try {
    // Check if the username provided already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new super admin user
    const user = new User({
      username: req.body.username,
      password: req.body.password,
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
