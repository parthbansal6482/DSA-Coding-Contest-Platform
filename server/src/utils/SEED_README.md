# Database Seeding Scripts

This directory contains scripts to populate your database with test data.

## Available Scripts

### 1. `npm run seed`
**File:** `seed.js`  
**Purpose:** Creates only the admin account  
**Use when:** Initial setup or when you just need an admin account

```bash
cd server
npm run seed
```

**Creates:**
- 1 Admin account (admin@contest.com / admin123)

---

### 2. `npm run seed-data`
**File:** `seed-data.js`  
**Purpose:** Adds sample data WITHOUT deleting existing data  
**Use when:** You want to add test data but keep existing records

```bash
cd server
npm run seed-data
```

**Adds (if not exists):**
- 1 Admin account
- 10 DSA Questions (Easy, Medium, Hard)
- 5 Sample Teams (3 approved, 2 pending)

---

### 3. `npm run seed-fresh` ⚠️ **DESTRUCTIVE**
**File:** `seed-fresh.js`  
**Purpose:** Clears ALL data and creates fresh test data  
**Use when:** You want a clean slate for testing

```bash
cd server
npm run seed-fresh
```

**⚠️ WARNING:** This will DELETE:
- All Submissions
- All Rounds
- All Questions
- All Teams
- (Admin is preserved)

**Creates:**
- 1 Admin account
- 10 DSA Questions
- 5 Sample Teams

---

## Test Data Details

### Admin Account
- **Email:** admin@contest.com
- **Password:** admin123

### Sample Teams (Approved)
1. **CodeNinjas** - 3 members
2. **BinaryBeasts** - 2 members
3. **AlgoMasters** - 3 members

**Team Password:** team123 (for all teams)

### Sample Teams (Pending Approval)
4. **StackOverflow** - 2 members
5. **RecursiveRebels** - 3 members

### Questions (10 Total)

#### Easy (3)
1. Two Sum - Arrays
2. Valid Parentheses - Stack
3. Reverse Linked List - Linked List

#### Medium (4)
4. Longest Substring Without Repeating Characters - Sliding Window
5. Container With Most Water - Two Pointers
6. Binary Tree Level Order Traversal - Binary Tree
7. Merge Intervals - Intervals

#### Hard (3)
8. Word Ladder - Graph
9. Trapping Rain Water - Dynamic Programming
10. Median of Two Sorted Arrays - Binary Search

---

## Usage Examples

### Fresh Start for Testing
```bash
# Clear everything and start fresh
npm run seed-fresh

# Now you have:
# - 10 questions to create rounds with
# - 3 approved teams ready to compete
# - 2 pending teams to test approval workflow
```

### Add More Data Without Losing Existing
```bash
# Adds sample data if it doesn't exist
npm run seed-data
```

### Just Need Admin
```bash
# Only creates admin account
npm run seed
```

---

## Notes

- All passwords are **test passwords** - change them in production!
- The `seed-fresh` script is perfect for resetting your test environment
- Questions include full descriptions, examples, and test case counts
- Teams have realistic member data for testing
