
const problems = [
    {
        id: 1,
        title: "Sum of Two Numbers",
        description: "Read two integers and print their sum.",
        inputFormat: "Two integers are given, one per line.",
        outputFormat: "Print the sum of the two integers.",
        constraints: "-1000 <= a, b <= 1000",
        testCases: [
            { input: "10\n20\n", expectedOutput: "30" },
            { input: "5\n7\n", expectedOutput: "12" },
            { input: "-5\n10\n", expectedOutput: "5" },
            { input: "0\n0\n", expectedOutput: "0" }
        ]
    },
    {
        id: 2,
        title: "Even or Odd",
        description: "Read an integer and print Even if it is even, otherwise print Odd.",
        inputFormat: "A single integer is given.",
        outputFormat: "Print Even or Odd.",
        constraints: "-100000 <= n <= 100000",
        testCases: [
            { input: "4\n", expectedOutput: "Even" },
            { input: "7\n", expectedOutput: "Odd" },
            { input: "0\n", expectedOutput: "Even" },
            { input: "-3\n", expectedOutput: "Odd" }
        ]
    },
    {
        id: 3,
        title: "Factorial of a Number",
        description: "Read a non-negative integer and print its factorial.",
        inputFormat: "A single non-negative integer is given.",
        outputFormat: "Print the factorial of the given number.",
        constraints: "0 <= n <= 12",
        testCases: [
            { input: "5\n", expectedOutput: "120" },
            { input: "3\n", expectedOutput: "6" },
            { input: "0\n", expectedOutput: "1" },
            { input: "1\n", expectedOutput: "1" }
        ]
    },
    {
        id: 4,
        title: "Reverse a String",
        description: "Read a string and print the string in reverse order.",
        inputFormat: "A single word is given.",
        outputFormat: "Print the reversed string.",
        constraints: "1 <= string length <= 100",
        testCases: [
            { input: "hello\n", expectedOutput: "olleh" },
            { input: "code\n", expectedOutput: "edoc" },
            { input: "abc\n", expectedOutput: "cba" }
        ]
    },
    {
        id: 5,
        title: "Largest of Three Numbers",
        description: "Read three integers and print the largest number.",
        inputFormat: "Three integers are given, one per line.",
        outputFormat: "Print the largest of the three integers.",
        constraints: "-1000 <= a, b, c <= 1000",
        testCases: [
            { input: "10\n20\n30\n", expectedOutput: "30" },
            { input: "50\n25\n10\n", expectedOutput: "50" },
            { input: "-5\n-2\n-10\n", expectedOutput: "-2" },
            { input: "7\n7\n3\n", expectedOutput: "7" }
        ]
    }
];

module.exports = problems;
