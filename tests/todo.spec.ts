import { test, expect } from "@playwright/test";

test("check home page load", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.locator("h1")).toBeVisible();
});

test("Add a task", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const taskName = `Test ${Date.now()}`;
  await page.getByPlaceholder("Add a new task...").fill(taskName);
  await page.getByText("+ Add").click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText(taskName)).toBeVisible();
});

test("Delete task", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const taskName = `Test ${Date.now()}`;
  await page.getByPlaceholder("Add a new task...").fill(taskName);
  await page.getByText("+ Add").click();
  const taskRow = page.locator("div.flex.items-center", { hasText: taskName });
  await taskRow.getByRole("button", { name: "×" }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText(taskName)).not.toBeVisible();
});

test("check stats page load", async ({ page }) => {
  await page.goto("http://localhost:3000/stats");

  await expect(page.locator("h1")).toBeVisible();
});

test("change priority", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const taskName = `Test ${Date.now()}`;
  await page.getByPlaceholder("Add a new task...").fill(taskName);
  await page.getByText("+ Add").click();
  const taskRow = page.locator("div.flex.items-center", { hasText: taskName });
  await taskRow.getByRole("button", { name: "Medium" }).click();
  await page.waitForLoadState("networkidle");
  await expect(taskRow.getByRole("button", { name: "High" })).toBeVisible();
});

test("check due date", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const taskName = `Test ${Date.now()}`;
  await page.getByPlaceholder("Add a new task...").fill(taskName);
  await page.locator('input[type="date"]').fill('2026-12-31')
  await page.getByText("+ Add").click();
  const taskRow = page.locator("div.flex.items-center", { hasText: taskName });
  await page.waitForLoadState("networkidle");
 await expect(taskRow.locator('p').filter({ hasText: '📅' })).toBeVisible()
});