// Function to display suggestions while typing, based on table number
function showSuggestions(tableNumber) {
    const input = document.getElementById(`searchInput${tableNumber}`).value.toLowerCase();
    const table = document.getElementById(`itemTable${tableNumber}`);
    const rows = table.getElementsByTagName("tr");
    const suggestionsBox = document.getElementById(`suggestions${tableNumber}`);

    suggestionsBox.innerHTML = ''; // Clear previous suggestions

    if (input === '') {
        suggestionsBox.style.display = 'none';
        return;
    }

    let suggestions = [];
    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[0];
        const textValue = td.textContent || td.innerText;
        if (textValue.toLowerCase().indexOf(input) > -1) {
            suggestions.push(textValue);
        }
    }

    // Show suggestions if available
    if (suggestions.length > 0) {
        suggestionsBox.style.display = 'block';
        suggestions.forEach(item => {
            const div = document.createElement("div");
            div.textContent = item;
            div.onclick = function() {
                document.getElementById(`searchInput${tableNumber}`).value = item;
                suggestionsBox.style.display = 'none';
                searchTable(tableNumber);
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = 'none';
    }
}

// Function to search and scroll to the item, based on table number
function searchTable(tableNumber) {
    const input = document.getElementById(`searchInput${tableNumber}`).value.toLowerCase();
    const table = document.getElementById(`itemTable${tableNumber}`);
    const rows = table.getElementsByTagName("tr");

    let found = false;
    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[0];
        const textValue = td.textContent || td.innerText;
        if (textValue.toLowerCase() === input) {
            rows[i].classList.add("highlight");
            rows[i].scrollIntoView({ behavior: "smooth", block: "center" });
            found = true;
            break;
        } else {
            rows[i].classList.remove("highlight");
        }
    }

    if (!found) {
        alert("Item not found!");
    }
}

// Function to add selected item to the basket and animate it
// Function to select an item and add it to the basket
function selectItem(itemName) {
    const basket = document.getElementById("basket");

    // Create a new list item for the basket
    const listItem = document.createElement("li");
    listItem.textContent = itemName;

    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() {
        basket.removeChild(listItem); // Remove the item from the basket
    };

    listItem.appendChild(deleteBtn);
    listItem.classList.add("falling-item");

    // Append the item to the basket with falling effect
    basket.appendChild(listItem);
    setTimeout(() => {
        listItem.classList.remove("falling-item"); // Remove the animation after it falls
    }, 1000); // Animation duration
}

function findRecipes() {
    const basketItems = [];
    const basketList = document.getElementById('basket').getElementsByTagName('li');
    for (let i = 0; i < basketList.length; i++) {
        basketItems.push(basketList[i].textContent);
    }
    localStorage.setItem('basketItems', JSON.stringify(basketItems)); // Store items in localStorage

    // Redirect to the new page with the recipes
    window.location.href = "finder1.html";
}

