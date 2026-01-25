import { test } from '../../base';

test.describe('Login Functionality', () => {

  test('should login successfully as Mentor @happy-path', async ({ ui }) => {
    await ui.login.navigate();
    await ui.login.loginSuccessfully('mentor.jlb984@mailinator.com', '8Ap972DAZn3Z239@');
  });

  test('should login successfully as Mentee @happy-path', async ({ ui }) => {
    await ui.login.navigate();
    await ui.login.loginSuccessfully('mentee.jlb984@mailinator.com', '8Ap972DAZn3Z239@');
  });

  test('should show error with invalid password @negative', async ({ ui }) => {
    await ui.login.navigate();
    await ui.login.loginWithInvalidCredentials('mentor.jlb984@mailinator.com', 'WrongPass123!');
  });

  test('should show error with unregistered email @negative', async ({ ui }) => {
    await ui.login.navigate();
    await ui.login.loginWithInvalidCredentials('unregistered.user@mailinator.com', '8Ap972DAZn3Z239@');
  });

});
