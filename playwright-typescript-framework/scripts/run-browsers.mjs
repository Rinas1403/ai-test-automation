/**
 * Chạy lần lượt từng project Playwright — mỗi lượt vẫn song song WORKERS luồng (mặc định 5).
 *
 *   node scripts/run-browsers.mjs                         # ui-chrome → ui-edge → ui-firefox
 *   node scripts/run-browsers.mjs api ui-chrome           # chọn project
 *   node scripts/run-browsers.mjs --grep @smoke           # từ tham số "-..." đầu tiên trở đi chuyển thẳng cho playwright test
 *   npm run test:ui -- --grep @smoke                      # tương tự, qua npm
 *
 * Vì sao không dùng `dependencies` của Playwright: một test fail ở Chrome sẽ làm SKIP toàn bộ Edge/Firefox.
 * Ở đây lượt trước fail thì lượt sau vẫn chạy, cuối cùng mới trả exit code 1.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

// Gọi thẳng CLI bằng node (không qua npx/shell) → tham số có dấu cách như --grep "@smoke|@account" không bị tách
const playwrightCli = createRequire(import.meta.url).resolve('@playwright/test/cli');

const DEFAULT_PROJECTS = ['ui-chrome', 'ui-edge', 'ui-firefox'];

const argv = process.argv.slice(2);
const firstOption = argv.findIndex((arg) => arg.startsWith('-'));
const projects = firstOption === -1 ? argv : argv.slice(0, firstOption);
const playwrightArgs = (firstOption === -1 ? [] : argv.slice(firstOption)).filter((arg, i) => !(i === 0 && arg === '--'));
const runList = projects.length > 0 ? projects : DEFAULT_PROJECTS;

const results = runList.map((project, index) => {
  process.stdout.write(`\n=== [${index + 1}/${runList.length}] ${project} ===\n`);
  const startedAt = Date.now();
  const { status } = spawnSync(process.execPath, [playwrightCli, 'test', `--project=${project}`, ...playwrightArgs], {
    stdio: 'inherit',
    env: {
      ...process.env,
      // Lượt đầu dọn allure-results, các lượt sau cộng dồn → 1 report Allure cho mọi trình duyệt
      KEEP_ALLURE_RESULTS: index === 0 ? 'false' : 'true',
      HTML_REPORT_DIR: `reports/html/${project}`,
    },
  });
  return { project, status: status ?? 1, seconds: Math.round((Date.now() - startedAt) / 1000) };
});

process.stdout.write('\n=== Tổng kết ===\n');
for (const { project, status, seconds } of results) {
  process.stdout.write(`${status === 0 ? 'PASS' : 'FAIL'}  ${project.padEnd(12)} ${seconds}s\n`);
}
process.exit(results.some(({ status }) => status !== 0) ? 1 : 0);
