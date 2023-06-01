export interface FolderInterface {
  id: string;
  name: string;
  type: FolderType;
  system?: boolean;
}

export type FolderType = 'chat' | 'prompt';
