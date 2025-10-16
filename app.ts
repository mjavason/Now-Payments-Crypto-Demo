import axios from 'axios';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { ApiService } from './api.util';
import {
  BASE_URL,
  NOW_PAYMENTS_API_KEY,
  NOW_PAYMENTS_API_URL,
  NOW_PAYMENTS_WEBHOOK_URL,
  PORT,
} from './constants';
import { setupSwagger } from './swagger.config';

//#region App Setup
const nowPaymentsApi = new ApiService(NOW_PAYMENTS_API_URL, {
  headers: {
    'x-api-key': NOW_PAYMENTS_API_KEY,
    'Content-Type': 'application/json',
  },
});
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use(morgan('dev'));
setupSwagger(app, BASE_URL);

//#endregion App Setup

//#region Code here

/**
 * @swagger
 * /payment-link:
 *   post:
 *     summary: Creates a payment link users can pay with
 *     tags: [Now Payments]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.post('/payment-link', async (req: Request, res: Response) => {
  const data = {
    price_amount: 10,
    price_currency: 'usd',
    pay_currency: 'usdt',
    order_id: 'order_123',
    order_description: 'Test Order',
    success_url: NOW_PAYMENTS_WEBHOOK_URL,
    cancel_url: NOW_PAYMENTS_WEBHOOK_URL,
  };

  const response = await nowPaymentsApi.post('/invoice', data);
  if (!response) {
    return res.status(500).send({
      success: false,
      message: 'Failed to create payment link',
    });
  }

  return res.status(200).send({
    success: true,
    message: 'Payment link created',
    data: response,
  });
});

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Creates a payment that users can complete without leaving your website
 *     tags: [Now Payments]
 *     responses:
 *       '200':
 *         description: Successful payment creation.
 *       '400':
 *         description: Bad request.
 */
app.post('/payment', async (req: Request, res: Response) => {
  const data = {
    price_amount: 100,
    price_currency: 'usd',
    pay_currency: 'btc',
    ipn_callback_url: NOW_PAYMENTS_WEBHOOK_URL,
    order_id: 'demo-order-123',
    order_description: 'Demo payment for testing',
    is_fixed_rate: false,
    is_fee_paid_by_user: true,
  };

  const response = await nowPaymentsApi.post('/payment', data);
  if (!response) {
    return res.status(500).send({
      success: false,
      message: 'Failed to create payment',
    });
  }

  return res.status(200).send({
    success: true,
    message: 'Payment created successfully',
    data: response,
  });
});

/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Webhook for payment status updates
 *     tags: [Now Payments]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.post('/webhook', async (req: Request, res: Response) => {
  const event = req.body;
  console.log('Received webhook event:', event);

  // // Handle the webhook event
  // switch (event.type) {
  //   case 'payment_succeeded':
  //     // Handle successful payment
  //     console.log('Payment succeeded:', event);
  //     break;
  //   case 'payment_failed':
  //     // Handle failed payment
  //     console.log('Payment failed:', event);
  //     break;
  //   default:
  //     console.log('Unknown event type:', event.type);
  // }

  return res.status(200).send({
    success: true,
    message: 'Webhook received',
  });
});

//#endregion

//#region Server Setup

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Call a demo external API (httpbin.org)
 *     description: Returns an object containing demo content
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.get('/api', async (req: Request, res: Response) => {
  try {
    const result = await axios.get('https://httpbin.org');
    return res.send({
      message: 'Demo API called (httpbin.org)',
      data: result.status,
    });
  } catch (error: any) {
    console.error('Error calling external API:', error.message);
    return res.status(500).send({
      error: 'Failed to call external API',
    });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health check
 *     description: Returns an object containing demo content
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.get('/', (req: Request, res: Response) => {
  return res.send({
    message: 'API is Live!',
  });
});

/**
 * @swagger
 * /obviously/this/route/cant/exist:
 *   get:
 *     summary: API 404 Response
 *     description: Returns a non-crashing result when you try to run a route that doesn't exist
 *     tags: [Default]
 *     responses:
 *       '404':
 *         description: Route not found
 */
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'API route does not exist',
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // throw Error('This is a sample error');
  console.log(`${'\x1b[31m'}`); // start color red
  console.log(`${err.message}`);
  console.log(`${'\x1b][0m]'}`); //stop color

  return res.status(500).send({
    success: false,
    status: 500,
    message: err.message,
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

// (for render services) Keep the API awake by pinging it periodically
// setInterval(pingSelf(BASE_URL), 600000);

//#endregion
