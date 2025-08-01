import { test, expect } from "@playwright/test";

// Test data for authentication - defined at file scope
const timestamp = Date.now();
const TEST_USER = {
  name: `test-user-${timestamp}`,
  email: `test-user-${timestamp}@example.com`,
  password: "Password123!",
  invalidPassword: "wrongpassword",
};

// Base URL for the application
const BASE_URL = "http://localhost:3000";

// Use serial to ensure tests run in sequence, not in parallel
test.describe.serial("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the auth page before each test
    await page.goto(`${BASE_URL}/auth`);
    // Ensure the auth page title is visible
    await expect(page.getByText("ورود به حساب", { exact: true })).toBeVisible();
  });

  test("should show error toast for invalid credentials", async ({ page }) => {
    // 1. Fill in the sign-in form with invalid credentials
    await page.getByLabel("ایمیل").fill(TEST_USER.email);
    await page.getByLabel("رمز عبور").fill(TEST_USER.invalidPassword);

    // 2. Submit the form
    await page.getByRole("button", { name: "ورود" }).click();

    // 3. Wait for the error toast to appear
    await expect(page.getByText("خطا در ورود به حساب")).toBeVisible({ timeout: 5000 });
  });

  test("should sign up successfully, access protected page, and sign out", async ({ page }) => {
    // 1. Click the "Sign Up" tab
    await page.getByRole("tab", { name: "ثبت نام" }).click();

    // 2. Wait for signup form element to be visible
    await expect(page.getByLabel("تایید رمز عبور")).toBeVisible({ timeout: 5000 });

    // 3. Fill in the sign-up form
    await page.getByLabel("نام و نام‌خانوادگی").fill(TEST_USER.name);
    await page.getByLabel("ایمیل").fill(TEST_USER.email);
    await page.getByLabel("رمز عبور", { exact: true }).fill(TEST_USER.password);
    await page.getByLabel("تایید رمز عبور", { exact: true }).fill(TEST_USER.password);

    // 4. Submit the sign-up form
    await page.locator('[role="tabpanel"][data-state="active"]').getByRole("button", { name: "ایجاد حساب" }).click();

    // 5. Verify redirection to the secret page
    await expect(page).toHaveURL(`${BASE_URL}/secret`);

    // 6. Wait for the signup success toast
    await expect(page.getByText("حساب کاربری شما با موفقیت ساخته شد")).toBeVisible({ timeout: 10000 });

    // 7. Sign out
    await page.getByRole("button", { name: "خروج" }).click();

    // 8. Verify redirection back to auth page
    await expect(page).toHaveURL(`${BASE_URL}/auth?signout=true`);

    // 9. Verify sign out toast
    await expect(page.getByText("خروج با موفقیت انجام شد")).toBeVisible({ timeout: 5000 });
  });

  test("should sign in successfully, access protected page, and sign out", async ({ page }) => {
    // 1. Fill in the sign-in form with valid credentials (using the same TEST_USER from signup)
    await page.getByLabel("ایمیل").fill(TEST_USER.email);
    await page.getByLabel("رمز عبور").fill(TEST_USER.password);

    // 2. Submit the form
    await page.getByRole("button", { name: "ورود" }).click();

    // 3. Verify redirection to the secret page
    await expect(page).toHaveURL(`${BASE_URL}/secret`);

    // 4. Wait for the success toast to appear
    await expect(page.getByText("ورود با موفقیت انجام شد")).toBeVisible({ timeout: 5000 });

    // 5. Verify content on the secret page
    await expect(page.getByText("secret", { exact: true })).toBeVisible();

    // 6. Sign out
    await page.getByRole("button", { name: "خروج" }).click();

    // 7. Verify redirection back to auth page
    await expect(page).toHaveURL(`${BASE_URL}/auth?signout=true`);

    // 8. Verify sign out toast
    await expect(page.getByText("خروج با موفقیت انجام شد")).toBeVisible({ timeout: 5000 });
  });

  test("should redirect to auth page with unauthorized toast when accessing protected page without auth", async ({ page }) => {
    // 1. Try to access the secret page directly without authentication
    await page.goto(`${BASE_URL}/secret`);

    // 2. Verify redirection to auth page with unauthorized parameter
    await expect(page).toHaveURL(`${BASE_URL}/auth?unauthorized=true`);

    // 3. Verify unauthorized toast
    await expect(page.getByText("دسترسی غیر مجاز")).toBeVisible({ timeout: 5000 });
  });
});
