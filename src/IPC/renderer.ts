import { NameAPI_BrowserView as NameAPI, DefaultApiKey } from "./interfaces";
import { BrowserViewBounds } from "./interfaces";

const nameAPI: NameAPI = "browserView";
const defaultApiKey: DefaultApiKey = "ipc";

const browserViewCanBeShowed = async (options: {
  callback?: (arg0: boolean) => void;
  apiKey?: string;
}): Promise<boolean> => {
  const { callback } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("showBrowserView", (data: boolean) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const showBrowserView = async (options: {
  callback?: (arg0: boolean) => void;
  apiKey?: string;
  bounds?: BrowserViewBounds;
}): Promise<boolean> => {
  const { callback, bounds } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("showBrowserView", bounds);

  return browserViewCanBeShowed({ callback, apiKey });
};

const openInBrowserView = (options: { apiKey?: string; url: string }): void => {
  const { url } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("openInBrowserView", url);
};

const resizeBrowserViewToMaximized = (options?: {
  apiKey?: string;
  bounds?: BrowserViewBounds;
}): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("resizeBrowserViewToMaximized", options?.bounds);
};

const resizeBrowserViewToUnMaximized = (options?: {
  apiKey?: string;
  bounds?: BrowserViewBounds;
}): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("resizeBrowserViewToUnMaximized", options?.bounds);
};

const removeBrowserView = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("removeBrowserView");
};

const openBrowserViewDevTools = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("openBrowserViewDevTools");
};

const printBrowserView = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("printBrowserView");
};

const goBackBrowserView = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("goBackBrowserView");
};

const goForwardBrowserView = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("goForwardBrowserView");
};

const reloadCurrentPageBrowserView = (options?: { apiKey?: string }): void => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("reloadCurrentPageBrowserView");
};

const renderer = {
  showBrowserView,
  openInBrowserView,
  resizeBrowserViewToMaximized,
  resizeBrowserViewToUnMaximized,
  removeBrowserView,
  openBrowserViewDevTools,
  printBrowserView,
  goBackBrowserView,
  goForwardBrowserView,
  reloadCurrentPageBrowserView,
  on: {
    browserViewCanBeShowed,
  },
};

export default renderer;
