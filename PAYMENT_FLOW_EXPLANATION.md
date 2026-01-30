# Current Payment Flow (Mock/Test)

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User registers team → Gets registration ID                       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ↓
                    ┌─────────────────────────────┐
                    │ Click "Proceed to Payment"  │
                    └─────────────────────────────┘
                                  │
                                  ↓
            ┌─────────────────────────────────────────────┐
            │ Frontend: Payment.tsx loads                  │
            │ - Calls api.initiatePayment(registrationId) │
            │ - Shows mock payment page                   │
            └─────────────────────────────────────────────┘
                                  │
                                  ↓
            ┌─────────────────────────────────────────────┐
            │ Backend: POST /api/payments/initiate         │
            │ Returns:                                     │
            │ - Team name                                 │
            │ - Amount (₹500)                             │
            │ - Registration ID                           │
            │ - sessionId (payment._id)                   │
            └─────────────────────────────────────────────┘
                                  │
                                  ↓
            ┌──────────────────────────────────────────────────────┐
            │ Frontend displays:                                    │
            │ ┌──────────────────────────────────────────────────┐ │
            │ │ PAYMENT PAGE                                     │ │
            │ │                                                  │ │
            │ │ Order Summary:                                   │ │
            │ │ Team Name: CodeStorm Team                        │ │
            │ │ Registration ID: REG-12345                       │ │
            │ │ Amount: ₹500 INR                                 │ │
            │ │                                                  │ │
            │ │ ⚠️ Mock Payment Gateway (Test Environment)        │ │
            │ │                                                  │ │
            │ │ [✓ Simulate Payment Success]                     │ │
            │ │ [✗ Simulate Payment Failed]                      │ │
            │ │ [← Go Back to Registration]                      │ │
            │ │                                                  │ │
            │ │ Note: In production, this would redirect to      │ │
            │ │ an actual payment gateway...                     │ │
            │ └──────────────────────────────────────────────────┘ │
            └──────────────────────────────────────────────────────┘
                           │                    │
                ┌──────────┘                    └─────────────┐
                │                                            │
                ↓                                            ↓
    ┌────────────────────────┐              ┌────────────────────────┐
    │ User clicks "Success"  │              │ User clicks "Failed"   │
    └────────────────────────┘              └────────────────────────┘
                │                                            │
                ↓                                            ↓
    ┌──────────────────────────────────┐    ┌──────────────────────────────────┐
    │ Frontend:                         │    │ Frontend:                         │
    │ handlePaymentSuccess()            │    │ handlePaymentFail()               │
    │ - Generates transactionRef        │    │ - Calls api.failPayment()         │
    │ - Calls api.confirmPayment()      │    │ - Sets error message              │
    │                                  │    │ - Redirects to /register in 3s    │
    └────────────────────┬─────────────┘    └────────────────────┬─────────────┘
                         │                                         │
                         ↓                                         ↓
         ┌────────────────────────────────┐    ┌────────────────────────────────┐
         │ Backend:                        │    │ Backend:                        │
         │ POST /api/payments/confirm      │    │ POST /api/payments/fail         │
         │                                │    │                                │
         │ 1. Receives registrationId &   │    │ 1. Receives registrationId      │
         │    transactionRef              │    │                                │
         │                                │    │ 2. Calls                       │
         │ 2. Calls                       │    │    teamService.failPayment()    │
         │    teamService.confirmPayment()│    │                                │
         │                                │    │ 3. Updates team.status to      │
         │ 3. Updates team.status to      │    │    PENDING_PAYMENT             │
         │    CONFIRMED                   │    │                                │
         │                                │    │ 4. Returns failure response    │
         │ 4. Returns success response    │    │                                │
         └────────────────────┬───────────┘    └────────────────────┬──────────┘
                              │                                      │
                              ↓                                      ↓
                  ┌─────────────────────────┐       ┌────────────────────────┐
                  │ Redirects to:           │       │ Shows error message    │
                  │ /confirmation?regId=... │       │ "Payment failed.       │
                  │                         │       │  Please try again."    │
                  │ Displays:               │       │                        │
                  │ ✓ Registration Complete │       │ After 3 seconds:       │
                  │ Team Verified!          │       │ Redirects to /register │
                  │ Status: CONFIRMED       │       │                        │
                  └─────────────────────────┘       └────────────────────────┘
