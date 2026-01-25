import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiBase {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async apiGET<T>(path: string): Promise<[APIResponse, T]> {
    const response = await this.request.get(path);
    const body = await response.json().catch(() => ({}));
    return [response, body];
  }

  protected async apiPOST<TRes, TReq>(path: string, data: TReq): Promise<[APIResponse, TRes, TReq]> {
    const response = await this.request.post(path, { data });
    const body = await response.json().catch(() => ({}));
    return [response, body, data];
  }

  protected async apiPUT<TRes, TReq>(path: string, data: TReq): Promise<[APIResponse, TRes, TReq]> {
    const response = await this.request.put(path, { data });
    const body = await response.json().catch(() => ({}));
    return [response, body, data];
  }

  protected async apiPATCH<TRes, TReq>(path: string, data: TReq): Promise<[APIResponse, TRes, TReq]> {
    const response = await this.request.patch(path, { data });
    const body = await response.json().catch(() => ({}));
    return [response, body, data];
  }

  protected async apiDELETE<T>(path: string): Promise<[APIResponse, T]> {
    const response = await this.request.delete(path);
    const body = await response.json().catch(() => ({}));
    return [response, body];
  }
}