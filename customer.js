// customer.js

document.addEventListener("DOMContentLoaded", () => {
    loadCustomers();
    generateCustomerID(); // Auto-generate ID on page load
});

// --- Auto Generate Customer ID ---
function generateCustomerID() {
    if (customers.length === 0) {
        document.getElementById("txtCustId").value = "C001";
    } else {
        let lastCustomer = customers[customers.length - 1];
        let lastId = lastCustomer.id; // Example: "C003"
        let number = parseInt(lastId.substring(1)) + 1; // Extracts "003", makes it 4
        document.getElementById("txtCustId").value = "C" + number.toString().padStart(3, '0');
    }
}

// --- 1. Load All Customers ---
function loadCustomers(data = customers) {
    let tbody = document.getElementById("tblCustomerBody");
    tbody.innerHTML = "";
    
    data.forEach(c => {
        tbody.innerHTML += `
            <tr style="cursor:pointer;" onclick="selectCustomer('${c.id}')">
                <td class="fw-bold">${c.id}</td>
                <td>${c.name}</td>
                <td>${c.address}</td>
                <td>LKR ${c.salary}</td>
            </tr>
        `;
    });
}

// --- 2. Select Customer (Click Row to Edit) ---
window.selectCustomer = function(id) {
    let customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById("txtCustId").value = customer.id;
        document.getElementById("txtCustName").value = customer.name;
        document.getElementById("txtCustAddress").value = customer.address;
        document.getElementById("txtCustSalary").value = customer.salary;
    }
}

// --- 3. Clear Form ---
document.getElementById("btnClearCust").addEventListener("click", clearForm);

function clearForm() {
    document.getElementById("txtCustName").value = "";
    document.getElementById("txtCustAddress").value = "";
    document.getElementById("txtCustSalary").value = "";
    generateCustomerID(); // Generate a new ID when clearing the form
}

// --- 4. Save Customer ---
document.getElementById("btnSaveCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let salary = document.getElementById("txtCustSalary").value.trim();

    if (!id || !name || !address || !salary) {
        alert("All fields are required!"); return;
    }

    if (customers.find(c => c.id === id)) {
        alert("Customer ID already exists! Please use Update."); return;
    }

    customers.push({ id, name, address, salary });
    saveData(); 
    loadCustomers();
    if (typeof loadCustomerDropdown === 'function') loadCustomerDropdown();

    clearForm();
    alert("Customer Saved!");
});

// --- 5. Update Customer ---
document.getElementById("btnUpdateCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let index = customers.findIndex(c => c.id === id);

    if (index === -1) {
        alert("Customer not found!"); return;
    }

    customers[index].name = document.getElementById("txtCustName").value;
    customers[index].address = document.getElementById("txtCustAddress").value;
    customers[index].salary = document.getElementById("txtCustSalary").value;

    saveData();
    loadCustomers();
    if (typeof loadCustomerDropdown === 'function') loadCustomerDropdown();
    clearForm();
    alert("Customer Updated!");
});

// --- 6. Delete Customer ---
document.getElementById("btnDeleteCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let index = customers.findIndex(c => c.id === id);

    if (index === -1) {
        alert("Customer not found!"); return;
    }

    if(confirm("Are you sure you want to delete this customer?")) {
        customers.splice(index, 1);
        saveData();
        loadCustomers();
        if (typeof loadCustomerDropdown === 'function') loadCustomerDropdown();
        clearForm();
    }
});

// --- 7. Search Customer ---
document.getElementById("btnSearchCust").addEventListener("click", () => {
    let query = document.getElementById("txtSearchCust").value.toLowerCase();
    let filtered = customers.filter(c => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query));
    loadCustomers(filtered);
});

document.getElementById("btnViewAllCust").addEventListener("click", () => {
    document.getElementById("txtSearchCust").value = "";
    loadCustomers();
});