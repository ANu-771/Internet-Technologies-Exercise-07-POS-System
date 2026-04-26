import { customers, items, orders } from '../db/db.js';

document.addEventListener('DOMContentLoaded', () => {
    // Disable tab key default focusing (From PDF Requirements)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    });

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mainNavbar = document.getElementById('mainNavbar');
    const appContent = document.getElementById('appContent');
    const pages = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.custom-navbar .nav-link');

    function updateDashboard() {
        document.getElementById('dashTotalCustomers').innerText = customers.length;
        document.getElementById('dashTotalItems').innerText = items.length;
        let today = new Date().toISOString().split('T')[0]; 
        let todaysOrders = orders.filter(order => order.date === today);
        let todaysIncome = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('dashTodaysIncome').innerText = "Rs. " + todaysIncome.toFixed(2);
    }

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login').classList.remove('active-section');
        appContent.classList.remove('d-none');
        mainNavbar.classList.remove('d-none');
        document.getElementById('home').classList.add('active-section');
        updateDashboard();
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pages.forEach(page => page.classList.remove('active-section'));
        appContent.classList.add('d-none');
        mainNavbar.classList.add('d-none');
        document.getElementById('login').classList.add('active-section');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            pages.forEach(page => page.classList.remove('active-section'));

            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active-section');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateDashboard();
        });
    });
});