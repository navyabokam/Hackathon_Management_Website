# Payment Gateway Integration Guide

## Current Status: ❌ MOCK PAYMENT SYSTEM

The application currently uses a **simulated/test payment gateway**. There is no real payment processing yet.

---

## What Happens Now (Mock Flow)

### Current Payment Flow

```
1. User registers team → Payment record created
2. Clicks "Proceed to Payment" → Taken to /payment page
3. Payment.tsx shows:
   - Team name and registration ID
   - Amount: ₹500 INR
   - Banner: "This is a test environment"
   - Two buttons:
     ✓ "Simulate Payment Success"
     ✗ "Simulate Payment Failed"
4. User clicks button → Backend updates team status
5. Redirects to confirmation page or back to registration
```

### Backend Mock Implementation

**File**: `server/src/routes/payments.ts`

```typescript
// Simulate success - in real system, verify with payment gateway
const team = await teamService.confirmPayment(registrationId);

res.json({
  success: true,
  registrationId: team.registrationId,
  status: team.status,
  message: 'Payment confirmed successfully',
});
```

**Comment in code**: `// Simulate success - in real system, verify with payment gateway`

---

## How to Integrate Real Payment Gateways

### Option 1: Razorpay (Recommended for India)

#### Step 1: Install Razorpay SDK

```bash
cd server
npm install razorpay
npm install --save-dev @types/razorpay
```

#### Step 2: Add Razorpay Credentials to `.env`

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Create Razorpay Service

Create `server/src/services/razorpay.service.ts`:

```typescript
import Razorpay from 'razorpay';
import { config } from '../config/index';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number, registrationId: string) {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: registrationId,
    notes: {
      registrationId,
    },
  };

  const order = await razorpay.orders.create(options);
  return order;
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  // Razorpay verification logic
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}
```

#### Step 4: Update Payment Routes

Replace in `server/src/routes/payments.ts`:

```typescript
import { createRazorpayOrder, verifyPaymentSignature } from '../services/razorpay.service';

// POST /api/payments/initiate - Create Razorpay order
router.post('/initiate', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.body;
    const team = await teamService.getTeamByRegistrationId(registrationId);

    if (!team?.payment) {
      res.status(400).json({ error: 'Payment not initialized' });
      return;
    }

    const payment = await Payment.findById(team.payment);
    if (!payment) {
      res.status(400).json({ error: 'Payment record not found' });
      return;
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(payment.amount, registrationId);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      registrationId,
      teamName: team.teamName,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify - Verify Razorpay payment
router.post('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId, orderId, paymentId, signature } = req.body;

    // Verify signature
    const isValid = await verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      res.status(400).json({ error: 'Payment verification failed' });
      return;
    }

    // Update payment status in database
    const team = await teamService.confirmPayment(registrationId);

    res.json({
      success: true,
      registrationId: team.registrationId,
      status: team.status,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification error' });
  }
});
```

#### Step 5: Update Frontend for Razorpay

Update `client/src/pages/Payment.tsx`:

```tsx
const handleRazorpayPayment = async () => {
  try {
    // Initiate payment and get order details
    const paymentInfo = await api.initiatePayment(registrationId);

    const options = {
      key: paymentInfo.keyId,
      amount: paymentInfo.amount,
      currency: paymentInfo.currency,
      order_id: paymentInfo.orderId,
      name: 'Hackathon Registration',
      description: `Team: ${paymentInfo.teamName}`,
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          await api.verifyPayment(registrationId, {
            orderId: paymentInfo.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          // Success
          navigate(`/confirmation?registrationId=${registrationId}`);
        } catch {
          setError('Payment verification failed');
        }
      },
      prefill: {
        email: 'team@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#2563eb',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    setError('Failed to initiate payment');
  }
};

return (
  <button
    onClick={handleRazorpayPayment}
    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
  >
    Pay ₹{paymentInfo.amount} with Razorpay
  </button>
);
```

#### Step 6: Add Razorpay Script to HTML

Update `client/index.html`:

```html
<head>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
```

---

### Option 2: Stripe

#### Step 1: Install Stripe SDK

```bash
cd server
npm install stripe
npm install --save-dev @types/stripe

cd ../client
npm install @stripe/react-stripe-js @stripe/js
```

