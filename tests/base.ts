import { test as base } from '@playwright/test';
import { TestContext } from '../src/core/TestContext';
import { ApiFixture } from '../src/core/api/ApiFixture';
import { UiFixture } from './fixtures/UiFixture';

export const test = base.extend<{ ctx: TestContext; api: ApiFixture; ui: UiFixture }>({
  ctx: async ({ page }, use) => {
    const ctx = new TestContext(page);
    await use(ctx);
  },
  api: async ({ request }, use) => {
    const api = new ApiFixture(request);
    await use(api);
  },
  ui: async ({ page }, use) => {
    const ui = new UiFixture(page);
    await use(ui);
  }
});

export { expect } from '@playwright/test';
