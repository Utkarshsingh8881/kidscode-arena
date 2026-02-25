// In-memory database for development
// Replace with PostgreSQL/MongoDB in production

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'student' | 'developer' | 'admin' | 'mentor' | 'parent';
    grade: number;
    avatar: string;
    xp: number;
    level: number;
    rank: string;
    streak: number;
    longestStreak: number;
    streakFreezeUsed: boolean;
    lastActiveDate: string;
    badges: string[];
    solvedProblems: string[];
    parentEmail?: string;
    isVerified: boolean;
    subscription: 'free' | 'pro';
    createdAt: string;
    theme: 'light' | 'dark';
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    grade: number[];
    topics: string[];
    languages: string[];
    testCases: TestCase[];
    hints: string[];
    starterCode: Record<string, string>;
    solution?: string;
    xpReward: number;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

export interface Submission {
    id: string;
    userId: string;
    problemId: string;
    language: string;
    code: string;
    status: 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compilation_error' | 'pending';
    executionTime?: number;
    memory?: number;
    output?: string;
    createdAt: string;
    testResults?: { passed: boolean; input: string; expected: string; actual: string }[];
}

export interface Hackathon {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    problems: string[];
    participants: string[];
    leaderboard: { userId: string; score: number; solvedCount: number; totalTime: number }[];
    isActive: boolean;
    isPremium: boolean;
    createdAt: string;
}

export interface MentorSlot {
    id: string;
    mentorId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: 1 | 2;
    isBooked: boolean;
    studentId?: string;
    meetingLink?: string;
    price: number;
    status: 'available' | 'booked' | 'completed' | 'cancelled';
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: string;
    xpBonus: number;
}

export interface DailyChallenge {
    id: string;
    problemId: string;
    date: string;
    bonusXp: number;
}

// ---------- IN-MEMORY DATA STORES ----------

export const users: User[] = [
    {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@kidscode.com',
        password: '$2a$10$XQxBj7XZQXZQXZQXZQXZQO', // will be set properly
        role: 'admin',
        grade: 0,
        avatar: '🦁',
        xp: 0,
        level: 99,
        rank: 'Admin',
        streak: 0,
        longestStreak: 0,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        solvedProblems: [],
        isVerified: true,
        subscription: 'pro',
        createdAt: new Date().toISOString(),
        theme: 'dark',
    },
    {
        id: 'student-001',
        username: 'alex_coder',
        email: 'alex@example.com',
        password: '$2a$10$demo',
        role: 'student',
        grade: 6,
        avatar: '🐱',
        xp: 2450,
        level: 12,
        rank: 'Silver',
        streak: 7,
        longestStreak: 14,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: ['first-solve', 'streak-7', 'python-beginner', 'hackathon-participant'],
        solvedProblems: ['p1', 'p2', 'p3', 'p5', 'p6', 'p8'],
        isVerified: true,
        subscription: 'pro',
        createdAt: '2024-09-01T00:00:00Z',
        theme: 'light',
    },
    {
        id: 'student-002',
        username: 'maya_dev',
        email: 'maya@example.com',
        password: '$2a$10$demo',
        role: 'student',
        grade: 8,
        avatar: '🦊',
        xp: 3200,
        level: 15,
        rank: 'Gold',
        streak: 12,
        longestStreak: 20,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: ['first-solve', 'streak-7', 'streak-14', 'python-beginner', 'js-beginner', 'hackathon-winner'],
        solvedProblems: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
        isVerified: true,
        subscription: 'pro',
        createdAt: '2024-08-15T00:00:00Z',
        theme: 'dark',
    },
    {
        id: 'student-003',
        username: 'sam_code',
        email: 'sam@example.com',
        password: '$2a$10$demo',
        role: 'student',
        grade: 4,
        avatar: '🐼',
        xp: 800,
        level: 5,
        rank: 'Bronze',
        streak: 3,
        longestStreak: 5,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: ['first-solve'],
        solvedProblems: ['p1', 'p2'],
        isVerified: true,
        subscription: 'free',
        createdAt: '2024-10-01T00:00:00Z',
        theme: 'light',
    },
    {
        id: 'mentor-001',
        username: 'dr_sarah',
        email: 'sarah@kidscode.com',
        password: '$2a$10$demo',
        role: 'mentor',
        grade: 0,
        avatar: '👩‍💻',
        xp: 0,
        level: 0,
        rank: 'Mentor',
        streak: 0,
        longestStreak: 0,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        solvedProblems: [],
        isVerified: true,
        subscription: 'pro',
        createdAt: '2024-07-01T00:00:00Z',
        theme: 'light',
    },
    {
        id: 'dev-001',
        username: 'dev_team',
        email: 'dev@kidscode.com',
        password: '$2a$10$demo',
        role: 'developer',
        grade: 0,
        avatar: '🔧',
        xp: 0,
        level: 0,
        rank: 'Developer',
        streak: 0,
        longestStreak: 0,
        streakFreezeUsed: false,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        solvedProblems: [],
        isVerified: true,
        subscription: 'pro',
        createdAt: '2024-07-01T00:00:00Z',
        theme: 'dark',
    },
];

