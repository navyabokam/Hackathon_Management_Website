# MongoDB E11000 Index Fix Guide

## 🔴 Problem
You're getting `E11000 duplicate key error` on these indexes:
- `leaderEmail_1` 
- `leaderPhone_1`
- `participant1Email_1`
- `mobile_1`

**Root Cause**: These indexes are `unique: true` WITHOUT `sparse: true`, which means MongoDB treats `null` as a duplicate value.

---

## ✅ Solution (3 steps)

### Step 1: Update Schema ✅ (DONE)
Updated `participant1Email` and `mobile` fields to include `sparse: true`:
```typescript
participant1Email: {
  type: String,
  required: true,
  unique: true,
  sparse: true,
  index: true,
},
mobile: {
  type: String,
  required: true,
  unique: true,
  sparse: true,
  index: true,
},
```

Backend has been rebuilt with this change ✅

---

### Step 2: Drop Old Indexes (YOU DO THIS)

Go to **MongoDB Atlas** → Your Cluster → **Collections** → `hackathon.teams` → **Indexes** tab

**Drop these indexes** by clicking the trash icon:
1. ❌ `leaderEmail_1`
2. ❌ `leaderPhone_1`  
3. ❌ `participant1Email_1`
4. ❌ `mobile_1`

**Keep these indexes** (they're fine):
- ✅ `registrationId_1`
- ✅ `teamName_1`
- ✅ `_id_` (MongoDB default)

---

### Step 3: Restart Backend Server

After dropping the indexes, restart the backend:

```bash
cd d:\3_2\Hackathon_Management_Website\server
npm start
```

Mongoose will **automatically recreate** the indexes with `sparse: true`.

---

## 🧪 Verification

To verify the indexes are correct, run in MongoDB Compass or shell:

```javascript
db.teams.getIndexes()
```

Look for `participant1Email_1` and `mobile_1`:
```javascript
{
  "v": 2,
  "key": { "participant1Email": 1 },
  "unique": true,
  "sparse": true
}
```

✅ Must have both `"unique": true` AND `"sparse": true`

---

## 📋 Checklist

- [ ] Drop `leaderEmail_1` index
- [ ] Drop `leaderPhone_1` index
- [ ] Drop `participant1Email_1` index
- [ ] Drop `mobile_1` index
- [ ] Restart backend server (`npm start`)
- [ ] Try registering a new team
- [ ] Verify in MongoDB that new document doesn't have `yourName`/`yourEmail`

---

## ✨ What `sparse: true` Does

- **Ignores documents** where the field is missing or `null`
- **Only enforces uniqueness** when value actually exists
- Allows **multiple `null` values** in the same collection
- **Still blocks duplicate real emails/phone numbers**

This is the **standard practice** for optional unique fields in production MongoDB apps.

---

## 🚀 After Fix

✔ No more `E11000` errors
✔ Multiple teams can register
✔ Duplicate emails/phones still blocked
✔ Clean schema aligned with new data model

**Backend is ready!** Just need those indexes dropped. 🎯
