
const express = require("express");
const router = express.Router();

const problems = require("../data/problems");
const Submission = require("../models/Submission");

const PORT = process.env.PORT || 5000;

// Get all available problems
router.get("/problems", (req, res) => {
    res.json(problems.map(problem => ({
        id: problem.id,
        title: problem.title,
        description: problem.description,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        testCaseCount: problem.testCases.length
    })));
});

// Get latest 50 submissions
router.get("/history", async (req, res) => {
    try {
        const history = await Submission.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(history);

    } catch (error) {
        console.error("History error:", error.message);

        res.status(500).json({
            status: "Error",
            message: "Could not fetch submission history."
        });
    }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            {
                $match: {
                    username: { $exists: true, $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$username",

                    solvedProblemIds: {
                        $addToSet: {
                            $cond: [
                                { $eq: ["$status", "Accepted"] },
                                "$problemId",
                                null
                            ]
                        }
                    },

                    acceptedSubmissions: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "Accepted"] },
                                1,
                                0
                            ]
                        }
                    },

                    totalSubmissions: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    username: "$_id",

                    solvedProblems: {
                        $size: {
                            $setDifference: [
                                "$solvedProblemIds",
                                [null]
                            ]
                        }
                    },

                    acceptedSubmissions: 1,
                    totalSubmissions: 1
                }
            },
            {
                $sort: {
                    solvedProblems: -1,
                    acceptedSubmissions: -1,
                    username: 1
                }
            },
            {
                $limit: 100
            }
        ]);

        const rankedLeaderboard = leaderboard.map((participant, index) => ({
            rank: index + 1,
            ...participant
        }));

        res.json(rankedLeaderboard);

    } catch (error) {
        console.error("Leaderboard error:", error.message);

        res.status(500).json({
            status: "Error",
            message: "Could not fetch leaderboard."
        });
    }
});

// Submit code and validate test cases
router.post("/", async (req, res) => {
    const { code, language, problemId, username } = req.body;

    if (
        typeof code !== "string" ||
        !["c", "cpp", "python", "java"].includes(language) ||
        typeof username !== "string" ||
        !username.trim() ||
        username.trim().length > 20
    ) {
        return res.status(400).json({
            status: "Error",
            message: "Please provide valid code, language and username (maximum 20 characters)."
        });
    }

    const problem = problems.find(
        p => p.id === Number(problemId)
    );

    if (!problem) {
        return res.status(404).json({
            status: "Error",
            message: "Problem not found."
        });
    }

    const results = [];

    try {
        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];

            const response = await fetch(
                `http://127.0.0.1:${PORT}/api/execute`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code,
                        language,
                        input: testCase.input
                    }),
                    signal: AbortSignal.timeout(10000)
                }
            );

            const execution = await response.json();

            const actualOutput = (execution.output || "").trim();
            const expectedOutput = testCase.expectedOutput.trim();

            const passed =
                execution.status === "Executed" &&
                actualOutput === expectedOutput;

            results.push({
                testCase: i + 1,
                passed,
                status: passed
                    ? "Passed"
                    : execution.status === "Executed"
                        ? "Wrong Answer"
                        : execution.status,
                output: actualOutput
            });
        }

        const passedCount = results.filter(
            result => result.passed
        ).length;

        const submissionStatus =
            passedCount === problem.testCases.length
                ? "Accepted"
                : "Wrong Answer";

        // Save submission in MongoDB
        await Submission.create({
            username: username.trim(),
            problemId: problem.id,
            problemTitle: problem.title,
            language,
            status: submissionStatus,
            passed: passedCount,
            total: problem.testCases.length
        });

        res.json({
            status: submissionStatus,
            passed: passedCount,
            total: problem.testCases.length,
            results
        });

    } catch (error) {
        console.error("Submission error:", error);

        res.status(500).json({
            status: "Error",
            message: "Could not validate or save submission."
        });
    }
});

module.exports = router;
