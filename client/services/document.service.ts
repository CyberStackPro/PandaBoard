import APIClient from "./api-client";

export interface BlockContent {
  type: string;
  version: number;
  format?: string;
  indent?: number;
  direction?: string;
  value: unknown;
  children?: unknown[];
}

export interface Block {
  document_id: string;
  type?: string;
  content: BlockContent;
  sort_order: number;
  parent_block_id?: string;
}

export interface Document {
  id: string;
  title: string;
  project_id: string;
  blocks?: Block[];
}

export const documentsService = new APIClient<Document>("/documents/create");
export const blocksService = new APIClient<Block>("/blocks");
