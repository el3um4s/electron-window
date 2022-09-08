export type NameAPI_BrowserView = "browserView";
export type DefaultApiKey = "ipc";

export interface CreateWindow {
  url: string;
  iconPath?: string;
  preload?: string;
  themeSource?: "system" | "light" | "dark";
}

export interface CreateBrowserView {
  url?: string;
  preload?: string;
  bounds?: BrowserViewBounds;
}

export interface BrowserViewBounds {
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  show?: boolean;
}
