import { test, expect } from "@playwright/test";
import { emptyParticipantList, oneParticipantList, twoParticipantList, participantList } from "./mockParticipantData";

test.describe("Home Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });
        
        await page.goto("http://localhost:3000");
    });

    test("should have correct metadata and title", async ({ page }) => {
        await expect(page).toHaveTitle("IntusCare Coding Challenge");
        await expect(
            page.getByRole("heading", {
                name: "Participants",
            })
        ).toBeVisible();
    });
});

test.describe("Sorting functions", () => {
    const sortedICDDesc = [
        "Dariana Hoppe",
        "Justina Grady",
        "Madisyn Daugherty",
        "Travon Cronin",
        "Tobin Medhurst",
    ];
    const sortedICDAsc = [
        "Tobin Medhurst",
        "Travon Cronin",
        "Madisyn Daugherty",
        "Justina Grady",
        "Dariana Hoppe",
    ];
    const sortedNamesAsc = [
        "Dariana Hoppe",
        "Justina Grady",
        "Madisyn Daugherty",
        "Tobin Medhurst",
        "Travon Cronin",
    ];
    const sortedNamesDesc = [
        "Travon Cronin",
        "Tobin Medhurst",
        "Madisyn Daugherty",
        "Justina Grady",
        "Dariana Hoppe",
    ];
    test.beforeEach(async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });
        
        await page.goto("http://localhost:3000");
    });

    test("should display a list of participants names, ordered by ICD Codes", async ({ page }) => {
        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems.length; i++) {
            const name = await listItems[i].locator('p').first().innerText();
            expect(name).toBe(sortedICDDesc[i]);
        }
    });

    test("order by names button works", async ({ page }) => {
        const orderNamesButton = page.locator('button#names-order');
        const orderNamesIcon = orderNamesButton.locator('img').first();

        await expect(orderNamesIcon).toHaveAttribute('style', /rotate:\s*180deg/); // should be pointed down by default

        await orderNamesButton.click(); // should be in ascending order now
        await expect(orderNamesIcon).toHaveAttribute('style', "");
       
        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems.length; i++) {
            const name = await listItems[i].locator('p').first().innerText();
            expect(name).toBe(sortedNamesAsc[i]);
        }

        await orderNamesButton.click(); // should be in descending order now
        await expect(orderNamesIcon).toHaveAttribute('style', /rotate:\s*180deg/);
        
        await page.waitForSelector('.ppt-list-item');
        const listItems2 = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems2.length; i++) {
            const name = await listItems2[i].locator('p').first().innerText();
            expect(name).toBe(sortedNamesDesc[i]);
        }
    });
    
    test("order by codes button works", async ({ page }) => {
        const orderCodesButton = page.locator('button#codes-order');
        const orderCodesIcon = orderCodesButton.locator('img').first();

        await expect(orderCodesIcon).toHaveAttribute('style', /rotate:\s*180deg/); // should be pointed down by default

        await orderCodesButton.click(); // should be in ascending order now
        await expect(orderCodesIcon).toHaveAttribute('style', "");
        
        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems.length; i++) {
            const name = await listItems[i].locator('p').first().innerText();
            expect(name).toBe(sortedICDAsc[i]);
        }

        await orderCodesButton.click(); // should be in descending order now
        await expect(orderCodesIcon).toHaveAttribute('style', /rotate:\s*180deg/);

        await page.waitForSelector('.ppt-list-item');
        const listItems2 = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems2.length; i++) {
            const name = await listItems2[i].locator('p').first().innerText();
            expect(name).toBe(sortedICDDesc[i]);
        }
    });
    
    test("interchanging order of names and codes", async ({ page }) => {
        const orderNamesButton = page.locator('button#names-order');
        const orderNamesIcon = orderNamesButton.locator('img').first();

        await orderNamesButton.click(); // should be in ascending order now
        await expect(orderNamesIcon).toHaveAttribute('style', "");

        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems.length; i++) {
            const name = await listItems[i].locator('p').first().innerText();
            expect(name).toBe(sortedNamesAsc[i]);
        }

        const orderCodesButton = page.locator('button#codes-order');
        const orderCodesIcon = orderCodesButton.locator('img').first();

        await orderCodesButton.click(); // should be in ascending order now
        await expect(orderCodesIcon).toHaveAttribute('style', "");

        await page.waitForSelector('.ppt-list-item');
        const listItems2 = await page.locator('.ppt-list-item').all();

        for (let i = 0; i < listItems.length; i++) {
            const name = await listItems2[i].locator('p').first().innerText();
            expect(name).toBe(sortedICDAsc[i]);
        }
    });
});

test.describe("Search functions", () => {
    test("searching by names", async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });
        await page.goto("http://localhost:3000");

        const searchInput = page.getByPlaceholder("Search Names...")
        await searchInput.waitFor({ state: 'visible'});
        await page.waitForTimeout(200);
        await searchInput.fill("t");
        await searchInput.press("Enter");

        await page.waitForSelector('.ppt-list-item', { state: 'visible' });
        await expect(page.locator('.ppt-list-item')).toHaveCount(2); // two people's names start with T

    });
    
    test("searching by ICD codes", async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });
        
        await page.goto("http://localhost:3000");

        const searchInput = page.getByPlaceholder("Search ICD Codes...")
        await searchInput.waitFor({ state: 'visible' });
        await page.waitForTimeout(200);
        await searchInput.fill("J");
        await searchInput.press("Enter");
        await page.waitForSelector('.ppt-list-item', { state: 'visible' });
        await expect(page.locator('.ppt-list-item')).toHaveCount(2); // two people have ICD codes starting with J
    });

    test("searching by diagnosis name", async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(twoParticipantList),
            });
        });

        await page.route("https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=covid&maxList=500", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([1, ["U07.1"], null, [["U07.1", "COVID-19"]]])
            });
        });

        await page.goto("http://localhost:3000");

        const searchInput = page.getByPlaceholder("Search Diagnoses...")
        await searchInput.waitFor({ state: 'visible' });
        await page.waitForTimeout(200);
        await searchInput.fill("covid");
        await searchInput.press("Enter");
        await page.waitForSelector('.ppt-list-item', { state: 'visible' });
        await expect(page.locator('.ppt-list-item')).toHaveCount(1); // one person has covid
    });
});

test.describe("Clicking patient goes to focus view", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(participantList),
            });
        });
        
        await page.goto("http://localhost:3000");
    });

    test("should go to focus view when a patient is clicked", async ({ page }) => {
        await page.waitForSelector('.ppt-list-item');
        const listItems = await page.locator('.ppt-list-item').all();
        await listItems[0].click(); // First patient in the list (Dariana Hoppe, highest number of ICD codes)
        await expect(page).toHaveURL(`http://localhost:3000/participant/${1}`); // id of Dariana Hoppe is 1
    });
});
