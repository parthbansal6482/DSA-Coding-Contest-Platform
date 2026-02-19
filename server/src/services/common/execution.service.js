const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');

const docker = new Docker();

// Language configurations
const LANGUAGE_CONFIG = {
    python: {
        image: 'code-executor:latest',
        extension: '.py',
        command: (filename) => ['python3', filename],
        timeout: 10000, // 10 seconds
    },
    cpp: {
        image: 'code-executor:latest',
        extension: '.cpp',
        compile: (filename) => ['g++', '-o', 'program', filename, '-std=c++17'],
        command: () => ['./program'],
        timeout: 10000,
    },
    c: {
        image: 'code-executor:latest',
        extension: '.c',
        compile: (filename) => ['gcc', '-o', 'program', filename],
        command: () => ['./program'],
        timeout: 10000,
    },
    java: {
        image: 'code-executor:latest',
        extension: '.java',
        compile: (filename) => ['javac', filename],
        command: (filename) => ['java', filename.replace('.java', '')],
        timeout: 10000,
    },
};

/**
 * Execute code in a Docker container
 * @param {string} code - Source code to execute
 * @param {string} language - Programming language
 * @param {string} input - Standard input for the program
 * @returns {Promise<Object>} Execution result
 */
async function executeCode(code, language, input = '') {
    const lang = language.toLowerCase();
    const config = LANGUAGE_CONFIG[lang];

    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    let filename = `code${config.extension}`;

    // For Java, the filename MUST match the public class name
    if (lang === 'java') {
        const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/) ||
            code.match(/class\s+([A-Za-z0-9_]+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        filename = `${className}.java`;
    }

    const startTime = Date.now();

    try {
        // Create container
        const container = await docker.createContainer({
            Image: config.image,
            Cmd: ['/bin/bash', '-c', 'sleep 30'], // Keep container alive
            Tty: false,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: true,
            StdinOnce: false,
            NetworkDisabled: true,
            HostConfig: {
                Memory: 256 * 1024 * 1024, // 256MB
                MemorySwap: 256 * 1024 * 1024,
                NanoCpus: 1000000000, // 1 CPU
                PidsLimit: 50,
                ReadonlyRootfs: false,
                AutoRemove: true,
            },
        });

        await container.start();

        // Write code to container
        await container.putArchive(
            createTarArchive(filename, code),
            { path: '/code' }
        );

        let output = '';
        let error = '';
        let executionTime = 0;
        let memoryUsed = 0;

        try {
            // Compile if needed
            if (config.compile) {
                const compileResult = await execInContainer(
                    container,
                    config.compile(filename),
                    '',
                    5000 // 5 second compile timeout
                );

                if (compileResult.exitCode !== 0) {
                    return {
                        success: false,
                        output: '',
                        error: compileResult.stderr || 'Compilation failed',
                        executionTime: 0,
                        memoryUsed: 0,
                    };
                }
            }

            // Execute code
            const execStart = Date.now();
            const execResult = await execInContainer(
                container,
                config.command(filename),
                input,
                config.timeout
            );
            executionTime = Date.now() - execStart;

            output = execResult.stdout;
            error = execResult.stderr;

            // Get memory stats
            const stats = await container.stats({ stream: false });
            memoryUsed = stats.memory_stats.usage || 0;

            return {
                success: execResult.exitCode === 0,
                output: output.trim(),
                error: error.trim(),
                executionTime,
                memoryUsed: Math.round(memoryUsed / 1024), // Convert to KB
                exitCode: execResult.exitCode,
            };
        } finally {
            // Cleanup: stop and remove container
            try {
                await container.stop({ t: 1 });
            } catch (err) {
                // Container might already be stopped
            }
        }
    } catch (error) {
        console.error('Execution error:', error);
        return {
            success: false,
            output: '',
            error: error.message || 'Execution failed',
            executionTime: Date.now() - startTime,
            memoryUsed: 0,
        };
    }
}

/**
 * Execute command in container
 */
async function execInContainer(container, command, stdin, timeout) {
    return new Promise(async (resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Execution timeout'));
        }, timeout);

        try {
            const exec = await container.exec({
                Cmd: command,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
            });

            const stream = await exec.start({
                hijack: true,
                stdin: true,
            });

            let stdout = '';
            let stderr = '';

            // Write stdin
            if (stdin) {
                stream.write(stdin);
            }
            stream.end();

            // Collect output
            stream.on('data', (chunk) => {
                const str = chunk.toString();
                // Docker multiplexes stdout/stderr
                if (chunk[0] === 1) {
                    stdout += str.slice(8);
                } else if (chunk[0] === 2) {
                    stderr += str.slice(8);
                }
            });

            stream.on('end', async () => {
                clearTimeout(timeoutId);
                const inspect = await exec.inspect();
                resolve({
                    stdout,
                    stderr,
                    exitCode: inspect.ExitCode,
                });
            });

            stream.on('error', (err) => {
                clearTimeout(timeoutId);
                reject(err);
            });
        } catch (error) {
            clearTimeout(timeoutId);
            reject(error);
        }
    });
}

/**
 * Create tar archive for file
 */
function createTarArchive(filename, content) {
    const tar = require('tar-stream');
    const pack = tar.pack();

    pack.entry({ name: filename }, content);
    pack.finalize();

    return pack;
}

/**
 * Run code against test cases
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @param {Array} testCases - Array of {input, expectedOutput}
 * @returns {Promise<Object>} Test results
 */
async function runTestCases(code, language, testCases) {
    const results = [];
    let passedCount = 0;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
            const result = await executeCode(code, language, testCase.input);

            const passed = result.success &&
                result.output.trim() === testCase.expectedOutput.trim();

            if (passed) passedCount++;

            results.push({
                testCase: i + 1,
                passed,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.output,
                error: result.error,
                executionTime: result.executionTime,
                memoryUsed: result.memoryUsed,
            });
        } catch (error) {
            results.push({
                testCase: i + 1,
                passed: false,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: '',
                error: error.message,
                executionTime: 0,
                memoryUsed: 0,
            });
        }
    }

    return {
        totalTests: testCases.length,
        passedTests: passedCount,
        failedTests: testCases.length - passedCount,
        results,
    };
}

module.exports = {
    executeCode,
    runTestCases,
    LANGUAGE_CONFIG,
};