```

---

## Code Flow - Line by Line

### 1. User Clicks "Proceed to Payment"

**Frontend (App.tsx or Register.tsx):**
```typescript
navigate(`/payment?registrationId=${result.registrationId}`);
```

### 2. Payment Page Loads (Payment.tsx)

```typescript
useEffect(() => {
  const loadPayment = async () => {
    const payment = await api.initiatePayment(registrationId);
    setPaymentInfo(payment);
  };
  loadPayment();
}, [registrationId]);
```

**What it calls:**
```typescript
// client/src/services/api.ts
export async function initiatePayment(registrationId: string) {
  const response = await api.post('/payments/initiate', { registrationId });
  return response.data;
}
```

### 3. Backend Processes Initiate Request

**Backend (payments.ts):**
```typescript
router.post('/initiate', async (req: AuthRequest, res: Response) => {
  const { registrationId } = req.body;
  
  // Find team
  const team = await teamService.getTeamByRegistrationId(registrationId);
  
  // Get payment record
  const payment = await Payment.findById(team.payment);
  
  // Return MOCK payment session (no real gateway!)
  res.json({
    sessionId: payment._id,
    amount: payment.amount,           // ₹500
    currency: payment.currency,        // INR
    registrationId,
    teamName: team.teamName,
    mockPaymentUrl: `/payment?id=${payment._id}&mock=true`,
  });
});
```

### 4. Frontend Displays Mock Payment Page

```typescript
return (
  <div className="bg-white rounded-lg shadow-lg p-8">
    <h1>Payment</h1>
    
    <div className="p-4 bg-gray-50 rounded">
      <h2>Order Summary</h2>
      <div className="flex justify-between">
        <span>Team Name:</span>
        <span>{paymentInfo.teamName}</span>
      </div>
      <div className="flex justify-between">
        <span>Amount:</span>
        <span>₹{paymentInfo.amount} {paymentInfo.currency}</span>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <p>
        <strong>Mock Payment Gateway:</strong> 
        This is a test environment. Use the buttons below to
        simulate payment success or failure.
      </p>
    </div>

    <div className="space-y-3">
      <button onClick={handlePaymentSuccess}>
        ✓ Simulate Payment Success
      </button>
      <button onClick={handlePaymentFail}>
        ✗ Simulate Payment Failed
      </button>
    </div>

    <div className="p-4 bg-yellow-50 border border-yellow-200">
      <p>
        <strong>Note:</strong> In production, this would redirect to an 
        actual payment gateway (Razorpay, Stripe, etc.).
      </p>
    </div>
  </div>
);
```

### 5. User Clicks Success Button

```typescript
const handlePaymentSuccess = async () => {
  const transactionRef = generateTransactionRef();
  await api.confirmPayment(registrationId, transactionRef);
  navigate(`/confirmation?registrationId=${registrationId}`);
};
```

**What it calls:**
```typescript
// client/src/services/api.ts
export async function confirmPayment(registrationId: string, transactionRef: string) {
  const response = await api.post('/payments/confirm', {
    registrationId,
    transactionRef,
  });
  return response.data;
}
```

### 6. Backend Confirms Payment

```typescript
router.post('/confirm', async (req: AuthRequest, res: Response) => {
  const { registrationId, transactionRef } = PaymentConfirmSchema.parse(req.body);

  // MOCK PAYMENT - In production, verify with actual payment gateway
  // Example: const isValid = await razorpay.verify(transactionRef);
  // Example: const isValid = await stripe.confirm(transactionRef);
  
  const team = await teamService.confirmPayment(registrationId);

  res.json({
    success: true,
    registrationId: team.registrationId,
    status: team.status,  // Now: CONFIRMED
    message: 'Payment confirmed successfully',
  });
});
```

### 7. Confirmation Page Shows

```typescript
// Redirects to /confirmation?registrationId=REG-12345
// Shows: "Registration Complete! Team Verified!"
// Status: CONFIRMED
```

---

## Database Changes During Flow

### Before Payment

```javascript
// Team document
{
  _id: ObjectId("..."),
  registrationId: "REG-12345",
  teamName: "CodeStorm Team",
  status: "PENDING_PAYMENT",  // ← User just registered
  payment: ObjectId("pay-123"),
  ...
}

// Payment document
{
  _id: ObjectId("pay-123"),
  teamId: ObjectId("..."),
  amount: 500,
  currency: "INR",
  status: "Pending",  // ← Not yet paid
  transactionRef: null,
  provider: "mock",
  ...
}
```

### After Clicking Success

```javascript
// Team document
{
  _id: ObjectId("..."),
  registrationId: "REG-12345",
  teamName: "CodeStorm Team",
  status: "CONFIRMED",  // ← Updated!
  payment: ObjectId("pay-123"),
  ...
}

// Payment document
{
  _id: ObjectId("pay-123"),
  teamId: ObjectId("..."),
  amount: 500,
  currency: "INR",
  status: "Success",  // ← Updated!
  transactionRef: "TXN-abc123def456",  // ← Generated
  provider: "mock",
  ...
}
```

---

## The Key Issue: No Real Payment Processing

### What Actually Happens Now:
```typescript
// In payments.ts line 46
// ❌ MOCK - Just accepts the button click
const team = await teamService.confirmPayment(registrationId);
```

### What Should Happen (After Integration):
```typescript
// With Razorpay Example:
const payment = await Payment.findById(team.payment);

// ✅ Real - Verify with payment gateway
const response = await razorpay.payments.fetch(paymentId);
if (response.status !== 'captured') {
  throw new Error('Payment not captured in payment gateway');
}

const team = await teamService.confirmPayment(registrationId);
```

---

## Summary

| Stage | Current Behavior |
|-------|------------------|
| User enters payment details | Shows form with ₹500 amount |
| User submits payment | **Clicks button instead of entering card** |
| Backend processes | **Accepts button click without verification** |
| Database updates | **Updates status as if paid** |
| Confirmation shown | **Shows success even though no money taken** |
| Real money flow | ❌ **NONE** |

---

## To Make It Real

You need to:

1. **Choose a provider**: Razorpay (India) or Stripe (Global)
2. **Get API credentials**: From provider dashboard
3. **Add to backend**: Implement verification logic
4. **Update frontend**: Add real payment form
5. **Test with test credentials**: Use provider's test cards
6. **Go live**: Switch to production credentials

**See `PAYMENT_INTEGRATION_GUIDE.md` for complete implementation steps!**
