# Payment System - File Reference Guide

## Files Involved in Payment Flow

```
server/
├── src/
│   ├── routes/
│   │   └── payments.ts              ← ALL PAYMENT ENDPOINTS
│   ├── services/
│   │   └── team.service.ts          ← confirmPayment() method
│   ├── models/
│   │   └── Payment.ts               ← Payment schema
│   └── schemas/
│       └── index.ts                 ← PaymentConfirmSchema

client/
├── src/
│   ├── pages/
│   │   └── Payment.tsx              ← PAYMENT PAGE UI
│   ├── services/
│   │   └── api.ts                   ← initiatePayment(), confirmPayment()
│   └── utils/
│       └── id-generator.ts          ← generateTransactionRef()
└── src/
    └── App.tsx                       ← /payment route definition
```

---

## Core Files & Their Current Code

### 1. Backend Payment Routes

**File**: `server/src/routes/payments.ts`

```typescript
// Line 12-39: Initiate payment (creates mock session)
router.post('/initiate', async (req: AuthRequest, res: Response) => {
  // Returns mock payment details
  // NO REAL PAYMENT GATEWAY CALL
});

// Line 41-60: Confirm payment (accepts button click)
router.post('/confirm', async (req: AuthRequest, res: Response) => {
  // Line 46: ❌ MOCK - Just simulates success
  // const team = await teamService.confirmPayment(registrationId);
  // ⬆️ This is where you'd add:
  // ✅ const isValid = await razorpay.verify(signature);
});

// Line 62-80: Fail payment (handles failure button)
router.post('/fail', async (req: AuthRequest, res: Response) => {
  // Marks payment as failed
});
```

**Key Line to Change** (Line 46):
```typescript
// Current - MOCK:
const team = await teamService.confirmPayment(registrationId);

// Should be - REAL:
const isValid = await verifyPaymentWithGateway(paymentId, signature);
if (!isValid) {
  throw new Error('Payment verification failed');
}
const team = await teamService.confirmPayment(registrationId);
```

---

### 2. Frontend Payment Page

**File**: `client/src/pages/Payment.tsx`

```typescript
// Line 33-40: Load payment details
const loadPayment = async () => {
  const payment = await api.initiatePayment(registrationId);
  setPaymentInfo(payment);
};

// Line 45-55: Success handler
const handlePaymentSuccess = async () => {
  const transactionRef = generateTransactionRef();
  // ⬆️ This is a mock - in reality, would come from payment gateway
  await api.confirmPayment(registrationId, transactionRef);
  navigate(`/confirmation?registrationId=${registrationId}`);
};

// Line 57-67: Failure handler
const handlePaymentFail = async () => {
  await api.failPayment(registrationId);
  setError('Payment failed. Please try again.');
};

// Line 120-126: Display mock warning
<div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
  <p className="text-sm text-blue-800">
    <strong>Mock Payment Gateway:</strong> This is a test environment. 
    Use the buttons below to simulate payment success or failure.
  </p>
</div>

// Line 128-140: Mock buttons (THESE ARE FAKE)
<button onClick={handlePaymentSuccess}>
  ✓ Simulate Payment Success
</button>
<button onClick={handlePaymentFail}>
  ✗ Simulate Payment Failed
</button>

// Line 141-151: Production note
<div className="p-4 bg-yellow-50 border border-yellow-200">
  <p>
    <strong>Note:</strong> In production, this would redirect to an 
    actual payment gateway (Razorpay, Stripe, etc.).
  </p>
</div>
```

**Key Change Needed**:
Replace buttons with actual payment form:
```typescript
// Instead of these mock buttons:
// <button onClick={handlePaymentSuccess}>✓ Simulate Payment Success</button>
// <button onClick={handlePaymentFail}>✗ Simulate Payment Failed</button>

// Add real payment form:
// For Razorpay: <RazorpayButton />
// For Stripe: <StripeCardForm />
```

---

### 3. API Client

**File**: `client/src/services/api.ts`

```typescript
// Line ~70: Initiate payment
export async function initiatePayment(registrationId: string) {
  const response = await api.post('/payments/initiate', { registrationId });
  return response.data;
}

// Line ~75: Confirm payment
export async function confirmPayment(
  registrationId: string,
  transactionRef: string
) {
  const response = await api.post('/payments/confirm', {
    registrationId,
    transactionRef,
  });
  return response.data;
}

// Line ~85: Fail payment
export async function failPayment(registrationId: string) {
  const response = await api.post('/payments/fail', { registrationId });
  return response.data;
}
```

**Need to Add**:
```typescript
// For Razorpay:
export async function verifyRazorpayPayment(payload: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const response = await api.post('/payments/verify', payload);
  return response.data;
}

// For Stripe:
export async function verifyStripePayment(paymentIntentId: string) {
  const response = await api.post('/payments/verify', { paymentIntentId });
  return response.data;
}
```

