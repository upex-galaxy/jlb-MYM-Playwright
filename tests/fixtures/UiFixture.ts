import { Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { CommunicationPage } from '../../src/pages/CommunicationPage';
import { MentorsPage } from '../../src/pages/MentorsPage';

export class UiFixture {
  readonly login: LoginPage;
  readonly dashboard: DashboardPage;
  readonly communication: CommunicationPage;
  readonly mentors: MentorsPage;

  constructor(page: Page) {
    this.login = new LoginPage(page);
    this.dashboard = new DashboardPage(page);
    this.communication = new CommunicationPage(page);
    this.mentors = new MentorsPage(page);
  }
}
