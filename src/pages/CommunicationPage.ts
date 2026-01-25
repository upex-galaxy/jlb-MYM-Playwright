import { UiBase } from '../core/ui/UiBase';

export class CommunicationPage extends UiBase {
  
  async configureChannel(channelName: string, handle?: string) {
    const checkbox = this.page.getByRole('checkbox', { name: channelName });
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
    
    if (handle) {
       let placeholder = '';
       if (channelName === 'Google Meet') placeholder = 'https://meet.google.com/xxx-xxxx-xxx';
       if (channelName === 'WhatsApp') placeholder = '+1 234 567 8900';
       if (channelName === 'Slack') placeholder = 'team.slack.com o #channel';

       if (placeholder) {
         await this.page.getByPlaceholder(placeholder).fill(handle);
       }
    }

    await this.page.getByRole('button', { name: 'Guardar Preferencias' }).click();
  }
}