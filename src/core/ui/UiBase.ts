import { Page } from '@playwright/test';

export class UiBase {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async waitForUrl(urlPart: string) {
    await this.page.waitForURL(`**/${urlPart}**`);
  }

  protected async goto(path: string) {
    await this.page.goto(path);
  }
}
