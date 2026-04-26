
import { Customer } from '../model/customerModel.js';
import { Item } from '../model/itemModel.js';
import { Orders } from '../model/orderModel.js';
import { OrderDetails } from '../model/orderDetailsModel.js';

export let customers = [
    new Customer("C001", "Nadeja Kalhara", "Matara", "0771234567"),
    new Customer("C002", "Kasun Gunasekara", "Galle", "0719876543"),
    new Customer("C003", "Amal Perera", "Jaffna", "0751122334")
];

export let items = [
    new Item("I001", "Sugar 1kg", 240.00, 50),
    new Item("I002", "Rice 5kg", 880.00, 25),
    new Item("I003", "Milk Powder", 1250.00, 18),
    new Item("I004", "Keeri Samba 5kg", 1100.00, 40)
];

export let orders = [
    new Orders("ORD-001", "2026-04-26", "C001", [
        new OrderDetails("I001", "Sugar 1kg", 240.00, 2, 480.00),
        new OrderDetails("I003", "Milk Powder", 1250.00, 1, 1250.00)
    ], 1730.00)
];