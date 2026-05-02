import { applyDiscount } from "./discount";

const price = prompt("Input the price: ");

console.log(`Price: ${price}`);
console.log(`Discount: ${applyDiscount(Number(price))}`);
