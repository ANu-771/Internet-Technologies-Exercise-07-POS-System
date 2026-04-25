// order.js

document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

// --- Load Real-Time Orders into the Table ---
function loadOrders() {
    let tbody = document.getElementById("tblOrderBody");
    if (!tbody) return; // Failsafe if element doesn't exist
    
    tbody.innerHTML = ""; // Clear existing rows
    
    // Loop through the orders array from bd.js
    orders.forEach(o => {
        // Calculate total items in this specific order
        let totalItems = o.items.reduce((sum, item) => sum + item.qty, 0);
        
        // Find customer name for better display (optional)
        let customer = customers.find(c => c.id === o.customerId);
        let custDisplay = customer ? `${customer.name} (${o.customerId})` : o.customerId;

        tbody.innerHTML += `
            <tr>
                <td class="fw-bold">${o.orderId}</td>
                <td>${custDisplay}</td>
                <td>${o.date}</td>
                <td>${totalItems}</td>
                <td>LKR ${o.total.toFixed(2)}</td>
                <td><button class="btn btn-dark btn-sm px-3 rounded-pill" onclick="alert('Viewing Invoice: ${o.orderId}')">View</button></td>
            </tr>
        `;
    });
}