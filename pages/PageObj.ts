import { Page } from "@playwright/test";

export class PageObj {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}
