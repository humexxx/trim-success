export type ICallableResponse<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error: string };

export interface ICallableRequest<T = void> {
  uid: string;
  data: T extends void ? never : T;
}
