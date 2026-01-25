import { APIRequestContext } from '@playwright/test';
import { BookingsApi } from './BookingsApi';
import { UsersApi } from './UsersApi';

export class ApiFixture {
  readonly bookings: BookingsApi;
  readonly users: UsersApi;

  constructor(request: APIRequestContext) {
    this.bookings = new BookingsApi(request);
    this.users = new UsersApi(request);
  }
}
