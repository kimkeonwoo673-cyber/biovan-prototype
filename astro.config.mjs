import { defineConfig } from 'astro/config';
// Static output -> dist/ (plain HTML/CSS/JS; uploadable to Cafe24 via FTP)
// 기본 빌드: 카페24 루트(/)용.  GitHub Pages 시안용:  DEPLOY_TARGET=gh-pages npm run build
const ghPages = process.env.DEPLOY_TARGET === 'gh-pages';
export default defineConfig({
  site: ghPages ? 'https://kimkeonwoo673-cyber.github.io' : 'https://biovankorea.com',
  base: ghPages ? '/biovan-prototype' : '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
