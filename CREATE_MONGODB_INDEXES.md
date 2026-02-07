# Creating MongoDB Indexes - Detailed Instructions

> ⚠️ **CRITICAL**: These indexes MUST be created before deploying or performance will not improve!

## Quick Start

### Option 1: MongoDB Atlas UI (Easiest)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. Go to **Collections** tab
4. Find the `teams` collection
5. Click **Indexes** tab
6. Click **Create Index** and add:

#### Index 1: Text Search
```json
{
  "teamName": "text",
  "collegeName": "text"
}
```
Name it: `teamName_text_collegeName_text`

#### Index 2: Status + Sort
```json
{
  "status": 1,
  "createdAt": -1
}
```
Name it: `status_1_createdAt_-1`

---

### Option 2: MongoDB Shell (Command Line)

1. Open MongoDB Atlas cluster
2. Click **Connect** → **Shell** 
3. Copy the connection string
4. Run these commands:

```javascript
// Create text index for search
db.teams.createIndex(
  { "teamName": "text", "collegeName": "text" },
  { name: "teamName_text_collegeName_text" }
)

// Create compound index for status filter + date sort
db.teams.createIndex(
  { "status": 1, "createdAt": -1 },
  { name: "status_1_createdAt_-1" }
)
```

---

### Option 3: Using Node.js Script

Create `create-indexes.js` in server directory:

```javascript
import mongoose from 'mongoose';
import { Team } from './src/models/index.js';

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Creating indexes...');
    
    // Text index for search
    await Team.collection.createIndex(
      { teamName: 'text', collegeName: 'text' },
      { name: 'teamName_text_collegeName_text' }
    );
    console.log('✅ Text index created');
    
    // Compound index for status + sort
    await Team.collection.createIndex(
      { status: 1, createdAt: -1 },
      { name: 'status_1_createdAt_-1' }
    );
    console.log('✅ Compound index created');
    
    console.log('All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();
```

Then run:
```bash
node create-indexes.js
```

---

## Verifying Indexes Were Created

### In MongoDB Atlas:
1. Go to Collections
2. Click on `teams` collection
3. Go to **Indexes** tab
4. You should see:
   - `_id_` (default)
   - `registrationId_1` (existing)
   - `teamName_1` (existing)
   - `collegeName_1` (existing)
   - `participant1Email_1` (existing)
   - `leaderPhone_1` (existing)
   - `status_1` (existing)
   - ✅ **`teamName_text_collegeName_text`** (NEW)
   - ✅ **`status_1_createdAt_-1`** (NEW)

### Using MongoDB Shell:
```javascript
// List all indexes
db.teams.getIndexes()

// You should see the output including our new indexes
```

---

## Troubleshooting

### "Index already exists"
If you get an error that index exists, it's already created - no action needed!

### Indexes not showing up
- Wait 5-10 minutes for Atlas to process
- Refresh the page
- Check if you picked the right collection (should be `teams`)

### Getting "permission denied"
- Make sure you have database editor role in MongoDB Atlas
- Check IP address is whitelisted (0.0.0.0 for dev)

### After indexes are created, nothing is faster
- Make sure code changes were deployed
- Check that you're running the new code version
- Clear browser cache
- Restart server

---

## Expected Results After Index Creation

Once indexes are created and code is deployed:

```
BEFORE indexes: 
  GET /api/admin/search/teamName/test → 2000-3000ms

AFTER indexes:
  GET /api/admin/search/teamName/test → 100-200ms
```

You should see ~10-20x speedup on search operations and 4-6x speedup on admin team listings.

