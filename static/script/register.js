const registerForm = document.getElementById("registerForm");
// Authentication Functions
async function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = '/login';
        } else {
            alert('Error registering user.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error registering user.');
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    if (registerForm) registerForm.addEventListener("submit", handleRegistration);
});


