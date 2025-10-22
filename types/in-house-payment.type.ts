export type InHousePaymentType = {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  amount_received: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  payin_extra_id: string | null;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  smart_contract: string | null;
  network: string;
  network_precision: number | null;
  time_limit: number | null;
  burning_percent: number | null;
  expiration_estimate_date: string;
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
  valid_until: string;
  type: string;
  product: string;
  success: string;
};


