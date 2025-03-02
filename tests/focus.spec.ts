import { test, expect } from "@playwright/test";
import { oneParticipantList } from "./mockParticipantData";

test.describe("Focus Page", () => {
    const sample_id = 0;

    test.beforeEach(async ({ page }) => {
        await page.route("**/participants", (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(oneParticipantList),
            });
        });

        await page.route(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${"C34"}`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([1, ["C34"], null, [["C34", "diagnosis 1"]]])
            });
        });

        await page.route(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${"J18"}`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([1, ["J18"], null, [["J18", "diagnosis 2"]]])
            });
        });

        await page.route(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${"D07.5"}`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([1, ["D07.5"], null, [["D07.5", "diagnosis 3"]]])
            });
        });

        await page.goto(`http://localhost:3000/participant/${sample_id}`);
    });

    test("should have correct metadata and title", async ({ page }) => {
        await expect(page).toHaveTitle("IntusCare Coding Challenge");
        await expect(
            page.getByRole("heading", {
                name: `${oneParticipantList[sample_id].firstName} ${oneParticipantList[sample_id].lastName}`
            })
        ).toBeVisible();

        await expect(page.locator('p:has-text("ICD Codes")')).toBeVisible();
    });

    test("displays ICD Codes and names", async ({ page }) => {
        await page.waitForSelector('.focus-list-item');
        const listItems = await page.locator('.focus-list-item').all();
        expect(listItems).toHaveLength(oneParticipantList[sample_id].diagnoses.length);

        const expectedDiagnoses = [
            ["C34", "diagnosis 1"],
            ["J18", "diagnosis 2"],
            ["D07.5", "diagnosis 3"]
        ]

        for (let i = 0; i < listItems.length; i++) {
            const diagnosis = oneParticipantList[sample_id].diagnoses[i];
            const diagnosisName = expectedDiagnoses[i][1];
            const diagnosisElement = listItems[i];
            await expect(diagnosisElement.locator('p').first()).toHaveText(diagnosisName);
            await expect(diagnosisElement.locator('p').nth(1)).toHaveText(diagnosis.icdCode);
        }
    });

    test("patient into button works", async ({ page }) => {
        const formatDate = (dateStr: string) => {
            const dateObj = new Date(dateStr);
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const year = dateObj.getFullYear().toString();
            return `${month}/${day}/${year}`;
        }

        await page.waitForSelector('#display-info-button');
        const button = page.locator('#display-info-button');
        await button.click();

        await expect(page.locator(`p:has-text("Date of Birth: ${formatDate(oneParticipantList[0].dateOfBirth)}")`)).toBeVisible();
        await expect(page.locator(`p:has-text("Gender: ${oneParticipantList[0].gender}")`)).toBeVisible();
        await expect(page.locator(`p:has-text("Phone Number: ${oneParticipantList[0].phoneNumber}")`)).toBeVisible();
        await expect(page.locator(`p:has-text("Notes: ")`)).toBeVisible();

        await button.click();

        await expect(page.locator(`p:has-text("Date of Birth: ${formatDate(oneParticipantList[0].dateOfBirth)}")`)).toBeHidden();
        await expect(page.locator(`p:has-text("Gender: ${oneParticipantList[0].gender}")`)).toBeHidden();
        await expect(page.locator(`p:has-text("Phone Number: ${oneParticipantList[0].phoneNumber}")`)).toBeHidden();
        await expect(page.locator(`p:has-text("Notes: ")`)).toBeHidden();

    });

    test("back button works", async ({ page }) => {
        const button = page.getByRole("heading", {
            name: "< Back"
        });
        await button.click();
        await expect(page).toHaveURL("http://localhost:3000/");
    });
});