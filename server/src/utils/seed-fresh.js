require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Team = require('../models/Team');
const Question = require('../models/Question');
const Round = require('../models/Round');
const Submission = require('../models/Submission');

const sampleQuestions = [
    {
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        inputFormat: `- First line contains an integer n (2 ≤ n ≤ 10^4) - the length of the array
- Second line contains n space-separated integers representing the array
- Third line contains the target integer`,
        outputFormat: `Two space-separated integers representing the indices of the two numbers`,
        constraints: `- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9
- Only one valid answer exists`,
        examples: [
            {
                input: '4\n2 7 11 15\n9',
                output: '0 1',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            },
            {
                input: '3\n3 2 4\n6',
                output: '1 2',
                explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
            }
        ],
        testCases: 5
    },
    {
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        inputFormat: `A single line containing the string s`,
        outputFormat: `Print "true" if the string is valid, "false" otherwise`,
        constraints: `- 1 ≤ s.length ≤ 10^4
- s consists of parentheses only '()[]{}'`,
        examples: [
            {
                input: '()',
                output: 'true',
                explanation: 'The string contains valid parentheses.'
            },
            {
                input: '()[]{}',
                output: 'true',
                explanation: 'All brackets are properly closed.'
            },
            {
                input: '(]',
                output: 'false',
                explanation: 'Mismatched bracket types.'
            }
        ],
        testCases: 6
    },
    {
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
        inputFormat: `- First line contains an integer n (0 ≤ n ≤ 5000) - number of nodes
- Second line contains n space-separated integers representing node values`,
        outputFormat: `Print the reversed linked list values space-separated`,
        constraints: `- The number of nodes in the list is in the range [0, 5000]
- -5000 ≤ Node.val ≤ 5000`,
        examples: [
            {
                input: '5\n1 2 3 4 5',
                output: '5 4 3 2 1',
                explanation: 'The linked list is reversed.'
            },
            {
                input: '2\n1 2',
                output: '2 1',
                explanation: 'Simple two-node reversal.'
            }
        ],
        testCases: 7
    },
    {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'Sliding Window',
        description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
        inputFormat: `A single line containing the string s`,
        outputFormat: `An integer representing the length of the longest substring without repeating characters`,
        constraints: `- 0 ≤ s.length ≤ 5 * 10^4
- s consists of English letters, digits, symbols and spaces`,
        examples: [
            {
                input: 'abcabcbb',
                output: '3',
                explanation: 'The answer is "abc", with the length of 3.'
            },
            {
                input: 'bbbbb',
                output: '1',
                explanation: 'The answer is "b", with the length of 1.'
            },
            {
                input: 'pwwkew',
                output: '3',
                explanation: 'The answer is "wke", with the length of 3.'
            }
        ],
        testCases: 8
    },
    {
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Two Pointers',
        description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
        inputFormat: `- First line contains an integer n (2 ≤ n ≤ 10^5)
- Second line contains n space-separated integers representing heights`,
        outputFormat: `An integer representing the maximum area`,
        constraints: `- n == height.length
- 2 ≤ n ≤ 10^5
- 0 ≤ height[i] ≤ 10^4`,
        examples: [
            {
                input: '9\n1 8 6 2 5 4 8 3 7',
                output: '49',
                explanation: 'The vertical lines are at indices 1 and 8, with heights 8 and 7. Area = min(8,7) * (8-1) = 49.'
            },
            {
                input: '2\n1 1',
                output: '1',
                explanation: 'Area = min(1,1) * (1-0) = 1.'
            }
        ],
        testCases: 10
    },
    {
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'Binary Tree',
        description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
        inputFormat: `- First line contains an integer n - number of nodes
- Second line contains n space-separated integers (use -1 for null nodes)`,
        outputFormat: `Print each level on a new line with space-separated values`,
        constraints: `- The number of nodes in the tree is in the range [0, 2000]
- -1000 ≤ Node.val ≤ 1000`,
        examples: [
            {
                input: '5\n3 9 20 -1 -1 15 7',
                output: '3\n9 20\n15 7',
                explanation: 'Level order traversal of the binary tree.'
            }
        ],
        testCases: 8
    },
    {
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'Intervals',
        description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        inputFormat: `- First line contains an integer n (1 ≤ n ≤ 10^4)
- Next n lines contain two space-separated integers representing start and end of each interval`,
        outputFormat: `Print merged intervals, one per line`,
        constraints: `- 1 ≤ intervals.length ≤ 10^4
- intervals[i].length == 2
- 0 ≤ starti ≤ endi ≤ 10^4`,
        examples: [
            {
                input: '4\n1 3\n2 6\n8 10\n15 18',
                output: '1 6\n8 10\n15 18',
                explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
            }
        ],
        testCases: 9
    },
    {
        title: 'Word Ladder',
        difficulty: 'Hard',
        category: 'Graph',
        description: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.`,
        inputFormat: `- First line: beginWord
- Second line: endWord
- Third line: integer n (number of words in dictionary)
- Next n lines: words in dictionary`,
        outputFormat: `An integer representing the length of shortest transformation sequence`,
        constraints: `- 1 ≤ beginWord.length ≤ 10
- endWord.length == beginWord.length
- 1 ≤ wordList.length ≤ 5000
- All strings contain only lowercase English letters`,
        examples: [
            {
                input: 'hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog',
                output: '5',
                explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
            }
        ],
        testCases: 12
    },
    {
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
        inputFormat: `- First line contains an integer n (1 ≤ n ≤ 2 * 10^4)
- Second line contains n space-separated integers representing heights`,
        outputFormat: `An integer representing the total trapped water`,
        constraints: `- n == height.length
- 1 ≤ n ≤ 2 * 10^4
- 0 ≤ height[i] ≤ 10^5`,
        examples: [
            {
                input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
                output: '6',
                explanation: 'The elevation map traps 6 units of rain water.'
            },
            {
                input: '6\n4 2 0 3 2 5',
                output: '9',
                explanation: 'Water trapped between the bars.'
            }
        ],
        testCases: 15
    },
    {
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        category: 'Binary Search',
        description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
        inputFormat: `- First line: integer m (size of first array)
- Second line: m space-separated integers (sorted)
- Third line: integer n (size of second array)
- Fourth line: n space-separated integers (sorted)`,
        outputFormat: `A decimal number representing the median (rounded to 5 decimal places)`,
        constraints: `- nums1.length == m
- nums2.length == n
- 0 ≤ m ≤ 1000
- 0 ≤ n ≤ 1000
- 1 ≤ m + n ≤ 2000
- -10^6 ≤ nums1[i], nums2[i] ≤ 10^6`,
        examples: [
            {
                input: '2\n1 3\n1\n2',
                output: '2.00000',
                explanation: 'Merged array = [1,2,3] and median is 2.'
            },
            {
                input: '2\n1 2\n2\n3 4',
                output: '2.50000',
                explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
            }
        ],
        testCases: 20
    }
];

const sampleTeams = [
    {
        teamName: 'CodeNinjas',
        password: 'team123',
        members: [
            { name: 'Alice Johnson', email: 'alice@example.com' },
            { name: 'Bob Smith', email: 'bob@example.com' },
            { name: 'Charlie Brown', email: 'charlie@example.com' }
        ],
        status: 'approved'
    },
    {
        teamName: 'BinaryBeasts',
        password: 'team123',
        members: [
            { name: 'David Lee', email: 'david@example.com' },
            { name: 'Emma Wilson', email: 'emma@example.com' }
        ],
        status: 'approved'
    },
    {
        teamName: 'AlgoMasters',
        password: 'team123',
        members: [
            { name: 'Frank Zhang', email: 'frank@example.com' },
            { name: 'Grace Chen', email: 'grace@example.com' },
            { name: 'Henry Park', email: 'henry@example.com' }
        ],
        status: 'approved'
    },
    {
        teamName: 'StackOverflow',
        password: 'team123',
        members: [
            { name: 'Ivy Martinez', email: 'ivy@example.com' },
            { name: 'Jack Robinson', email: 'jack@example.com' }
        ],
        status: 'pending'
    },
    {
        teamName: 'RecursiveRebels',
        password: 'team123',
        members: [
            { name: 'Kate Anderson', email: 'kate@example.com' },
            { name: 'Liam Taylor', email: 'liam@example.com' },
            { name: 'Mia Thomas', email: 'mia@example.com' }
        ],
        status: 'pending'
    }
];

const clearAndSeed = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected\n');
        console.log('⚠️  WARNING: This will DELETE all existing data!\n');

        // Clear all collections
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Submission.deleteMany({}),
            Round.deleteMany({}),
            Question.deleteMany({}),
            Team.deleteMany({}),
            // Keep admin - we'll update it
        ]);
        console.log('✅ Cleared: Submissions, Rounds, Questions, Teams\n');

        // 1. Create/Update Admin
        console.log('📝 Setting up Admin...');
        let admin = await Admin.findOne({ email: 'admin@contest.com' });

        if (!admin) {
            admin = await Admin.create({
                name: 'Admin User',
                email: 'admin@contest.com',
                password: 'admin123',
            });
            console.log('✅ Admin created');
        } else {
            console.log('✅ Admin already exists');
        }
        console.log('   Email: admin@contest.com');
        console.log('   Password: admin123\n');

        // 2. Seed Questions
        console.log('📝 Seeding Questions...');
        const questionsWithAdmin = sampleQuestions.map(q => ({
            ...q,
            createdBy: admin._id
        }));

        await Question.insertMany(questionsWithAdmin);
        console.log(`✅ Created ${sampleQuestions.length} sample questions\n`);

        // 3. Seed Teams (create individually to trigger password hashing)
        console.log('📝 Seeding Teams...');
        for (const teamData of sampleTeams) {
            const teamDoc = {
                ...teamData,
            };

            if (teamData.status === 'approved') {
                teamDoc.approvedBy = admin._id;
                teamDoc.approvedAt = new Date();
            }

            await Team.create(teamDoc);
        }
        console.log(`✅ Created ${sampleTeams.length} sample teams\n`);

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('✨ Database Seeding Complete!');
        console.log('═══════════════════════════════════════\n');

        console.log('📊 Summary:');
        console.log(`   • Admin: 1 account`);
        console.log(`   • Questions: ${await Question.countDocuments()} total`);
        console.log(`   • Teams: ${await Team.countDocuments()} total`);
        console.log(`     - Approved: ${await Team.countDocuments({ status: 'approved' })}`);
        console.log(`     - Pending: ${await Team.countDocuments({ status: 'pending' })}`);
        console.log(`     - Rejected: ${await Team.countDocuments({ status: 'rejected' })}\n`);

        console.log('📋 Questions by Difficulty:');
        console.log(`   • Easy: ${await Question.countDocuments({ difficulty: 'Easy' })}`);
        console.log(`   • Medium: ${await Question.countDocuments({ difficulty: 'Medium' })}`);
        console.log(`   • Hard: ${await Question.countDocuments({ difficulty: 'Hard' })}\n`);

        console.log('🔐 Test Credentials:');
        console.log('   Admin Login:');
        console.log('   • Email: admin@contest.com');
        console.log('   • Password: admin123\n');
        console.log('   Team Login (approved teams):');
        console.log('   • Team Name: CodeNinjas');
        console.log('   • Team Name: BinaryBeasts');
        console.log('   • Team Name: AlgoMasters');
        console.log('   • Password: team123 (for all teams)\n');

        console.log('⚠️  Remember to change default passwords in production!');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error(error);
        process.exit(1);
    }
};

clearAndSeed();