export const problems: Problem[] = [
    {
        id: 'p1',
        title: 'Hello World',
        description: 'Write a program that prints "Hello, World!" to the console.\n\nThis is your first step into coding! Every programmer starts here.\n\n**Example Output:**\n```\nHello, World!\n```',
        difficulty: 'easy',
        grade: [3, 4, 5, 6],
        topics: ['basics', 'output'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [{ input: '', expectedOutput: 'Hello, World!', isHidden: false }],
        hints: ['Use the print function in Python', 'Use console.log in JavaScript'],
        starterCode: {
            python: '# Write your code here\n',
            javascript: '// Write your code here\n',
            java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
        },
        xpReward: 50,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p2',
        title: 'Add Two Numbers',
        description: 'Read two numbers from input and print their sum.\n\n**Input:** Two integers on separate lines\n**Output:** Their sum\n\n**Example:**\n```\nInput:\n3\n5\nOutput:\n8\n```',
        difficulty: 'easy',
        grade: [3, 4, 5, 6],
        topics: ['basics', 'math', 'input-output'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '3\n5', expectedOutput: '8', isHidden: false },
            { input: '10\n20', expectedOutput: '30', isHidden: false },
            { input: '-5\n5', expectedOutput: '0', isHidden: true },
        ],
        hints: ['Read two inputs separately', 'Convert strings to numbers before adding'],
        starterCode: {
            python: '# Read two numbers and print their sum\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 50,
        createdAt: '2024-01-02T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p3',
        title: 'Even or Odd',
        description: 'Given a number, determine if it is even or odd.\n\n**Input:** A single integer\n**Output:** "Even" if the number is even, "Odd" if odd\n\n**Example:**\n```\nInput: 4\nOutput: Even\n\nInput: 7\nOutput: Odd\n```',
        difficulty: 'easy',
        grade: [3, 4, 5, 6, 7],
        topics: ['basics', 'conditionals'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '4', expectedOutput: 'Even', isHidden: false },
            { input: '7', expectedOutput: 'Odd', isHidden: false },
            { input: '0', expectedOutput: 'Even', isHidden: true },
        ],
        hints: ['Use the modulo operator %', 'A number is even if number % 2 equals 0'],
        starterCode: {
            python: 'n = int(input())\n# Check if n is even or odd\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (n) => {\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 50,
        createdAt: '2024-01-03T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p4',
        title: 'Reverse a String',
        description: 'Given a string, print it in reverse.\n\n**Input:** A single string\n**Output:** The reversed string\n\n**Example:**\n```\nInput: hello\nOutput: olleh\n```',
        difficulty: 'easy',
        grade: [5, 6, 7, 8],
        topics: ['strings', 'basics'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: 'hello', expectedOutput: 'olleh', isHidden: false },
            { input: 'KidsCode', expectedOutput: 'edoCsdiK', isHidden: false },
            { input: 'a', expectedOutput: 'a', isHidden: true },
        ],
        hints: ['In Python, you can use slicing [::-1]', 'Loop through the string backwards'],
        starterCode: {
            python: 's = input()\n# Reverse the string\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (s) => {\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 75,
        createdAt: '2024-01-04T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p5',
        title: 'FizzBuzz',
        description: 'Print numbers from 1 to N. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".\n\n**Input:** A single integer N\n**Output:** Numbers from 1 to N with FizzBuzz rules\n\n**Example (N=5):**\n```\n1\n2\nFizz\n4\nBuzz\n```',
        difficulty: 'medium',
        grade: [6, 7, 8, 9],
        topics: ['loops', 'conditionals'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz', isHidden: false },
            { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: false },
        ],
        hints: ['Check divisibility by both 3 AND 5 first', 'Use a loop from 1 to N'],
        starterCode: {
            python: 'n = int(input())\n# Print FizzBuzz from 1 to n\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const n = parseInt(line);\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 100,
        createdAt: '2024-01-05T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p6',
        title: 'Factorial Calculator',
        description: 'Calculate the factorial of a given number N.\n\n**Input:** A non-negative integer N (0 ≤ N ≤ 20)\n**Output:** N!\n\n**Example:**\n```\nInput: 5\nOutput: 120\n```\n\n**Note:** 5! = 5 × 4 × 3 × 2 × 1 = 120',
        difficulty: 'medium',
        grade: [7, 8, 9, 10],
        topics: ['math', 'loops', 'recursion'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '5', expectedOutput: '120', isHidden: false },
            { input: '0', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '3628800', isHidden: true },
        ],
        hints: ['0! = 1 by definition', 'You can use a loop or recursion'],
        starterCode: {
            python: 'n = int(input())\n# Calculate and print n!\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const n = parseInt(line);\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 100,
        createdAt: '2024-01-06T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p7',
        title: 'Palindrome Check',
        description: 'Check if a given string is a palindrome (reads the same forwards and backwards).\n\n**Input:** A single string (lowercase letters only)\n**Output:** "Yes" if palindrome, "No" otherwise\n\n**Example:**\n```\nInput: racecar\nOutput: Yes\n\nInput: hello\nOutput: No\n```',
        difficulty: 'medium',
        grade: [7, 8, 9, 10],
        topics: ['strings', 'logic'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: 'racecar', expectedOutput: 'Yes', isHidden: false },
            { input: 'hello', expectedOutput: 'No', isHidden: false },
            { input: 'a', expectedOutput: 'Yes', isHidden: true },
            { input: 'abba', expectedOutput: 'Yes', isHidden: true },
        ],
        hints: ['Compare the string with its reverse', 'Use two pointers from start and end'],
        starterCode: {
            python: 's = input()\n# Check if s is a palindrome\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (s) => {\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 100,
        createdAt: '2024-01-07T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p8',
        title: 'Find the Largest Element',
        description: 'Given an array of N integers, find the largest element.\n\n**Input:**\nFirst line: N (size of array)\nSecond line: N space-separated integers\n\n**Output:** The largest element\n\n**Example:**\n```\nInput:\n5\n3 1 4 1 5\nOutput:\n5\n```',
        difficulty: 'easy',
        grade: [6, 7, 8],
        topics: ['arrays', 'loops'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '5\n3 1 4 1 5', expectedOutput: '5', isHidden: false },
            { input: '3\n-1 -5 -2', expectedOutput: '-1', isHidden: true },
        ],
        hints: ['Start with the first element as the maximum', 'Compare each element with the current max'],
        starterCode: {
            python: 'n = int(input())\narr = list(map(int, input().split()))\n# Find and print the largest element\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n    const n = parseInt(lines[0]);\n    const arr = lines[1].split(" ").map(Number);\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 75,
        createdAt: '2024-01-08T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p9',
        title: 'Two Sum',
        description: 'Given an array of integers and a target sum, find two numbers that add up to the target.\n\n**Input:**\nFirst line: N (size of array)\nSecond line: N space-separated integers\nThird line: Target sum\n\n**Output:** Indices of the two numbers (0-indexed), space-separated\n\n**Example:**\n```\nInput:\n4\n2 7 11 15\n9\nOutput:\n0 1\n```',
        difficulty: 'hard',
        grade: [9, 10, 11, 12],
        topics: ['arrays', 'hash-map', 'algorithms'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
            { input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: true },
        ],
        hints: ['Use a hash map to store seen numbers', 'For each number, check if target - number exists in the map'],
        starterCode: {
            python: 'n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n# Find two indices\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n    const n = parseInt(lines[0]);\n    const arr = lines[1].split(" ").map(Number);\n    const target = parseInt(lines[2]);\n    // Your code here\n});',
            java: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target;\n    cin >> target;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 200,
        createdAt: '2024-01-09T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
    {
        id: 'p10',
        title: 'Fibonacci Sequence',
        description: 'Print the first N numbers of the Fibonacci sequence.\n\n**Input:** A positive integer N\n**Output:** First N Fibonacci numbers, space-separated\n\n**Example:**\n```\nInput: 7\nOutput: 0 1 1 2 3 5 8\n```',
        difficulty: 'medium',
        grade: [8, 9, 10, 11],
        topics: ['math', 'loops', 'dynamic-programming'],
        languages: ['python', 'javascript', 'java', 'cpp'],
        testCases: [
            { input: '7', expectedOutput: '0 1 1 2 3 5 8', isHidden: false },
            { input: '1', expectedOutput: '0', isHidden: true },
            { input: '2', expectedOutput: '0 1', isHidden: true },
        ],
        hints: ['Start with 0 and 1', 'Each next number is the sum of the previous two'],
        starterCode: {
            python: 'n = int(input())\n# Print first n Fibonacci numbers\n',
            javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const n = parseInt(line);\n    // Your code here\n});',
            java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}',
        },
        xpReward: 125,
        createdAt: '2024-01-10T00:00:00Z',
        createdBy: 'admin-001',
        isActive: true,
    },
];

export const submissions: Submission[] = [
    {
        id: 'sub-001',
        userId: 'student-001',
        problemId: 'p1',
        language: 'python',
        code: 'print("Hello, World!")',
        status: 'accepted',
        executionTime: 32,
        memory: 9.2,
        output: 'Hello, World!',
        createdAt: '2024-10-01T10:00:00Z',
    },
    {
        id: 'sub-002',
        userId: 'student-001',
        problemId: 'p2',
        language: 'python',
        code: 'a = int(input())\nb = int(input())\nprint(a + b)',
        status: 'accepted',
        executionTime: 45,
        memory: 9.5,
        output: '8',
        createdAt: '2024-10-02T14:30:00Z',
    },
];

export const hackathons: Hackathon[] = [
    {
        id: 'hack-001',
        title: 'Weekend Code Sprint #12',
        description: 'Solve as many problems as you can in 2 hours! Compete with coders from around the world.',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        problems: ['p5', 'p6', 'p7', 'p9'],
        participants: ['student-001', 'student-002'],
        leaderboard: [
            { userId: 'student-002', score: 350, solvedCount: 3, totalTime: 4500 },
            { userId: 'student-001', score: 200, solvedCount: 2, totalTime: 3200 },
        ],
        isActive: true,
        isPremium: false,
        createdAt: '2024-10-01T00:00:00Z',
    },
];

export const mentorSlots: MentorSlot[] = [
    {
        id: 'slot-001',
        mentorId: 'mentor-001',
        date: '2024-11-02',
        startTime: '10:00',
        endTime: '11:00',
        duration: 1,
        isBooked: false,
        price: 25,
        status: 'available',
    },
    {
        id: 'slot-002',
        mentorId: 'mentor-001',
        date: '2024-11-02',
        startTime: '14:00',
        endTime: '16:00',
        duration: 2,
        isBooked: true,
        studentId: 'student-001',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        price: 45,
        status: 'booked',
    },
];

export const badges: Badge[] = [
    { id: 'first-solve', name: 'First Steps', description: 'Solved your first problem!', icon: '🎯', requirement: 'Solve 1 problem', xpBonus: 50 },
    { id: 'streak-7', name: 'On Fire!', description: 'Maintained a 7-day streak', icon: '🔥', requirement: '7-day streak', xpBonus: 100 },
    { id: 'streak-14', name: 'Unstoppable', description: 'Maintained a 14-day streak', icon: '⚡', requirement: '14-day streak', xpBonus: 200 },
    { id: 'streak-30', name: 'Legend', description: 'Maintained a 30-day streak', icon: '👑', requirement: '30-day streak', xpBonus: 500 },
    { id: 'python-beginner', name: 'Python Tamer', description: 'Solved 5 problems in Python', icon: '🐍', requirement: '5 Python solves', xpBonus: 75 },
    { id: 'js-beginner', name: 'JS Ninja', description: 'Solved 5 problems in JavaScript', icon: '⚡', requirement: '5 JavaScript solves', xpBonus: 75 },
    { id: 'cpp-beginner', name: 'C++ Warrior', description: 'Solved 5 problems in C++', icon: '⚔️', requirement: '5 C++ solves', xpBonus: 75 },
    { id: 'java-beginner', name: 'Java Knight', description: 'Solved 5 problems in Java', icon: '☕', requirement: '5 Java solves', xpBonus: 75 },
    { id: 'hackathon-participant', name: 'Hackathon Hero', description: 'Participated in a hackathon', icon: '🏆', requirement: 'Join 1 hackathon', xpBonus: 100 },
    { id: 'hackathon-winner', name: 'Champion', description: 'Won a hackathon!', icon: '🥇', requirement: 'Win a hackathon', xpBonus: 300 },
    { id: 'ten-solves', name: 'Problem Crusher', description: 'Solved 10 problems', icon: '💪', requirement: '10 problems solved', xpBonus: 150 },
    { id: 'fifty-solves', name: 'Code Master', description: 'Solved 50 problems', icon: '🧠', requirement: '50 problems solved', xpBonus: 500 },
];

export const dailyChallenges: DailyChallenge[] = [
    { id: 'dc-001', problemId: 'p5', date: new Date().toISOString().split('T')[0], bonusXp: 50 },
];
