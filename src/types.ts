// types.ts
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

export interface PostingTask {
  source_url: string;
  groups: string[];
  message: string;
}