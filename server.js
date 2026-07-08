const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Spoonacular API details
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

// Constant recipes in case no results are found from Spoonacular
const constantRecipes = [
    {
        title: "Classic Pancakes",
        ingredients: ["flour", "milk", "eggs", "baking powder", "sugar", "butter"],
        image: "https://via.placeholder.com/150?text=Classic+Pancakes"
    },
    {
        title: "Scrambled Eggs",
        ingredients: ["egg", "butter", "salt", "pepper"],
        image: "https://via.placeholder.com/150?text=Scrambled+Eggs"
    },
    {
        title: "Tomato Soup",
        ingredients: ["tomatoes", "onion", "garlic", "olive oil", "salt", "pepper"],
        image: "https://via.placeholder.com/150?text=Tomato+Soup"
    }
];

// Route to search for recipes by ingredients
app.get('/api/recipes', async (req, res) => {
    const ingredients = req.query.ingredients
        ? req.query.ingredients.split(',').map(ing => ing.trim().toLowerCase())
        : [];

    console.log('User-provided ingredients:', ingredients);

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Please provide ingredients as a query parameter' });
    }

    try {
        // Fetch recipes from Spoonacular API
        const response = await axios.get(SPOONACULAR_API_URL, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                ingredients: ingredients.join(','),
                number: 10,
            },
        });

        // Check if Spoonacular returned any recipes
        if (response.data && response.data.length > 0) {
            console.log('Recipes found from Spoonacular:', response.data);
            return res.json(response.data);
        } else {
            console.log('No recipes found from Spoonacular, checking constant recipes');

            // Filter constant recipes by matching ingredients
            const matchedConstantRecipes = constantRecipes.filter(recipe =>
                recipe.ingredients.some(ingredient =>
                    ingredients.includes(ingredient.toLowerCase())
                )
            );

            console.log('Matched constant recipes:', matchedConstantRecipes);

            if (matchedConstantRecipes.length > 0) {
                return res.json(matchedConstantRecipes);
            } else {
                return res.json({ message: "No recipes match your ingredients" });
            }
        }
    } catch (err) {
        console.error('Error fetching recipes:', err.message);
        return res.status(500).json({ error: 'Failed to fetch recipes. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
