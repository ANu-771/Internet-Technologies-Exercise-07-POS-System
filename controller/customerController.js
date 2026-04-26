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

const nameRegex = /^[A-Za-z ]{3,50}$/;
const addressRegex = /^[A-Za-z0-9 ,.-]{5,100}$/;
const phoneRegex = /^\d{10}$/;

// --- Save Customer ---
document.getElementById("btnSaveCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let phone = document.getElementById("txtCustPhone").value.trim(); 

    if (!id || !name || !address || !phone) { 
        Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'All fields are required!' }); 
        return; 
    }
    
    // Regex Validations
    if (!nameRegex.test(name)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Name! Please use only letters and spaces (3-50 chars).' }); return; }
    if (!addressRegex.test(address)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Address! Must be between 5 and 100 characters.' }); return; }
    if (!phoneRegex.test(phone)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Phone Number! Must be exactly 10 digits.' }); return; }

    if (customers.find(c => c.id === id)) { 
        Swal.fire({ icon: 'error', title: 'Duplicate ID', text: 'Customer ID already exists! Use Update.' }); 
        return; 
    }

    customers.push(new Customer(id, name, address, phone));
    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated')); 
    
    Swal.fire({ icon: 'success', title: 'Saved!', text: 'Customer Saved Successfully!', confirmButtonColor: '#8cc63f' });
});

// --- Update Customer ---
document.getElementById("btnUpdateCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let name = document.getElementById("txtCustName").value.trim();
    let address = document.getElementById("txtCustAddress").value.trim();
    let phone = document.getElementById("txtCustPhone").value.trim(); 
    
    let index = customers.findIndex(c => c.id === id);
    if (index === -1) { 
        Swal.fire({ icon: 'warning', title: 'Not Found', text: 'Customer not found!' }); 
        return; 
    }

    // Regex Validations
    if (!nameRegex.test(name)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Name! Please use only letters and spaces.' }); return; }
    if (!addressRegex.test(address)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Address!' }); return; }
    if (!phoneRegex.test(phone)) { Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Phone Number! Must be exactly 10 digits.' }); return; }

    customers[index].name = name;
    customers[index].address = address;
    customers[index].phone = phone; 

    loadCustomers();
    clearForm();
    document.dispatchEvent(new Event('customerUpdated'));
    
    Swal.fire({ icon: 'success', title: 'Updated!', text: 'Customer Updated Successfully!', confirmButtonColor: '#ffc107' });
});

document.getElementById("btnDeleteCust").addEventListener("click", () => {
    let id = document.getElementById("txtCustId").value.trim();
    let index = customers.findIndex(c => c.id === id);
    
    if (index === -1) {
        Swal.fire({ icon: 'warning', title: 'Not Found', text: 'Please select a customer to delete.'});
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e63946", // Custom red for delete
        cancelButtonColor: "#6c757d",  // Gray for cancel
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        
        // This code only runs IF they click "Yes, delete it!"
        if (result.isConfirmed) {
            
            // 1. Delete the data
            customers.splice(index, 1);
            loadCustomers();
            clearForm();
            document.dispatchEvent(new Event('customerUpdated'));
            
            // 2. Show the "Deleted" success message
            Swal.fire({
                title: "Deleted!",
                text: "The customer has been deleted.",
                icon: "success",
                confirmButtonColor: "#8cc63f"
            });
        }
    });
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