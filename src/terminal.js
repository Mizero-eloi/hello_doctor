#!/usr/bin/env node
/**
 * HelloDoctor USSD - Terminal Runner
 * Run: npm start  or  node src/terminal.js
 */

import * as readline from 'readline';
import { getInitialResponse, processInput } from './flow.js';

const SESSION_ID = 'terminal-' + Date.now();

function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n--- HelloDoctor USSD (Terminal) ---');
  console.log('Simulate dial: *333#\n');

  const initial = getInitialResponse(SESSION_ID);
  console.log(initial.text);
  console.log('');

  function prompt() {
    rl.question('Reply: ', (input) => {
      const result = processInput(SESSION_ID, input);
      console.log('\n' + result.text + '\n');
      if (result.end) {
        console.log('--- Session ended. Dial *333# to start again. ---\n');
        rl.close();
        process.exit(0);
      }
      prompt();
    });
  }

  prompt();
}

main();
