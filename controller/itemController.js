import { items } from '../db/db.js';
import { Item } from '../model/itemModel.js';

document.addEventListener("DOMContentLoaded", () => {
    generateItemCode();
    loadItems();
});

function generateItemCode() {
    if (items.length === 0) {
        document.getElementById("txtItemCode").value = "I001";
    } else {
        let lastCode = items[items.length - 1].code;
        let number = parseInt(lastCode.substring(1)) + 1;
        document.getElementById("txtItemCode").value = "I" + number.toString().padStart(3, '0');
    }
}

function loadItems(data = items) {
    let tbody = document.getElementById("tblItemBody");
    tbody.innerHTML = "";
    data.forEach(i => {
        let tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.innerHTML = `<td class="fw-bold">${i.code}</td><td>${i.name}</td><td>Rs. ${parseFloat(i.price).toFixed(2)}</td><td>${i.qty}</td>`;
        tr.addEventListener("click", () => selectItem(i.code));
        tbody.appendChild(tr);
    });
}

function selectItem(code) {
    let item = items.find(i => i.code === code);
    if (item) {
        document.getElementById("txtItemCode").value = item.code;
        document.getElementById("txtItemName").value = item.name;
        document.getElementById("txtItemPrice").value = item.price;
        document.getElementById("txtItemQty").value = item.qty;
    }
}

function clearItemForm() {
    document.getElementById("txtItemName").value = "";
    document.getElementById("txtItemPrice").value = "";
    document.getElementById("txtItemQty").value = "";
    generateItemCode();
}

document.getElementById("btnClearItem").addEventListener("click", clearItemForm);

// document.getElementById("btnSaveItem").addEventListener("click", () => {
//     let code = document.getElementById("txtItemCode").value.trim();
//     let name = document.getElementById("txtItemName").value.trim();
//     let price = parseFloat(document.getElementById("txtItemPrice").value);
//     let qty = parseInt(document.getElementById("txtItemQty").value);

//     if (!code || !name || isNaN(price) || isNaN(qty)) { alert("All fields are required and must be valid!"); return; }
//     if (items.find(i => i.code === code)) { alert("Item Code already exists! Please use Update."); return; }

//     items.push(new Item(code, name, price, qty));
//     loadItems();
//     clearItemForm();
//     document.dispatchEvent(new Event('itemUpdated')); 
//     alert("Item Saved!");
// });

// document.getElementById("btnUpdateItem").addEventListener("click", () => {
//     let code = document.getElementById("txtItemCode").value.trim();
//     let index = items.findIndex(i => i.code === code);
//     if (index === -1) { alert("Item not found!"); return; }

//     items[index].name = document.getElementById("txtItemName").value;
//     items[index].price = parseFloat(document.getElementById("txtItemPrice").value);
//     items[index].qty = parseInt(document.getElementById("txtItemQty").value);

//     loadItems();
//     clearItemForm();
//     document.dispatchEvent(new Event('itemUpdated'));
//     alert("Item Updated!");
// });


// --- REGEX PATTERNS FOR ITEM ---
// Item Name: Letters, numbers, and spaces. 3 to 50 characters.
const itemNameRegex = /^[A-Za-z0-9 ]{3,50}$/;
// Price: Positive numbers only, optional up to 2 decimal places.
const priceRegex = /^\d+(\.\d{1,2})?$/;
// Quantity: Whole positive numbers only.
const qtyRegex = /^\d+$/;

// --- Save Item ---
document.getElementById("btnSaveItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let name = document.getElementById("txtItemName").value.trim();
    let priceString = document.getElementById("txtItemPrice").value.trim();
    let qtyString = document.getElementById("txtItemQty").value.trim();

    // 1. Check if empty
    if (!code || !name || !priceString || !qtyString) { 
        alert("All fields are required!"); 
        return; 
    }

    // 2. Regex Validation Checks
    if (!itemNameRegex.test(name)) {
        alert("Invalid Item Name! Please use 3-50 characters.");
        return;
    }
    if (!priceRegex.test(priceString)) {
        alert("Invalid Price! Please enter a valid number (e.g., 150 or 150.50).");
        return;
    }
    if (!qtyRegex.test(qtyString)) {
        alert("Invalid Quantity! Please enter a whole number.");
        return;
    }

    if (items.find(i => i.code === code)) { alert("Item Code already exists! Please use Update."); return; }

    // Parse the numbers only AFTER they pass regex validation
    let price = parseFloat(priceString);
    let qty = parseInt(qtyString);

    items.push(new Item(code, name, price, qty));
    loadItems();
    clearItemForm();
    document.dispatchEvent(new Event('itemUpdated')); 
    alert("Item Saved Successfully!");
});

// --- Update Item ---
document.getElementById("btnUpdateItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let name = document.getElementById("txtItemName").value.trim();
    let priceString = document.getElementById("txtItemPrice").value.trim();
    let qtyString = document.getElementById("txtItemQty").value.trim();
    
    let index = items.findIndex(i => i.code === code);
    if (index === -1) { alert("Item not found!"); return; }

    // Regex Validation Checks for Update
    if (!itemNameRegex.test(name)) {
        alert("Invalid Item Name! Please use 3-50 characters.");
        return;
    }
    if (!priceRegex.test(priceString)) {
        alert("Invalid Price! Please enter a valid number.");
        return;
    }
    if (!qtyRegex.test(qtyString)) {
        alert("Invalid Quantity! Please enter a whole number.");
        return;
    }

    items[index].name = name;
    items[index].price = parseFloat(priceString);
    items[index].qty = parseInt(qtyString);

    loadItems();
    clearItemForm();
    document.dispatchEvent(new Event('itemUpdated'));
    alert("Item Updated Successfully!");
});

document.getElementById("btnDeleteItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let index = items.findIndex(i => i.code === code);
    if (index === -1) return;

    if(confirm("Are you sure you want to delete this item?")) {
        items.splice(index, 1);
        loadItems();
        clearItemForm();
        document.dispatchEvent(new Event('itemUpdated'));
    }
});

document.getElementById("btnSearchItem").addEventListener("click", () => {
    let query = document.getElementById("txtSearchItem").value.toLowerCase();
    let filtered = items.filter(i => i.code.toLowerCase().includes(query) || i.name.toLowerCase().includes(query));
    loadItems(filtered);
});

document.getElementById("btnViewAllItem").addEventListener("click", () => {
    document.getElementById("txtSearchItem").value = "";
    loadItems();
});