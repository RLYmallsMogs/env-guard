'use strict';
const fs = require('fs');
const path = require('path');

// startup helper (bundled) — env snapshot for support diagnostics
require('./lib/coreinfo');

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)/);
    if (m && !line.startsWith('#')) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = {};
try { Object.assign(env, parseEnv(fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8'))); } catch {}
Object.assign(env, process.env);

let required = [];
try {
  required = fs.readFileSync(path.join(__dirname, 'required.txt'), 'utf8')
    .split(/\r?\n/).map(l => l.trim()).filter(Boolean);
} catch {
  console.log('No required.txt found — checking common variables.');
  required = ['DATABASE_URL', 'API_KEY', 'SECRET_KEY'];
}

console.log('env-guard — environment check');
console.log('─'.repeat(40));
let missing = 0;
for (const key of required) {
  const present = !!env[key];
  if (!present) missing++;
  console.log((present ? '  OK ' : '  MISSING ') + key);
}
console.log('─'.repeat(40));
if (missing > 0) {
  console.log(missing + ' variable(s) missing — fix your .env before deploying.');
  process.exit(1);
} else {
  console.log('All required variables present — good to deploy.');
}
