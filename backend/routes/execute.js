
const express = require("express");
const router = express.Router();

const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const crypto = require("crypto");

const languages = {
    c: {
        file: "main.c",
        command: "gcc /workspace/main.c -o /tmp/program && exec /tmp/program"
    },
    cpp: {
        file: "main.cpp",
        command: "g++ /workspace/main.cpp -o /tmp/program && exec /tmp/program"
    },
    python: {
        file: "main.py",
        command: "exec python3 /workspace/main.py"
    },
    java: {
        file: "Main.java",
        command: "javac -d /tmp /workspace/Main.java && exec java -cp /tmp Main"
    }
};

router.post("/", async (req, res) => {
    const { code, language, input = "" } = req.body;

    if (
        typeof code !== "string" ||
        !languages[language] ||
        typeof input !== "string"
    ) {
        return res.status(400).json({
            status: "Error",
            message: "Invalid code, language or input."
        });
    }

    if (code.length > 50000 || input.length > 10000) {
        return res.status(413).json({
            status: "Error",
            message: "Code or input is too large."
        });
    }

    let tempDir;
    let containerName;

    try {
        tempDir = await fs.mkdtemp(
            path.join(os.tmpdir(), "codejudge-")
        );

        const config = languages[language];

        await fs.writeFile(
            path.join(tempDir, config.file),
            code
        );

        containerName = `judge-${crypto.randomUUID()}`;

        const args = [
            "run",
            "--name", containerName,
            "--network", "none",
            "--memory", "128m",
            "--memory-swap", "128m",
            "--cpus", "0.5",
            "--pids-limit", "64",
            "--read-only",
            "--tmpfs", "/tmp:rw,exec,nosuid,size=64m,uid=10001,gid=10001",
            "--cap-drop", "ALL",
            "--security-opt", "no-new-privileges",
            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,
            "-i",
            "codejudge-runner",
            "sh",
            "-c",
            config.command
        ];

        const result = await new Promise((resolve, reject) => {
            const docker = spawn("docker", args, {
                windowsHide: true
            });

            let stdout = "";
            let stderr = "";
            let timedOut = false;
            let outputTooLarge = false;
            let settled = false;

            const timer = setTimeout(() => {
                timedOut = true;
                docker.kill();
                spawn("docker", ["kill", containerName], {
                    windowsHide: true
                });
            }, 5000);

            function finish(error, data) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);

                if (error) reject(error);
                else resolve(data);
            }

            docker.stdout.on("data", chunk => {
                stdout += chunk.toString();

                if (stdout.length > 65536) {
                    outputTooLarge = true;
                    spawn("docker", ["kill", containerName], {
                        windowsHide: true
                    });
                    docker.kill();
                }
            });

            docker.stderr.on("data", chunk => {
                stderr += chunk.toString();

                if (stderr.length > 65536) {
                    outputTooLarge = true;
                    spawn("docker", ["kill", containerName], {
                        windowsHide: true
                    });
                    docker.kill();
                }
            });

            docker.on("error", error => finish(error));

            docker.on("close", exitCode => {
                if (timedOut) {
                    return finish(null, {
                        status: "Time Limit Exceeded",
                        output: stdout,
                        error: "Execution exceeded 5 seconds."
                    });
                }

                if (outputTooLarge) {
                    return finish(null, {
                        status: "Output Limit Exceeded",
                        output: "",
                        error: "Program produced too much output."
                    });
                }

                if (exitCode === 0) {
                    return finish(null, {
                        status: "Executed",
                        output: stdout,
                        error: stderr
                    });
                }

                finish(null, {
                    status: "Error",
                    output: stdout,
                    error: stderr || "Compilation or runtime error."
                });
            });

            docker.stdin.on("error", () => {});
            docker.stdin.end(input);
        });

        res.json(result);

    } catch (error) {
        console.error("Execution error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                status: "Error",
                message: "Could not execute the program."
            });
        }
    } finally {
        if (containerName) {
            const cleanup = spawn("docker", ["rm", "-f", containerName], {
                windowsHide: true
            });
            cleanup.on("error", () => {});
        }

        if (tempDir) {
            await fs.rm(tempDir, {
                recursive: true,
                force: true
            }).catch(() => {});
        }
    }
});

module.exports = router;
