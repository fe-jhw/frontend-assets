import { expect, test, type Page } from "@playwright/test"

async function mockItemList(page: Page) {
  await page.route("**/api/items?*", async (route) => {
    const url = new URL(route.request().url())
    const requestedPage = Number(url.searchParams.get("page") ?? "1")
    const requestedSize = Number(url.searchParams.get("size") ?? "20")

    await route.fulfill({
      json: {
        items: [],
        page: requestedPage,
        size: requestedSize,
        totalItems: 0,
        totalPages: 3
      }
    })
  })
}

test("canonicalizes list URLs and preserves user navigation history", async ({ page }) => {
  await mockItemList(page)
  await page.goto("/?page=01&size=20&status=unknown")

  await expect(page).toHaveURL("/")

  await page.getByRole("button", { name: "Next" }).click()
  await expect(page).toHaveURL("/?page=2")

  await page.goBack()
  await expect(page).toHaveURL("/")
})

test("contains focus while confirming a dirty route transition", async ({ page }) => {
  await page.goto("/items/new")
  await page.getByLabel("Name").fill("Draft item")
  const cancelButton = page.getByRole("button", { name: "Cancel" })

  await cancelButton.click()

  const dialog = page.getByRole("dialog", { name: "Unsaved changes" })
  const keepEditingButton = page.getByRole("button", { name: "Keep editing" })
  const discardButton = page.getByRole("button", { name: "Discard" })
  await expect(dialog).toBeVisible()
  await expect(keepEditingButton).toBeFocused()

  await page.keyboard.press("Shift+Tab")
  await expect(discardButton).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(keepEditingButton).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(discardButton).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(keepEditingButton).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(cancelButton).toBeFocused()

  await cancelButton.click()
  await discardButton.click()
  await expect(page).toHaveURL("/")
})

test("focuses validation and server errors at the form boundary", async ({ page }) => {
  await page.route("**/api/items", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ message: "Internal implementation detail" }),
      contentType: "application/json",
      status: 500
    })
  })
  await page.goto("/items/new")

  const nameInput = page.getByLabel("Name")
  await page.getByRole("button", { name: "Save" }).click()
  await expect(nameInput).toBeFocused()

  await nameInput.fill("Valid item")
  await page.getByRole("button", { name: "Save" }).click()

  const serverError = page.getByRole("alert", { name: "" })
  await expect(serverError).toHaveText("The request failed.")
  await expect(serverError).toBeFocused()
})
