import { test, expect } from "@playwright/test";
import { participantList } from "./mockParticipantData";

test.describe("History Menu", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });

        await page.goto("http://localhost:3000");
        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();
        await listItems[0].click(); // First patient in the list (Dariana Hoppe, highest number of ICD codes)

        await page.getByRole("heading", {
            name: "< Back"
        }).click()
        await expect(page).toHaveURL("http://localhost:3000/");
        await expect(page.locator("button#history-button")).toBeVisible();
    });
    

    test("history button toggles menu", async ({ page }) => {
        const button = page.locator("button#history-button");
        await button.click();
        await expect(page.locator(`p:has-text("Viewing History")`)).toBeVisible();
        await button.click()
        await expect(page.locator(`p:has-text("Viewing History")`)).toBeHidden();
    });

    test("participants appear in history", async ({ page }) => {
        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems = await page.locator('.ppt-history-link').all();

        const nameText = await historyItems[0].locator("h3").innerText();
        expect(nameText).toBe("Dariana Hoppe");

        // click another patient
        const listItems2 = await page.locator('.ppt-list-item').all();
        await listItems2[3].click(); // Fourth patient in the order, Travon Cronin

        await page.getByRole("heading", {
            name: "< Back"
        }).click()
        await expect(page).toHaveURL("http://localhost:3000/");
        await expect(page.locator("button#history-button")).toBeVisible();

        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems2 = await page.locator('.ppt-history-link').all();

        // correct order
        const nameText1 = await historyItems2[0].locator("h3").innerText();
        expect(nameText1).toBe("Travon Cronin");
        const nameText2 = await historyItems2[1].locator("h3").innerText();
        expect(nameText2).toBe("Dariana Hoppe");
    });

    test("can click participant names in history", async ({ page }) => {
        // click another patient
        const listItems2 = await page.locator('.ppt-list-item').all();
        await listItems2[3].click(); // Fourth patient in the order, Travon Cronin

        await page.getByRole("heading", {
            name: "< Back"
        }).click()
        await expect(page).toHaveURL("http://localhost:3000/");
        await expect(page.locator("button#history-button")).toBeVisible();

        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems1 = await page.locator('.ppt-history-link').all();

        // correct order
        const nameTextFirst1 = await historyItems1[0].locator("h3").innerText();
        expect(nameTextFirst1).toBe("Travon Cronin");
        const nameTextSecond1 = await historyItems1[1].locator("h3").innerText();
        expect(nameTextSecond1).toBe("Dariana Hoppe");

        await historyItems1[1].click();
        await expect(page).toHaveURL("http://localhost:3000/participant/1"); // ID of Dariana Hoppe is 1
        await page.locator("button#history-button").click();

        // clicking the name should move it to the top of the list
        const historyItems2 = await page.locator('.ppt-history-link').all();
        const nameTextFirst2 = await historyItems2[0].locator("h3").innerText();
        expect(nameTextFirst2).toBe("Dariana Hoppe");
        const nameTextSecond2 = await historyItems2[1].locator("h3").innerText();
        expect(nameTextSecond2).toBe("Travon Cronin");
    });

    test("clicking participant multiple times only adds once", async ({ page }) => {
        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems = await page.locator('.ppt-history-link').all();
        expect(historyItems).toHaveLength(1);
        await historyItems[0].click(); // click Dariana Hoppe again
        await expect(page).toHaveURL("http://localhost:3000/participant/1"); // ID of Dariana Hoppe is 1

        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems2 = await page.locator('.ppt-history-link').all();
        expect(historyItems2).toHaveLength(1);
    });

    test("clear history button works", async ({ page }) => {
        await page.locator("button#history-button").click();
        await page.waitForSelector('.ppt-history-link');
        const historyItems = await page.locator('.ppt-history-link').all();
        expect(historyItems).toHaveLength(1);

        await page.getByRole("button", {
            name: "Clear"
        }).click();
        const historyItems2 = page.locator('.ppt-history-link');
        await expect(historyItems2).toBeHidden();
    });
});