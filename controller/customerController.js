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
        tr.innerHTML = `<td class="fw-bold">${c.id}</td><td>${c.name}</td><td>${c.address}</td><td>LKR ${c.salary}</td>`;
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
        document.getElementById("txtCustSalary").value = customer.salary;
    }
}

function clearForm() {
    document.getElementById("txtCustName").value = "";
    document.getElementById("txtCustAddress").value = "";
    document.getElementById("txtCustSalary").value = "";
    generateCustomerID();
}

document.getElementById("btnClearCust").addEventListener("click", clearForm);

document.getElementById("btnSaveCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let salary = document.getElementById("txtCustSalary").value.trim();

    if (!id || !name || !address || !salary) { alert("All fields are required!"); return; }
    if (customers.find(c => c.id === id)) { alert("Customer ID exists! Use Update."); return; }

    customers.push(new Customer(id, name, address, salary));
    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated')); 
    alert("Customer Saved!");
});

document.getElementById("btnUpdateCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let index = customers.findIndex(c => c.id === id);
    if (index === -1) { alert("Customer not found!"); return; }

    customers[index].name = document.getElementById("txtCustName").value;
    customers[index].address = document.getElementById("txtCustAddress").value;
    customers[index].salary = document.getElementById("txtCustSalary").value;

    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated'));
    alert("Customer Updated!");
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