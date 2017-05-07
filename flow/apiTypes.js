// @flow

type API = {
  get: (uri: string) => Promise<*>,
  post: (uri: string, payload: any) => Promise<*>,
  put: (uri: string, payload: any) => Promise<*>,
  delete: (uri: string) => Promise<*>,
  addMonitor(callback: Function): void,
  setHeader(name: string, value: string): void,
  setHeaders(headers: any): void,
  addRequestTransform(any): void
};
