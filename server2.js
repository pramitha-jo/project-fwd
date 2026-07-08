const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://tastebudtoolkit:z2S47jGiRHpj33It@cluster0.fqxaq.mongodb.net/feedback?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Routes

// Save feedback
app.post("/feedback", async (req, res) => {
  try {
    const { ingredient, category } = req.body;

    if (!ingredient || !category) {
      return res.status(400).send("Ingredient and category are required.");
    }

    const feedback = new Feedback({ ingredient, category });
    await feedback.save();
    console.log("Feedback saved:", feedback);
    res.status(201).send("Feedback submitted successfully.");
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).send("Failed to submit feedback.");
  }
});


// Get all feedback
app.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch feedback data." });
  }
});


// DELETE route to remove feedback by ID
app.delete('/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID format.');
    }

    const result = await Feedback.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send('Feedback not found.');
    }

    res.status(200).send('Feedback deleted successfully.');
  } catch (error) {
    console.error('Error in DELETE route:', error);
    res.status(500).send('Failed to delete feedback.');
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
