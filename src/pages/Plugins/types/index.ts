// types/plugin.ts
export interface XPlugin {
  id: number;
  name: string;
  icon?: object | string;
  version: string;
  description: string;
  enabled: boolean;
  component: string;
  activate?: () => void;
  deactivate?: () => void;
}