---

### 4. Team Service (Payment Confirmation Logic)

**File**: `server/src/services/team.service.ts`

```typescript
// Line ~82-105: Confirm payment
export async function confirmPayment(registrationId: string): Promise<ITeam> {
  const team = await Team.findOne({ registrationId }).populate('payment');

  if (!team) {
    throw new Error('Team not found');
  }

  if (team.payment) {
    // Update payment status to Success
    const payment = await Payment.findByIdAndUpdate(
      team.payment._id,
      { status: 'Success' },
      { new: true }
    );

    // Update team status to CONFIRMED
    team.status = 'CONFIRMED';
    await team.save();

    // Send email notification
    // ...
  }

  return team;
}

// Line ~106-125: Fail payment
export async function failPayment(registrationId: string): Promise<ITeam> {
  const team = await Team.findOne({ registrationId });

  if (!team) {
    throw new Error('Team not found');
  }

  if (team.payment) {
    // Update payment status to Failed
    await Payment.findByIdAndUpdate(
      team.payment._id,
      { status: 'Failed' },
      { new: true }
    );
  }

  return team;
}
```

---

### 5. Payment Model/Schema

**File**: `server/src/models/Payment.ts`

```typescript
export interface IPayment extends Document {
  teamId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'Success' | 'Failed' | 'Pending';  // ← Updated on payment
  transactionRef: string;                     // ← Mock reference
  provider: string;                           // ← 'mock' currently
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Pending',
    },
    transactionRef: {  // ← Add real provider's transaction ID here
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {        // ← Track which provider: 'razorpay', 'stripe', etc.
      type: String,
      default: 'mock',
    },
  },
  { timestamps: true }
);
```

**Need to Add Fields** (for real payment gateways):
```typescript
// For Razorpay:
orderId: String;        // From Razorpay
paymentId: String;      // From Razorpay

// For Stripe:
paymentIntentId: String; // From Stripe
clientSecret: String;    // From Stripe

// For both:
signature: String;      // For verification
metadata: Object;       // Additional data
```

---

### 6. Routes Definition

**File**: `client/src/App.tsx` or Router setup

```typescript
// Payment route (what exists)
<Route path="/payment" element={<Payment />} />

// Routes that exist:
// /register → Registration form
// /payment → Mock payment page (what you're asking about)
// /confirmation → Confirmation page (after success)
```

---

## Step-by-Step: What to Change for Real Payment

### Step 1: Add Payment Gateway SDK
```bash
# For Razorpay
npm install razorpay

# For Stripe
npm install stripe
```

### Step 2: Create Payment Service
```typescript
// server/src/services/razorpay.service.ts (new file)
// or
// server/src/services/stripe.service.ts (new file)
```

### Step 3: Update Backend Routes
```typescript
// Modify: server/src/routes/payments.ts
// Add verification logic (30 lines)
```

### Step 4: Update Frontend
```typescript
// Modify: client/src/pages/Payment.tsx
// Replace mock buttons with real form (40 lines)
```

### Step 5: Add Environment Variables
```bash
# server/.env
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# or for Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...

# client/.env
VITE_STRIPE_PUBLIC_KEY=...
```

---

## Current vs Required Changes

| Component | Current (Mock) | Required (Real) |
|-----------|---|---|
| Payment page | Show mock buttons | Show payment form |
| Backend verification | Accept button click | Call payment gateway API |
| Transaction storage | Generate fake ref | Store provider's transaction ID |
| Error handling | Simulate errors | Handle real gateway errors |
| Webhooks | None | Implement for async confirmation |
| Security | Minimal | Full PCI compliance |

---

## Files You DON'T Need to Change

✅ **These stay the same:**
- `server/src/models/Team.ts` - Team schema unchanged
- `server/src/services/team.service.ts` - confirmPayment() logic unchanged
- `client/src/pages/Register.tsx` - Registration unchanged
- `client/src/pages/Confirmation.tsx` - Confirmation page unchanged
- Database structure - No migrations needed

❌ **These MUST change:**
- `server/src/routes/payments.ts` - Add verification
- `client/src/pages/Payment.tsx` - Replace mock UI
- `server/.env` - Add gateway credentials
- `client/.env` - Add public keys (for some providers)

---

## Testing Without Integration

If you want to test the full flow with current mock system:

```bash
1. npm run dev
2. Go to http://localhost:5173
3. Register team → Get registration ID
4. Click "Proceed to Payment"
5. Click "✓ Simulate Payment Success"
6. See confirmation page with "Status: CONFIRMED"
7. Check MongoDB Atlas → Team status changed to CONFIRMED
```

The mock payment system works completely - it's just not processing real money!

---

**See `PAYMENT_INTEGRATION_GUIDE.md` for complete implementation with code examples!**
