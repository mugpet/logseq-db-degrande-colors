#!/usr/bin/env node

const args = process.argv.slice(2);

function readFlag(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const address = readFlag('--address') ?? 'http://127.0.0.1:12315';
const token = readFlag('--token');
const method = readFlag('--method');
const rawArgs = readFlag('--args') ?? '[]';

if (!token) fail('Missing required --token');
if (!method) fail('Missing required --method');

let parsedArgs;

try {
  parsedArgs = JSON.parse(rawArgs);
} catch (error) {
  fail(`Invalid --args JSON: ${error.message}`);
}

if (!Array.isArray(parsedArgs)) {
  fail('--args must be a JSON array');
}

const response = await fetch(`${address.replace(/\/$/, '')}/api`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ method, args: parsedArgs }),
});

const text = await response.text();

let parsed;

try {
  parsed = JSON.parse(text);
} catch {
  parsed = text;
}

if (!response.ok) {
  console.error(JSON.stringify({ status: response.status, error: parsed }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(parsed, null, 2));