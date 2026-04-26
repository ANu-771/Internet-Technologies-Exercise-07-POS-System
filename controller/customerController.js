import { customers } from '../db/db.js';
import { Customer } from '../model/customerModel.js';

document.addEventListener("DOMContentLoaded", () => {
    generateCustomerID();
    loadCustomers();
});

function generateCustomerID() {
    if (customers.length === 0) {
        document.getElementById("txtCustId").value = "C001";
    } else {
        let lastId = customers[customers.length - 1].id;
        let number = parseInt(lastId.substring(1)) + 1;
        document.getElementById("txtCustId").value = "C" + number.toString().padStart(3, '0');
    }
}

function loadCustomers(data = customers) {
    let tbody = document.getElementById("tblCustomerBody");
    tbody.innerHTML = "";
    data.forEach(c => {
        let tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.innerHTML = `<td class="fw-bold">${c.id}</td><td>${c.name}</td><td>${c.address}</td><td>${c.phone}</td>`;
        tr.addEventListener("click", () => selectCustomer(c.id));
        tbody.appendChild(tr);
    });
}

function selectCustomer(id) {
    let customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById("txtCustId").value = customer.id;
        document.getElementById("txtCustName").value = customer.name;
        document.getElementById("txtCustAddress").value = customer.address;
        document.getElementById("txtCustPhone").value = customer.phone; 
    }
}

function clearForm() {
    document.getElementById("txtCustName").value = "";
    document.getElementById("txtCustAddress").value = "";
    document.getElementById("txtCustPhone").value = "";
    generateCustomerID();
}

document.getElementById("btnClearCust").addEventListener("click", clearForm);

// document.getElementById("btnSaveCust").addEventListener("click", () => {
//     let id = document.getElementById("txtCustId").value.trim();
//     let name = document.getElementById("txtCustName").value.trim();
//     let address = document.getElementById("txtCustAddress").value.trim();
//     let salary = document.getElementById("txtCustSalary").value.trim();

//     if (!id || !name || !address || !salary) { alert("All fields are required!"); return; }
//     if (customers.find(c => c.id === id)) { alert("Customer ID exists! Use Update."); return; }

//     customers.push(new Customer(id, name, address, salary));
//     loadCustomers();
//     clearForm();
//     document.dispatchEvent(new Event('customerUpdated')); 
//     alert("Customer Saved!");
// });


const nameRegex = /^[A-Za-z ]{3,50}$/;
// Address: Letters, numbers, spaces, commas, and dots. 5 to 100 characters.
const addressRegex = /^[A-Za-z0-9 ,.-]{5,100}$/;
const phoneRegex = /^\d{10}$/;

// --- Save Customer ---
document.getElementById("btnSaveCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let phone = document.getElementById("txtCustPhone").value.trim(); // Swapped

    if (!id || !name || !address || !phone) { alert("All fields are required!"); return; }
    
    if (!nameRegex.test(name)) { alert("Invalid Name! Please use only letters and spaces (3-50 chars)."); return; }
    if (!addressRegex.test(address)) { alert("Invalid Address! Must be between 5 and 100 characters."); return; }
    if (!phoneRegex.test(phone)) { alert("Invalid Phone Number! Must be exactly 10 digits."); return; }

    if (customers.find(c => c.id === id)) { alert("Customer ID exists! Use Update."); return; }

    customers.push(new Customer(id, name, address, phone));
    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated')); 
    alert("Customer Saved Successfully!");
});

// document.getElementById("btnUpdateCust").addEventListener("click", () => {
//     let id = document.getElementById("txtCustId").value.trim();
//     let index = customers.findIndex(c => c.id === id);
//     if (index === -1) { alert("Customer not found!"); return; }

//     customers[index].name = document.getElementById("txtCustName").value;
//     customers[index].address = document.getElementById("txtCustAddress").value;
//     customers[index].salary = document.getElementById("txtCustSalary").value;

//     loadCustomers();
//     clearForm();
//     document.dispatchEvent(new Event('customerUpdated'));
//     alert("Customer Updated!");
// });

// --- Update Customer ---
document.getElementById("btnUpdateCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let phone = document.getElementById("txtCustPhone").value.trim(); // Swapped
    
    let index = customers.findIndex(c => c.id === id);
    if (index === -1) { alert("Customer not found!"); return; }

    if (!nameRegex.test(name)) { alert("Invalid Name! Please use only letters and spaces."); return; }
    if (!addressRegex.test(address)) { alert("Invalid Address!"); return; }
    if (!phoneRegex.test(phone)) { alert("Invalid Phone Number! Must be exactly 10 digits."); return; }

    customers[index].name = name;
    customers[index].address = address;
    customers[index].phone = phone; // Swapped

    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated'));
    alert("Customer Updated Successfully!");
});

document.getElementById("btnDeleteCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let index = customers.findIndex(c => c.id === id);
    if (index === -1) return;

    if(confirm("Are you sure you want to delete this customer?")) {
        customers.splice(index, 1);
        loadCustomers();
        clearForm();
        document.dispatchEvent(new Event('customerUpdated'));
    }
});

document.getElementById("btnSearchCust").addEventListener("click", () => {
    let query = document.getElementById("txtSearchCust").value.toLowerCase();
    let filtered = customers.filter(c => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query));
    loadCustomers(filtered);
});

document.getElementById("btnViewAllCust").addEventListener("click", () => {
    document.getElementById("txtSearchCust").value = "";
    loadCustomers();
});