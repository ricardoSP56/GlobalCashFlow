
// Function to verify JWT token with server
async function isTokenValid(token) {
    try {
        const response = await fetch('http://localhost:3000/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.valid; // Assuming the server responds with { valid: true/false }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

// Function to check authentication status on page load
async function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, redirecting to login page');
        //window.location.href = 'login.html'; // Redirect to login page if no token
        return;
    }

  

    console.log('Token is valid');
    // Token is valid, you can proceed to load the rest of the page or perform other actions
}

// Execute the check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});
