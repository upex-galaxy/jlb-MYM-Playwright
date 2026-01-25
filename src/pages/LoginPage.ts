import { UiBase } from '../core/ui/UiBase';
import { expect } from '@playwright/test';

export class LoginPage extends UiBase {
  async navigate() {
    await this.page.goto('/login');
  }

  async loginSuccessfully(email: string, pass: string) {
    await this.page.getByPlaceholder('tu@email.com').fill(email);
    await this.page.getByPlaceholder('••••••••').fill(pass);
    await this.page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await this.page.waitForURL(/\/dashboard/, { timeout: 10000 });
  }

  async loginWithInvalidCredentials(email: string, pass: string) {
    await this.page.getByPlaceholder('tu@email.com').fill(email);
    await this.page.getByPlaceholder('••••••••').fill(pass);
    await this.page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Updated assertion with correct text found in exploration
    await expect(this.page.getByText('Email o contraseña incorrectos')).toBeVisible();
  }
}