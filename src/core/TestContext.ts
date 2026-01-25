import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CommunicationPage } from '../pages/CommunicationPage';
import { MentorsPage } from '../pages/MentorsPage';

export class TestContext {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly dashboardPage: DashboardPage;
  readonly communicationPage: CommunicationPage;
  readonly mentorsPage: MentorsPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.communicationPage = new CommunicationPage(page);
    this.mentorsPage = new MentorsPage(page);
  }
}
