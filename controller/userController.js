import { users } from '../db/db.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the button from refreshing the page

        //Get the typed values
        let usernameVal = document.getElementById('txtUsername').value.trim();
        let passwordVal = document.getElementById('txtPassword').value.trim();

        //Check if they match ANY user in our database array
        let validUser = users.find(u => u.username === usernameVal && u.password === passwordVal);

        // Validation Logic
        if (validUser) {
            // Success! Send a global signal to let the system open.
            document.dispatchEvent(new Event('loginSuccess'));
            alert(`Welcome back, ${validUser.username}!`);
        } else {
            // Fail! Stop them from entering.
            alert("Invalid Username or Password! Please try again.");
            document.getElementById('txtPassword').value = ""; // Clear the wrong password
        }
    });
});