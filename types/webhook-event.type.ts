export enum PaymentStatusEnum {
  WAITING = 'waiting',
  FINISHED = 'finished',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
}

export type WebhookEventType = {
  actually_paid: number;
  actually_paid_at_fiat: number;
  fee: {
    currency: string;
    depositFee: number;
    serviceFee: number;
    withdrawalFee: number;
  };
  invoice_id: number;
  order_description: string;
  order_id: string;
  outcome_amount: number;
  outcome_currency: string;
  parent_payment_id: number | null;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  payin_extra_id: string | null;
  payment_extra_ids: string | null;
  payment_id: number;
  payment_status: string;
  price_amount: number;
  price_currency: string;
  purchase_id: string;
  updated_at: number;
};
