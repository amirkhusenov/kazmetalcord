import { chromium } from "playwright";
import categories from "./category-tree.json";
import { translitCyrillicToLatin } from "./utils";
import PQueue from "p-queue";
import { Category } from "./types";
import { isAxiosError } from "axios";

// const baseUrl = "http://localhost:3000";
const baseUrl = "https://kazmetalcord.vercel.app";
const typedCategories = categories as Category[];

function percentile(arr: number[], p: number): number {
    const sorted = arr.sort((a, b) => a - b);
    const position = (p / 100) * (sorted.length - 1);
    return sorted[Math.floor(position)];
}

const getLeafPaths = (
    categories: Category[],
    path: string[] = []
): string[][] => {
    return categories.flatMap((category) => {
        const currentPath = [...path, category.n];
        return category.s && category.s.length > 0
            ? getLeafPaths(category.s, currentPath)
            : [currentPath];
    });
};

const stressTest = async () => {
    const browser = await chromium.launch({headless: true});
    const allCategories = getLeafPaths(typedCategories);
    console.log(`Total categories: ${allCategories.length}`);
    const queue = new PQueue({ concurrency: 20 });

    const responses: {
        duration: number;
        status: string;
    }[] = [];

    for (const category of allCategories) {
        queue.add(async () => {
            const urlPath = category.map((c) => translitCyrillicToLatin(c)).join("/");
            const url = `${baseUrl}/category/${urlPath}`;
            const context = await browser.newContext();
            const page = await context.newPage();

            const start = Date.now();
            try {
                const response = await page.goto(url, {
                    waitUntil: "load",
                    timeout: 15000,
                });
                const end = Date.now();
                const duration = end - start;

                const status = response?.status() ?? "no response";
                responses.push({ duration, status: status.toString() });

                console.log(`✅ ${url} - ${duration}ms - ${status}`);
            } catch (err) {
                const end = Date.now();
                const errorMessage = isAxiosError(err) ? err.response?.data : "unknown error";
                responses.push({ duration: end - start, status: "error" });
                console.log(`❌ ${url} - ${end - start}ms - ERROR: ${errorMessage}`);
            } finally {
                await page.close();
                await context.close();
            }
        });
    }

    await queue.onIdle();
    await browser.close();

    const durations = responses.map((r) => r.duration);

    console.log(`Total requests: ${responses.length}`);

    const statuses = responses.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log("Status codes:", statuses);
    console.log(`Min: ${Math.min(...durations)}ms`);
    console.log(`Percentile 50: ${percentile(durations, 50)}ms`);
    console.log(`Percentile 75: ${percentile(durations, 75)}ms`);
    console.log(`Percentile 90: ${percentile(durations, 90)}ms`);
    console.log(`Percentile 95: ${percentile(durations, 95)}ms`);
    console.log(`Percentile 99: ${percentile(durations, 99)}ms`);
    console.log(`Max: ${Math.max(...durations)}ms`);
    console.log(`Avg: ${durations.reduce((a, b) => a + b, 0) / durations.length}ms`);
};

stressTest();
