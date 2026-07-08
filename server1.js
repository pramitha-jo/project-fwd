const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = "1e6fa61977b38b99dba287b19428d139e788e6fb1072f13adddf6072c7b1c7f63841da5f3308ae3e7a66b931bf4cfc86e1e5b1891cf28ffade7cb15f7828bcbc";

// MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://tastebudtoolkit:z2S47jGiRHpj33It@cluster0.fqxaq.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI, { retryWrites: true, w: "majority" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "Admin" or "User"
});

const User = mongoose.model("User", userSchema);

// Define Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Sign-Up Endpoint
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Add Feedback Endpoint
app.post("/api/feedback/add", verifyToken, async (req, res) => {
  const { ingredient, category } = req.body;

  if (!ingredient || !category) {
    return res.status(400).json({ msg: "Ingredient and category are required" });
  }

  try {
    const feedback = new Feedback({ ingredient, category });
    await feedback.save();
    res.status(201).json({ msg: "Feedback added successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get Feedback List (Admin Only)
app.get("/api/feedback/list", verifyToken, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Verify Endpoint
app.get("/api/auth/verify", verifyToken, (req, res) => {
  res.status(200).json({ role: req.user.role });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
