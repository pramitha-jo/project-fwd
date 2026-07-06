// Scrolling function
function scrollWin(x, y) {
    window.scrollBy(x, y);
}


// Sign In function
async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value; // Get selected role
    const errorMsg = document.getElementById("error-msg");

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Redirect based on role
            if (data.role === "Admin") {
                window.location.href = "admin.html"; // Redirect to admin page
            } else {
                window.location.href = "recipes.html"; // Redirect to user page
            }
        } else {
            errorMsg.textContent = data.msg || "Login failed. Please try again.";
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        errorMsg.textContent = "An error occurred. Please try again later.";
    }
}

// Show Sign-Up Form
function showSignUp() {
    document.getElementById("sign-in-form").style.display = "none";
    document.getElementById("sign-up-form").style.display = "block";
}

// Show Sign-In Form
function showSignIn() {
    document.getElementById("sign-up-form").style.display = "none";
    document.getElementById("sign-in-form").style.display = "block";
}

// Sign Up function
async function signUp() {
    const newEmail = document.getElementById("new-email").value;
    const newPassword = document.getElementById("new-password").value;
    const role = document.getElementById("role1").value; // Get selected role
    const signUpMsg = document.getElementById("sign-up-msg");

    if (!newEmail || !newPassword || !role) {
        signUpMsg.textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: newEmail, password: newPassword, role }),
        });

        const data = await response.json();
        if (response.ok) {
            signUpMsg.textContent = "Sign-up successful! You can now sign in.";
            showSignIn(); // Show sign-in form
        } else {
            signUpMsg.textContent = data.msg || "Sign-up failed. Please try again.";
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        signUpMsg.textContent = "An error occurred. Please try again later.";
    }
}


// Save changes made by the admin
function saveContent() {
    const editableParagraph = document.getElementById("editable-paragraph");
    localStorage.setItem("editableContent", editableParagraph.innerText);
    alert("Content saved successfully!");
}

// Load saved content on page load
window.onload = function () {
    const savedContent = localStorage.getItem("editableContent");
    if (savedContent) {
        document.getElementById("editable-paragraph").innerText = savedContent;
    }

    // Add event listeners to detect Enter key press on sign-in and sign-up forms
    const signInForm = document.getElementById("sign-in-form");
    const signUpForm = document.getElementById("sign-up-form");

    signInForm.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signIn();
        }
    });

    signUpForm.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signUp();
        }
    });
};
