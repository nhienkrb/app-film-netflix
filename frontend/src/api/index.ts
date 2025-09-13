import * as apiResource from './api_resource';
export const byGroup = { api: apiResource } as const;
const flat = Object.assign({}, apiResource);
const api = Object.assign({}, flat, byGroup);
export default api;
export const apiGroup = apiResource;