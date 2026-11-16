import { loadConfig } from "../config";
import { recalculateCart, resolveStoreType } from "../services/cart";
import { placeOrder, isPaymentUnconfirmed, PAYMENT_UNCONFIRMED_WARNING } from "../services/order";
import { withSpinner, ok, fail, rappiOrangeBold, dim, bold, warn } from "../ui";

const storeType = process.argv[2] || "restaurant";
const config = await loadConfig();
const resolved = await resolveStoreType(storeType, config);

const cart = await withSpinner("Validating cart...", () => recalculateCart(resolved, config));
if (!cart.stores?.length) {
  console.log(`\n${fail("Cart is empty.")}\n`);
  process.exit(1);
}

const invalidStores = cart.stores.filter((s: any) => !s.valid);
if (invalidStores.length) {
  console.log(`\n${fail("Cannot place order:")}`);
  for (const s of invalidStores) {
    const reason = s.is_open ? "products unavailable" : "store is closed";
    console.log(`    ${warn(s.name)}: ${reason}`);
  }
  console.log();
  process.exit(1);
}

console.log(`\n  ${rappiOrangeBold("Placing order")}\n`);
for (const store of cart.stores) {
  console.log(`  ${bold(store.name)}`);
  for (const p of store.products) {
    console.log(`    ${p.name} ${dim(`x${p.units}`)} -- $${p.total.toLocaleString("es-CO")}`);
  }
  console.log(`  ${dim("Total")} ${bold(`$${store.total.toLocaleString("es-CO")}`)}\n`);
}

try {
  const result = await withSpinner("Placing order...", () => placeOrder(resolved, config));
  console.log(`\n${ok("Order placed!")}`);
  if (isPaymentUnconfirmed(result)) {
    console.log(`${warn(PAYMENT_UNCONFIRMED_WARNING)}`);
  }
  console.log(`\n  ${dim(JSON.stringify(result, null, 2))}\n`);
} catch (err: any) {
  const message = err.message;

  // Check for topping-related errors
  if (message.includes("invalid_toppings")) {
    console.log(`\n${fail("Cannot place order: Missing or invalid toppings")}`);
    console.log(`${warn("Some products in your cart require toppings that are missing or unavailable.")}`);
    console.log(`${dim("Run: rappi cart")} ${dim("to see items")}`);
    console.log(`${dim("Run: rappi product <store_id> <product_id>")} ${dim("to check required toppings")}\n`);
  } else {
    console.log(`\n${fail(`Failed to place order: ${message}`)}\n`);
  }
  process.exit(1);
}
