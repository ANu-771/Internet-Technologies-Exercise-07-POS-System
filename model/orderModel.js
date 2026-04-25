export class Orders {
    constructor(orderId, date, customerId, items, total) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.items = items; 
        this.total = total;
    }
}