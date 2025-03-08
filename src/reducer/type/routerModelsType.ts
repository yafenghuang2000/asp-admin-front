export interface IRouterResponse {
  id: string;
  label: string;
  path: string;
  children?: IRouterResponse[] | undefined;
}
