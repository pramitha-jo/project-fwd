// Fetch feedback from the backend and display it in the admin dashboard
async function fetchFeedback() {
  try {
    // Fetch feedback data from the server
    const response = await fetch('http://localhost:4000/feedback'); // Adjust URL if needed
    const feedbacks = await response.json();

    // Select the feedback list container
    const feedbackListDiv = document.getElementById('feedbackList');
    feedbackListDiv.innerHTML = '';

    // Check if there is feedback data
    if (!feedbacks.length) {
      feedbackListDiv.innerHTML = '<p>No feedback available.</p>';
      return;
    }

    // Iterate over feedbacks and create HTML elements for each
    feedbacks.forEach((feedback) => {
      const feedbackItem = document.createElement('div');
      feedbackItem.className = 'feedback-card';
      feedbackItem.style.border = '1px solid #ddd';
      feedbackItem.style.padding = '10px';
      feedbackItem.style.marginBottom = '10px';
      feedbackItem.style.borderRadius = '5px';
      feedbackItem.innerHTML = `
        <p><strong>Ingredient:</strong> ${feedback.ingredient}</p>
        <p><strong>Category:</strong> ${feedback.category}</p>
        <button onclick="addToRecipes('${feedback.ingredient}')">Add to Recipes</button>
      `;
      feedbackListDiv.appendChild(feedbackItem);
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
  }
}

// Add feedback ingredient to recipes
function addToRecipes(ingredient) {
  alert(`Ingredient "${ingredient}" added to recipes.`);
  // Implement recipe addition logic here if needed
}

// Fetch feedback on page load
fetchFeedback();
// Add feedback ingredient to recipes and delete from the list
async function addToRecipes(ingredient, id) {
  try {
    // Display a success message
    const successMessage = document.createElement('div');
    successMessage.textContent = `Ingredient "${ingredient}" added successfully!`;
    successMessage.style.color = 'green';
    successMessage.style.margin = '10px 0';
    successMessage.style.textAlign = 'center';
    document.body.prepend(successMessage);

    // Remove the success message after 3 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
    

    // Find and remove the feedback item from the page
    const feedbackItem = document.querySelector(`[data-id="${id}"]`);
    function addToRecipes(id) {
      // Find the feedback item element
      const feedbackItem = document.querySelector(`[data-id="${id}"]`);
  
      // Check if the item already has the class to prevent hiding multiple times
      if (!feedbackItem.classList.contains('hidden')) {
          feedbackItem.classList.add('hidden'); // Hide the feedback item
      }
  }
  
  

  } catch (error) {
    console.error('Error handling feedback:', error);
    alert('Failed to process feedback.');
  }
}

// Ensure the correct `_id` is passed to the function
feedbacks.forEach((feedback) => {
  const feedbackItem = document.createElement('div');
  feedbackItem.className = 'feedback-card';
  feedbackItem.setAttribute('data-id', feedback._id); // Add a data attribute for easy identification
  feedbackItem.innerHTML = `
    <p><strong>Ingredient:</strong> ${feedback.ingredient}</p>
    <p><strong>Category:</strong> ${feedback.category}</p>
    <button onclick="addToRecipes('${feedback.ingredient}', '${feedback._id}')">Add to Recipes</button>
  `;
  feedbackListDiv.appendChild(feedbackItem);
});
