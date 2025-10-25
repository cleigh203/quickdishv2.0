import { createServer } from 'vite';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function run() {
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });
  try {
    const mod = await server.ssrLoadModule('/src/utils/recipeAudit.ts');
    const { auditFirstNLunch, toJson } = mod;
    const records = auditFirstNLunch(25);
    process.stdout.write(toJson(records));
  } finally {
    await server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


