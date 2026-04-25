// item.js

document.addEventListener("DOMContentLoaded", () => {
    loadItems();
    generateItemCode(); // Auto-generate ID on page load
});

// --- Auto Generate Item Code ---
function generateItemCode() {
    if (items.length === 0) {
        document.getElementById("txtItemCode").value = "I001";
    } else {
        let lastItem = items[items.length - 1];
        let lastCode = lastItem.code; // Example: "I003"
        let number = parseInt(lastCode.substring(1)) + 1; // Extracts "003", makes it 4
        document.getElementById("txtItemCode").value = "I" + number.toString().padStart(3, '0');
    }
}

// --- 1. Load All Items ---
function loadItems(data = items) {
    let tbody = document.getElementById("tblItemBody");
    tbody.innerHTML = "";
    
    data.forEach(i => {
        tbody.innerHTML += `
            <tr style="cursor:pointer;" onclick="selectItem('${i.code}')">
                <td class="fw-bold">${i.code}</td>
                <td>${i.name}</td>
                <td>Rs. ${parseFloat(i.price).toFixed(2)}</td>
                <td>${i.qty}</td>
            </tr>
        `;
    });
}

// --- 2. Select Item (Click Row to Edit) ---
window.selectItem = function(code) {
    let item = items.find(i => i.code === code);
    if (item) {
        document.getElementById("txtItemCode").value = item.code;
        document.getElementById("txtItemName").value = item.name;
        document.getElementById("txtItemPrice").value = item.price;
        document.getElementById("txtItemQty").value = item.qty;
    }
}

// --- 3. Clear Form ---
document.getElementById("btnClearItem").addEventListener("click", clearItemForm);

function clearItemForm() {
    document.getElementById("txtItemName").value = "";
    document.getElementById("txtItemPrice").value = "";
    document.getElementById("txtItemQty").value = "";
    generateItemCode(); // Generate a new ID when clearing the form
}

// --- 4. Save Item ---
document.getElementById("btnSaveItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let name = document.getElementById("txtItemName").value.trim();
    let price = parseFloat(document.getElementById("txtItemPrice").value);
    let qty = parseInt(document.getElementById("txtItemQty").value);

    if (!code || !name || isNaN(price) || isNaN(qty)) {
        alert("All fields are required and must be valid!"); return;
    }

    if (items.find(i => i.code === code)) {
        alert("Item Code already exists! Please use Update."); return;
    }

    items.push({ code, name, price, qty });
    saveData();
    loadItems();
    if (typeof loadItemDropdown === 'function') loadItemDropdown();

    clearItemForm();
    alert("Item Saved!");
});

// --- 5. Update Item ---
document.getElementById("btnUpdateItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let index = items.findIndex(i => i.code === code);

    if (index === -1) {
        alert("Item not found!"); return;
    }

    items[index].name = document.getElementById("txtItemName").value;
    items[index].price = parseFloat(document.getElementById("txtItemPrice").value);
    items[index].qty = parseInt(document.getElementById("txtItemQty").value);

    saveData();
    loadItems();
    if (typeof loadItemDropdown === 'function') loadItemDropdown();

    clearItemForm();
    alert("Item Updated!");
});

// --- 6. Delete Item ---
document.getElementById("btnDeleteItem").addEventListener("click", () => {
    let code = document.getElementById("txtItemCode").value.trim();
    let index = items.findIndex(i => i.code === code);

    if (index === -1) {
        alert("Item not found!"); return;
    }

    if(confirm("Are you sure you want to delete this item?")) {
        items.splice(index, 1);
        saveData();
        loadItems();
        if (typeof loadItemDropdown === 'function') loadItemDropdown();
        clearItemForm();
    }
});

// --- 7. Search Item ---
document.getElementById("btnSearchItem").addEventListener("click", () => {
    let query = document.getElementById("txtSearchItem").value.toLowerCase();
    let filtered = items.filter(i => i.code.toLowerCase().includes(query) || i.name.toLowerCase().includes(query));
    loadItems(filtered);
});

document.getElementById("btnViewAllItem").addEventListener("click", () => {
    document.getElementById("txtSearchItem").value = "";
    loadItems();
});