import { users } from '../db/db.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        let usernameVal = document.getElementById('txtUsername').value.trim();
        let passwordVal = document.getElementById('txtPassword').value.trim();
        let validUser = users.find(u => u.username === usernameVal && u.password === passwordVal);

        if (validUser) {
            document.dispatchEvent(new Event('loginSuccess'));
            
            // SUCCESS ALERT
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: `Logged in as ${validUser.username}`,
                confirmButtonColor: '#8cc63f', // CityMart Green
                timer: 2000 // Auto-closes after 2 seconds!
            });
            
        } else {
            // ERROR ALERT
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Invalid Username or Password! Please try again.',
                confirmButtonColor: '#f43f5e' // Red color for error
            });
            
            document.getElementById('txtPassword').value = ""; 
        }
    });
});