#### Step 2: Add Stripe Keys to `.env`

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

#### Step 3: Create Stripe Service

`server/src/services/stripe.service.ts`:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripePaymentIntent(
  amount: number,
  registrationId: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'inr',
    metadata: {
      registrationId,
    },
  });

  return paymentIntent;
}

export async function confirmStripePayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.status === 'succeeded';
}
```

#### Step 4: Update Payment Routes

```typescript
import { createStripePaymentIntent, confirmStripePayment } from '../services/stripe.service';

router.post('/initiate', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.body;
    const team = await teamService.getTeamByRegistrationId(registrationId);

    if (!team?.payment) {
      res.status(400).json({ error: 'Payment not initialized' });
      return;
    }

    const paymentIntent = await createStripePaymentIntent(
      team.payment.amount,
      registrationId
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      registrationId,
      teamName: team.teamName,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

router.post('/confirm', async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId, paymentIntentId } = req.body;

    const isValid = await confirmStripePayment(paymentIntentId);
    if (!isValid) {
      res.status(400).json({ error: 'Payment not confirmed' });
      return;
    }

    const team = await teamService.confirmPayment(registrationId);
    res.json({
      success: true,
      registrationId: team.registrationId,
      status: team.status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment confirmation error' });
  }
});
```

#### Step 5: Update Frontend for Stripe

```tsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ clientSecret, registrationId }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.paymentIntent?.status === 'succeeded') {
      await api.confirmPayment(registrationId, result.paymentIntent.id);
      navigate(`/confirmation?registrationId=${registrationId}`);
    } else {
      setError(result.error?.message || 'Payment failed');
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <CardElement />
      <button onClick={handlePayment}>Pay ₹500</button>
    </Elements>
  );
};
```

---

## Comparison: Razorpay vs Stripe

| Feature | Razorpay | Stripe |
|---------|----------|--------|
| Best For | India | Global |
| Payment Methods | Cards, UPI, Wallets | Cards mainly |
| Settlement Time | 2-3 days | 2-3 days |
| Dashboard | Excellent | Excellent |
| Fee | 2% + ₹0 | 2.9% + $0.30 |
| Documentation | Good | Excellent |
| Support | Good | Excellent |

**Recommendation for India-based hackathon**: **Razorpay**

---

## Testing Payment Integration

### Razorpay Test Credentials
```
Key ID: rzp_test_1DP5gbNptzeJ6T
Key Secret: (Get from Razorpay dashboard)
Test Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Stripe Test Credentials
```
Publishable Key: pk_test_xxxxx
Secret Key: sk_test_xxxxx
Test Card: 4242 4242 4242 4242
CVV: Any 3 digits
Expiry: Any future date
```

---

## Security Considerations

✅ **Always:**
- Store keys in environment variables (never hardcode)
- Verify signatures on the backend
- Update payment status only after verification
- Use HTTPS in production
- Keep SDKs updated

❌ **Never:**
- Send secret keys to frontend
- Trust frontend payment status
- Skip signature verification
- Store sensitive payment data

---

## What Needs to Change

### Backend Changes
1. ✅ Add payment gateway SDK
2. ✅ Update payment service with real verification
3. ✅ Add signature verification
4. ✅ Update routes to handle real payments
5. ✅ Handle payment webhooks (for async confirmation)

### Frontend Changes
1. ✅ Add payment gateway form/modal
2. ✅ Handle payment flow
3. ✅ Send verification to backend
4. ✅ Handle errors properly
5. ✅ Add loading states

### Database Changes
1. ✅ Store payment intent/order IDs
2. ✅ Track payment provider
3. ✅ Add webhook logs (for debugging)

### Configuration
1. ✅ Add payment provider credentials to .env
2. ✅ Set webhook endpoints in provider dashboard
3. ✅ Configure success/failure redirect URLs

---

## Summary

**Current State**: Users can click buttons to simulate success/failure
**After Integration**: Users will enter real payment details and complete actual transactions

**Time to Integrate**: 2-4 hours (depending on experience)
**Complexity**: Medium (straightforward with SDKs)
**Cost**: Free for development, then per-transaction fees

**Next Step**: Choose Razorpay or Stripe and follow the integration steps above!
