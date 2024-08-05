#!/usr/bin/env node
import {runCli} from './run-cli.js';

function errorHasMessage(error: unknown): error is {message: string} {
    return 'message' in (error as any) && typeof (error as any).message === 'string';
}

runCli({
    rawArgs: process.argv,
    cliFilePath: import.meta.filename,
    cwd: process.cwd(),
}).catch((error: unknown) => {
    if (errorHasMessage(error)) {
        console.error(error.message);
    } else {
        console.error(error);
    }
    process.exit(1);
});
