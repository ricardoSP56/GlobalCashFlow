const apiUrl = 'http://localhost:3000';

function toggleForms() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
    registerForm.style.display = registerForm.style.display === "none" ? "block" : "none";
}

async function register() {
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            throw new Error('Invalid JSON response from server.');
        }

        if (response.ok) {
            alert('Registration successful!');
            localStorage.setItem('token', data.token);
            toggleForms();
        } else {
            alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}


async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

async function convert() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("from").value;
    const toCurrency = document.getElementById("to").value;
    const apiKey = 'd558963dc9-32cd47d85a-se515r';
    const url = `https://api.fastforex.io/fetch-all?api_key=${apiKey}`;

    const options = { method: 'GET', headers: { accept: 'application/json' } };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (data.results.hasOwnProperty(toCurrency)) {
                const exchangeRate = data.results[toCurrency];
                const convertedAmount = amount * exchangeRate;
                const resultMessage = amount + " " + fromCurrency + " is equivalent to " + convertedAmount.toFixed(2) + " " + toCurrency + ".";
                document.getElementById("result").innerHTML = resultMessage;
            } else {
                document.getElementById("result").innerHTML = "Error obtaining exchange rates. Please try again later.";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById("result").innerHTML = "Error obtaining exchange rates. Please try again later.";
        });

        
}





