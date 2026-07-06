document.addEventListener('DOMContentLoaded', () => {
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));

    // If no items are found in localStorage, show an error message
    if (!basketItems || basketItems.length === 0) {
        document.getElementById('recipeContainer').innerHTML = "<p class='error'>No ingredients provided.</p>";
        return;
    }

    // Fetch recipes using the basket items
    fetchRecipes(basketItems);
});

function fetchRecipes(ingredients) {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = "<p class='loading'>Loading recipes...</p>"; // Show loading message

    const apiUrl = `http://localhost:3000/api/recipes?ingredients=${encodeURIComponent(ingredients.join(','))}&addRecipeInformation=true`;

    // Fetch the recipes from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipeContainer.innerHTML = ''; // Clear loading message

            if (!data || data.length === 0) {
                recipeContainer.innerHTML = "<p class='error'>No recipes found for the given ingredients.</p>";
                return;
            }

            data.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.className = 'recipe';

                // Add recipe details (only title, image, and ingredients)
                recipeDiv.innerHTML = `
                <h2>${recipe.title || recipe.name}</h2>
                <ul>
                    ${recipe.ingredients ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('') : ''}
                </ul>
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}" />` : ''}
                `;

                // Search for recipe videos using YouTube API
                searchRecipeVideos(recipe.title, recipeDiv);

                recipeContainer.appendChild(recipeDiv);
            });
        })
        .catch(error => {
            recipeContainer.innerHTML = "<p class='error'>No recipes found for the given ingredients.</p>";
            console.error('Error fetching recipes:', error);
        });
}

function searchRecipeVideos(query, recipeDiv) {
    const youtubeApiKey = 'AIzaSyB_CFzUt5AQClCcv1yG7E5DU-hvW-LzRyw';  // Replace with your YouTube API key
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)} recipe&key=${youtubeApiKey}`;

    fetch(youtubeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId; // Get the first video ID
                const videoUrl = `https://www.youtube.com/embed/${videoId}`;  // Use embed URL format

                // Create and append video iframe
                const videoIframe = document.createElement('iframe');
                videoIframe.src = videoUrl;
                videoIframe.width = "100%";
                videoIframe.height = "300px";
                videoIframe.frameBorder = "0";
                videoIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                videoIframe.allowFullscreen = true;

                recipeDiv.appendChild(videoIframe);
            } else {
                const noVideoMessage = document.createElement('p');
                noVideoMessage.textContent = 'No video available for this recipe.';
                recipeDiv.appendChild(noVideoMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching video:', error);
            const noVideoMessage = document.createElement('p');
            noVideoMessage.textContent = 'Error fetching video.';
            recipeDiv.appendChild(noVideoMessage);
        });
}
