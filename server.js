/**
 * Static file server + USSD API for the phone simulator.
 * Open http://localhost:3333 in a browser to present the USSD flow.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getInitialResponse, processInput } from './src/flow.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3333;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  // USSD API for simulator
  if (url === '/api/ussd' && (method === 'POST' || method === 'GET')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    try {
      const body = method === 'POST' ? await parseBody(req) : {};
      const sessionId = body.sessionId || 'sim-' + Date.now();
      if (body.input !== undefined && body.input !== '') {
        const result = processInput(sessionId, body.input);
        res.writeHead(200);
        res.end(JSON.stringify({ text: result.text, end: result.end }));
      } else {
        const initial = getInitialResponse(sessionId);
        res.writeHead(200);
        res.end(JSON.stringify({ text: initial.text, end: false, sessionId }));
      }
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: String(e.message) }));
    }
    return;
  }

  let filePath = url === '/' ? '/simulator.html' : url.split('?')[0];
  filePath = path.join(__dirname, 'public', filePath);

  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  HelloDoctor Phone Simulator`);
  console.log(`  Open in browser: http://localhost:${PORT}`);
  console.log(`  (Press Ctrl+C to stop)\n`);
});
