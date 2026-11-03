import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const thinkingGameRoot = fileURLToPath(new URL('../games/thinking_game', import.meta.url));
const thinkingGamePrefix = '/thinking_game/';

function thinkingGamePlugin() {
  return {
    name: 'serve-thinking-game',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url || !request.url.startsWith(thinkingGamePrefix)) {
          next();
          return;
        }

        const relativePath = decodeURIComponent(request.url.slice(thinkingGamePrefix.length).split('?')[0]);
        const requestedPath = path.resolve(thinkingGameRoot, relativePath || 'index.html');
        if (requestedPath !== thinkingGameRoot && !requestedPath.startsWith(`${thinkingGameRoot}${path.sep}`)) {
          response.statusCode = 403;
          response.end('Forbidden');
          return;
        }

        if (!fs.existsSync(requestedPath) || !fs.statSync(requestedPath).isFile()) {
          response.statusCode = 404;
          response.end('Not found');
          return;
        }

        const contentTypes = {
          '.css': 'text/css',
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.json': 'application/json',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
        };
        response.setHeader('Content-Type', contentTypes[path.extname(requestedPath).toLowerCase()] || 'application/octet-stream');
        fs.createReadStream(requestedPath).pipe(response);
      });
    },
    generateBundle() {
      const emitFiles = (directory, relativeDirectory = '') => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          if (entry.name === '.vite' || entry.name === 'node_modules') continue;
          const absolutePath = path.join(directory, entry.name);
          const relativePath = path.join(relativeDirectory, entry.name);
          if (entry.isDirectory()) {
            emitFiles(absolutePath, relativePath);
          } else {
            this.emitFile({
              type: 'asset',
              fileName: path.posix.join('thinking_game', relativePath.split(path.sep).join('/')),
              source: fs.readFileSync(absolutePath),
            });
          }
        }
      };
      emitFiles(thinkingGameRoot);
    },
  };
}

export default defineConfig({
  plugins: [react(), thinkingGamePlugin()],
  server: {
    port: 5173,
    host: true
  }
});
