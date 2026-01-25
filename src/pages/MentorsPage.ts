import { UiBase } from '../core/ui/UiBase';

export class MentorsPage extends UiBase {
  async navigate() {
    await this.page.goto('/mentors');
  }

  async bookSession(mentorName: string) {
    // Find mentor card
    const card = this.page.locator('article').filter({ hasText: mentorName }).first();
    await card.getByRole('button', { name: 'Reservar' }).click();
  }

  async completeBooking(communicationChannel: string) {
      // This is hypothetical as I haven't seen the UI
      // 1. Select Time
      await this.page.getByRole('button', { name: /:00/ }).first().click(); // Select first available slot
      await this.page.getByRole('button', { name: 'Continuar' }).click();

      // 2. Communication Selection (MYM-30)
      await this.page.getByText(communicationChannel).click();
      await this.page.getByRole('button', { name: 'Continuar' }).click();

      // 3. Payment/Confirm
      await this.page.getByRole('button', { name: 'Confirmar Reserva' }).click();
  }
}