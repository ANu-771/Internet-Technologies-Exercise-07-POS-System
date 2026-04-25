// db.js - In-Memory Arrays (Linked to LocalStorage)

// Initialize arrays. If data exists in LocalStorage, parse it. Otherwise, use empty arrays [].
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let items = JSON.parse(localStorage.getItem("items")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Function to save arrays back to LocalStorage
function saveData() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("orders", JSON.stringify(orders));
}

// --- DUMMY DATA FOR TESTING ---
// If the arrays are empty, let's push some dummy data so you can test Place Order immediately
if (customers.length === 0) {
    customers.push({ id: "C001", name: "Nadeja Kalhara", address: "Matara", salary: "48000" });
    customers.push({ id: "C002", name: "Kasun Gunasekara", address: "Galle", salary: "35000" });
    saveData();
}

if (items.length === 0) {
    items.push({ code: "I001", name: "Sugar 1kg", price: 240.00, qty: 50 });
    items.push({ code: "I002", name: "Rice 5kg", price: 880.00, qty: 25 });
    saveData();
}