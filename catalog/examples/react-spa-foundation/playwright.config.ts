import { defineConfig, devices } from "@playwright/test"

const port = 4173

export default defineConfig({
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"]
    }
  ],
  reporter: "list",
  testDir: "./e2e",
  testMatch: "**/*.browser.ts",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure"
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    reuseExistingServer: !process.env.CI,
    url: `http://127.0.0.1:${port}`
  },
  workers: process.env.CI ? 1 : undefined
})
