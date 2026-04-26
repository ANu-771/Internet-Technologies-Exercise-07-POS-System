import { customers, items, orders } from '../db/db.js';
import { OrderDetails } from '../model/orderDetails.js';
import { Orders } from '../model/orderModel.js';

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("txtDate").valueAsDate = new Date();
    generateOrderID();
    loadCustomerDropdown();
    loadItemDropdown();
    loadOrders();
});

// Listen for updates from other controllers to refresh dropdowns
document.addEventListener("customerUpdated", loadCustomerDropdown);
document.addEventListener("itemUpdated", loadItemDropdown);

function generateOrderID() {
    if (orders.length === 0) {
        document.getElementById("txtOrderId").value = "ORD-001";
    } else {
        let lastId = orders[orders.length - 1].orderId;
        let number = parseInt(lastId.split("-")[1]) + 1;
        document.getElementById("txtOrderId").value = "ORD-" + number.toString().padStart(3, '0');
    }
}

function loadCustomerDropdown() {
    let cmb = document.getElementById("cmbCustomer");
    cmb.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(c => cmb.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`);
}

function loadItemDropdown() {
    let cmb = document.getElementById("cmbItem");
    cmb.innerHTML = '<option value="">Select Item</option>';
    items.forEach(i => cmb.innerHTML += `<option value="${i.code}">${i.code} - ${i.name}</option>`);
}

// Auto-fills
document.getElementById("cmbCustomer").addEventListener("change", (e) => {
    let customer = customers.find(c => c.id === e.target.value);
    document.getElementById("txtCustomerAddress").value = customer ? customer.address : "";
    document.getElementById("txtCustomerSalary").value = customer ? customer.salary : "";
});

document.getElementById("cmbItem").addEventListener("change", (e) => {
    let item = items.find(i => i.code === e.target.value);
    document.getElementById("txtPOItemCode").value = item ? item.code : "";
    document.getElementById("txtPOItemName").value = item ? item.name : "";
    document.getElementById("txtPOItemPrice").value = item ? item.price.toFixed(2) : "";
    document.getElementById("txtQtyOnHand").value = item ? item.qty : "";
});

// Cart Logic
document.getElementById("btnAddCart").addEventListener("click", () => {
    let itemCode = document.getElementById("cmbItem").value;
    let orderQty = parseInt(document.getElementById("txtOrderQty").value);
    let item = items.find(i => i.code === itemCode);

    if (!item || !orderQty || orderQty <= 0) { alert("Please select a valid item and enter a quantity!"); return; }
    if (orderQty > item.qty) { alert("Not enough stock available!"); return; }

    let cartItem = cart.find(c => c.itemCode === itemCode);
    if (cartItem) {
        cartItem.qty += orderQty;
        cartItem.total = cartItem.qty * cartItem.price;
    } else {
        cart.push(new OrderDetails(item.code, item.name, item.price, orderQty, item.price * orderQty));
    }

    updateCartTable();
    calculateTotals();
});

function updateCartTable() {
    let tbody = document.getElementById("cartTableBody");
    tbody.innerHTML = "";
    cart.forEach((c, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${c.itemCode}</td><td>${c.itemName}</td><td>${c.price.toFixed(2)}</td><td>${c.qty}</td><td>${c.total.toFixed(2)}</td>
                        <td><i class="bi bi-trash-fill fs-5 text-danger action-icon" id="btnRemove-${index}"></i></td>`;
        tbody.appendChild(tr);
        document.getElementById(`btnRemove-${index}`).addEventListener("click", () => {
            cart.splice(index, 1); updateCartTable(); calculateTotals();
        });
    });
}

function calculateTotals() {
    let total = cart.reduce((sum, item) => sum + item.total, 0);
    let discount = parseFloat(document.getElementById("txtDiscount").value) || 0;
    let subTotal = total - (total * (discount / 100));

    document.getElementById("lblTotal").innerText = `Rs. ${total.toFixed(2)}`;
    document.getElementById("lblSubTotal").innerText = `Rs. ${subTotal.toFixed(2)}`;

    let cash = parseFloat(document.getElementById("txtCash").value) || 0;
    document.getElementById("txtBalance").value = (cash - subTotal).toFixed(2);
}

document.getElementById("txtCash").addEventListener("keyup", calculateTotals);
document.getElementById("txtDiscount").addEventListener("keyup", calculateTotals);

// Purchase Logic
document.getElementById("btnPurchase").addEventListener("click", () => {
    let customerId = document.getElementById("cmbCustomer").value;
    let subTotal = parseFloat(document.getElementById("lblSubTotal").innerText.replace("Rs. ", ""));
    let cash = parseFloat(document.getElementById("txtCash").value) || 0;

    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    if (!customerId) { alert("Please select a customer!"); return; }
    if (cash < subTotal) { alert("Insufficient Cash provided!"); return; }

    let newOrder = new Orders(
        document.getElementById("txtOrderId").value,
        document.getElementById("txtDate").value,
        customerId,
        cart,
        subTotal
    );
    orders.push(newOrder);

    // Reduce stock quantities in the item database
    cart.forEach(cartItem => {
        let item = items.find(i => i.code === cartItem.itemCode);
        if (item) item.qty -= cartItem.qty;
    });

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
    document.getElementById("txtPOItemCode").value = "";
    document.getElementById("txtPOItemName").value = "";
    document.getElementById("txtPOItemPrice").value = "";
    document.getElementById("txtQtyOnHand").value = "";

    generateOrderID();
    document.dispatchEvent(new Event('itemUpdated')); // Triggers live quantity updates
    loadOrders(); // Refresh Order History table
});

function loadOrders() {
    let tbody = document.getElementById("tblOrderBody");
    if (!tbody) return; 
    tbody.innerHTML = ""; 
    orders.forEach(o => {
        let totalItems = o.items.reduce((sum, item) => sum + item.qty, 0);
        let customer = customers.find(c => c.id === o.customerId);
        let custDisplay = customer ? `${customer.name} (${o.customerId})` : o.customerId;

        tbody.innerHTML += `<tr><td class="fw-bold">${o.orderId}</td><td>${custDisplay}</td><td>${o.date}</td><td>${totalItems}</td><td>LKR ${o.total.toFixed(2)}</td><td><button class="btn btn-dark btn-sm px-3 rounded-pill" onclick="alert('Viewing Invoice: ${o.orderId}')">View</button></td></tr>`;
    });
}