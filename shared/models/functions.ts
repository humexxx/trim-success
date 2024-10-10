export interface ICallableResponse<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface ICallableRequest<T = void> {
  uid: string;
  data?: T;
}
