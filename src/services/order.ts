import type { RappiConfig } from "../schemas/config";
import type { OrdersResponse } from "../schemas/order";
import { get, post } from "../http";
import { getCheckoutDetail } from "./checkout";

export async function placeOrder(
  storeType: string,
  config: RappiConfig
): Promise<unknown> {
  const checkoutDetail = await getCheckoutDetail(storeType, config);

  return post<unknown>(
    `/api/ms/shopping-cart-proxy/${storeType}/checkout`,
    {
      return_key: checkoutDetail.return_key,
    },
    config
  );
}

// Rappi answers checkout with `split_payment_gate: true` when the charge still
// has to go through a separate payment step that this client does not perform.
// The order is created and dispatched anyway, but the card is not charged.
export const PAYMENT_UNCONFIRMED_WARNING =
  "Payment NOT confirmed: Rappi flagged this order with split_payment_gate, " +
  "so the card may not have been charged. Check the order in the Rappi app " +
  "and complete payment there if asked.";

export function isPaymentUnconfirmed(result: unknown): boolean {
  const entries = Array.isArray(result) ? result : [result];
  return entries.some(
    (e) => typeof e === "object" && e !== null && (e as any).split_payment_gate === true
  );
}

export async function getOrders(
  config: RappiConfig
): Promise<OrdersResponse> {
  return get<OrdersResponse>("/api/user-order-home/orders", config);
}
