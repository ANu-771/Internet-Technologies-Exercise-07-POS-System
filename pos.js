// pos.js

let cart = []; // Array to hold items for the current order

document.addEventListener("DOMContentLoaded", () => {
    // Set today's date
    document.getElementById("txtDate").valueAsDate = new Date();
    
    // Load dropdowns from bd.js arrays
    loadCustomerDropdown();
    loadItemDropdown();
    generateOrderID(); // Auto-generate Order ID on page load

});

// --- Auto Generate Order ID ---
function generateOrderID() {
    if (orders.length === 0) {
        document.getElementById("txtOrderId").value = "ORD-001";
    } else {
        let lastOrder = orders[orders.length - 1];
        let lastId = lastOrder.orderId; // Example: "ORD-002"
        let number = parseInt(lastId.split("-")[1]) + 1; // Splits "ORD-002" at the "-", takes "002", makes it 3
        document.getElementById("txtOrderId").value = "ORD-" + number.toString().padStart(3, '0');
    }
}



// --- 1. Load Data into Dropdowns ---
function loadCustomerDropdown() {
    let cmb = document.getElementById("cmbCustomer");
    cmb.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(c => {
        cmb.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`;
    });
}

function loadItemDropdown() {
    let cmb = document.getElementById("cmbItem");
    cmb.innerHTML = '<option value="">Select Item</option>';
    items.forEach(i => {
        // This formats the dropdown to look like "I001 - Sugar 1kg"
        cmb.innerHTML += `<option value="${i.code}">${i.code} - ${i.name}</option>`;
    });
}

// --- 2. Auto-fill details when Dropdowns change ---
document.getElementById("cmbCustomer").addEventListener("change", (e) => {
    let selectedId = e.target.value;
    let customer = customers.find(c => c.id === selectedId);
    if (customer) {
        document.getElementById("txtCustomerAddress").value = customer.address;
        document.getElementById("txtCustomerSalary").value = customer.salary;
    } else {
        document.getElementById("txtCustomerAddress").value = "";
        document.getElementById("txtCustomerSalary").value = "";
    }
});

// UPDATED ITEM DROPDOWN LISTENER
document.getElementById("cmbItem").addEventListener("change", (e) => {
    let selectedCode = e.target.value;
    let item = items.find(i => i.code === selectedCode);
    
    if (item) {
        // Auto-fills using the NEW Unique IDs
        document.getElementById("txtPOItemCode").value = item.code;
        document.getElementById("txtPOItemName").value = item.name;
        document.getElementById("txtPOItemPrice").value = item.price.toFixed(2);
        document.getElementById("txtQtyOnHand").value = item.qty;
    } else {
        // Clears the boxes if "Select Item" is chosen
        document.getElementById("txtPOItemCode").value = "";
        document.getElementById("txtPOItemName").value = "";
        document.getElementById("txtPOItemPrice").value = "";
        document.getElementById("txtQtyOnHand").value = "";
    }
});

// --- 3. Add Item to Cart ---
document.getElementById("btnAddCart").addEventListener("click", () => {
    let itemCode = document.getElementById("cmbItem").value;
    let orderQty = parseInt(document.getElementById("txtOrderQty").value);

    if (!itemCode || !orderQty || orderQty <= 0) {
        alert("Please select a valid item and enter a quantity!");
        return;
    }

    let item = items.find(i => i.code === itemCode);

    if (orderQty > item.qty) {
        alert("Not enough stock available!");
        return;
    }

    // Check if item is already in cart, update qty if true
    let cartItem = cart.find(c => c.code === itemCode);
    if (cartItem) {
        cartItem.qty += orderQty;
        cartItem.total = cartItem.qty * cartItem.price;
    } else {
        cart.push({
            code: item.code,
            name: item.name,
            price: item.price,
            qty: orderQty,
            total: item.price * orderQty
        });
    }

    updateCartTable();
    calculateTotals();
});

// --- 4. Update Cart Table UI ---
function updateCartTable() {
    let tbody = document.getElementById("cartTableBody");
    tbody.innerHTML = "";
    
    cart.forEach((c, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${c.code}</td>
                <td>${c.name}</td>
                <td>${c.price.toFixed(2)}</td>
                <td>${c.qty}</td>
                <td>${c.total.toFixed(2)}</td>
                <td><i class="bi bi-trash-fill fs-5 text-danger action-icon" onclick="removeCartItem(${index})"></i></td>
            </tr>
        `;
    });
}

// Ensure function is available globally for the inline onclick handler
window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartTable();
    calculateTotals();
}

// --- 5. Calculate Totals & Balance ---
function calculateTotals() {
    let total = cart.reduce((sum, item) => sum + item.total, 0);
    let discount = parseFloat(document.getElementById("txtDiscount").value) || 0;
    let subTotal = total - (total * (discount / 100));

    document.getElementById("lblTotal").innerText = `Rs. ${total.toFixed(2)}`;
    document.getElementById("lblSubTotal").innerText = `Rs. ${subTotal.toFixed(2)}`;

    calculateBalance(subTotal);
}

function calculateBalance(subTotal) {
    let cash = parseFloat(document.getElementById("txtCash").value) || 0;
    let balance = cash - subTotal;
    document.getElementById("txtBalance").value = balance.toFixed(2);
}

// Update balance automatically as user types cash/discount
document.getElementById("txtCash").addEventListener("keyup", calculateTotals);
document.getElementById("txtDiscount").addEventListener("keyup", calculateTotals);

// --- 6. Purchase (Save Order) ---
document.getElementById("btnPurchase").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let customerId = document.getElementById("cmbCustomer").value;
    if (!customerId) {
        alert("Please select a customer!");
        return;
    }

    let cash = parseFloat(document.getElementById("txtCash").value) || 0;
    let subTotal = parseFloat(document.getElementById("lblSubTotal").innerText.replace("Rs. ", ""));

    if (cash < subTotal) {
        alert("Insufficient Cash provided!");
        return;
    }

    // Save order
    let order = {
        orderId: document.getElementById("txtOrderId").value,
        date: document.getElementById("txtDate").value,
        customerId: customerId,
        items: cart,
        total: subTotal
    };
    orders.push(order);

    // Reduce stock quantities in the item database
    cart.forEach(cartItem => {
        let item = items.find(i => i.code === cartItem.code);
        if (item) item.qty -= cartItem.qty;
    });

    saveData(); // Calls function from bd.js to save to LocalStorage

    if (typeof loadItems === 'function') loadItems(); 
    if (typeof loadOrders === 'function') loadOrders();

    alert("Order Placed Successfully!");
    
   // Reset Form
    cart = [];
    updateCartTable();
    calculateTotals();
    document.getElementById("txtCash").value = "";
    document.getElementById("txtBalance").value = "";
    document.getElementById("txtOrderQty").value = "";
    document.getElementById("cmbCustomer").value = "";
    document.getElementById("cmbItem").value = "";
    document.getElementById("txtCustomerAddress").value = "";
    document.getElementById("txtCustomerSalary").value = "";
    
    // Clear new Item fields
    document.getElementById("txtPOItemCode").value = "";
    document.getElementById("txtPOItemName").value = "";
    document.getElementById("txtPOItemPrice").value = "";
    document.getElementById("txtQtyOnHand").value = "";

    generateOrderID(); // Generate new Order ID for the next order
});