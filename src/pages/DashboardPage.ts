import { UiBase } from '../core/ui/UiBase';
import { expect } from '@playwright/test';

export class DashboardPage extends UiBase {
  
  async goToSessions() {
    await this.page.goto('/dashboard/sessions');
    await expect(this.page).toHaveURL(/\/dashboard\/sessions/);
  }

  async goToCommunicationSettings() {
    await this.page.goto('/dashboard/settings/communication');
    await expect(this.page).toHaveURL(/\/dashboard\/settings\/communication/);
  }

  async verifyTabs() {
    await expect(this.page.getByRole('tab', { name: /Próximas/ })).toBeVisible();
    await expect(this.page.getByRole('tab', { name: /Pasadas/ })).toBeVisible();
  }

  async cancelSession(mentorName: string) {
      // Logic to find the session card by mentor name and click cancel
      // Placeholder since we didn't see a live session
      const sessionCard = this.page.locator('article').filter({ hasText: mentorName }).first();
      await sessionCard.getByRole('button', { name: 'Cancelar' }).click();
      await this.page.getByRole('button', { name: 'Confirmar Cancelación' }).click();
  }
}