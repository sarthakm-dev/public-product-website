import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '3000';
const secret = (process.env.REVALIDATE_SECRET ?? process.env.NEXTAUTH_SECRET ?? '').trim();
const origin = `http://127.0.0.1:${port}`;
const pathsToWarm = ['/', '/features', '/pricing', '/blog'];

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env,
});

function stopServer(signal = 'SIGTERM') {
  if (!server.killed) {
    server.kill(signal);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/login`, {
        cache: 'no-store',
      });

      if (response.ok) {
        return;
      }
    } catch {}

    await sleep(1000);
  }

  throw new Error('Timed out waiting for Next.js server to start.');
}

async function warmMarketingPages() {
  if (!secret) {
    console.warn('Skipping ISR warmup because no revalidation secret is configured.');
    return;
  }

  const revalidateUrl = `${origin}/api/revalidate?scope=marketing&secret=${encodeURIComponent(secret)}`;
  const revalidateResponse = await fetch(revalidateUrl, {
    cache: 'no-store',
  });

  if (!revalidateResponse.ok) {
    const body = await revalidateResponse.text();
    throw new Error(`Failed to revalidate marketing pages: ${revalidateResponse.status} ${body}`);
  }

  for (const path of pathsToWarm) {
    const response = await fetch(`${origin}${path}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to warm ${path}: ${response.status}`);
    }
  }
}

process.on('SIGINT', () => stopServer('SIGINT'));
process.on('SIGTERM', () => stopServer('SIGTERM'));

server.on('exit', code => {
  process.exit(code ?? 0);
});

try {
  await waitForServer();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stopServer();
  process.exit(1);
}

try {
  await warmMarketingPages();
} catch (error) {
  console.error(
    `ISR warmup failed, continuing without cached refresh: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
}
