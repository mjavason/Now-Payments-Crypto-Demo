import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

export const PORT = process.env.PORT || 5000;
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
export const NOW_PAYMENTS_API_KEY = process.env.NOW_PAYMENTS_API_KEY || 'xxxx';
export const NOW_PAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
export const NOW_PAYMENTS_WEBHOOK_URL = process.env.NOW_PAYMENTS_WEBHOOK_URL || `${BASE_URL}/webhook`;
