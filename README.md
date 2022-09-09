# Electron Window

Electron - create a window with optional autoupdater and browserview

NPM link: [@el3um4s/electron-window](https://www.npmjs.com/package/@el3um4s/electron-window)

### Install and use the package

To use the package in a project:

```bash
npm i @el3um4s/electron-window
```

Then in a file:

```ts
import ElectronWindow from "@el3um4s/electron-window";
import windowControls from "@el3um4s/renderer-for-electron-window-controls";

const createWindow = async (options: {
  url: string;
  preload: string;
  themeSource?: "system" | "light" | "dark";
  settings?: Electron.BrowserWindowConstructorOptions;
}): Promise<ElectronWindow> => {
  let window: ElectronWindow;

  const { url, themeSource = "system", preload } = options;

  const settings = {
    ...options?.settings,
    title: "GEST DASHBOARD",
  };
  window = new ElectronWindow(settings);

  window.createWindow({ url, themeSource, preload });

  await window.setIpcMain([windowControls]);

  await window.addBrowserViewHidden();
  await window.setIpcMainView([windowControls]);

  window.addAutoUpdater();
  return window;
};

let electronWindow: ElectronWindow;

electronWindow = await createWindow({
  url,
  preload,
  themeSource: "light",
  settings: {
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64),
  },
});
```

To use in the renderer install:

```bash
npm i @el3um4s/electron-window @el3um4s/renderer-electron-window-browser-view  @el3um4s/ipc-for-electron
```

Then in the preload file:

```ts
import { generateContextBridge } from "@el3um4s/ipc-for-electron";
import { browserView } from "@el3um4s/electron-window";

const listAPI = [browserView];

generateContextBridge(listAPI, "ipc");
```

Then in the renderer:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.openInBrowserView({ url: "https://www.google.com", apiKey: "ipc" });

browserView.showBrowserView({
  bounds: {
    paddingLeft: 64,
    paddingTop: 64,
    paddingRight: 128,
    paddingBottom: 128,
  },
  apiKey: "ipc",
});

browserView.on.browserViewCanBeShowed({
  callback: (data) => {
    console.log(data);
  },
});
```

### API: main process

`new ElectronWindow(settings?: Electron.BrowserWindowConstructorOptions):ElectronWindow`: create a new instance of ElectronWindow

```ts
import ElectronWindow from "@el3um4s/electron-window";

let window: ElectronWindow;

const settings = {
  title: "GEST DASHBOARD",
  backgroundColor: "red",
};

window = new ElectronWindow(settings);
```

`createWindow(options?: CreateWindow): BrowserWindow`: create a new window

```ts
import ElectronWindow from "@el3um4s/electron-window";

let window: ElectronWindow;

const options = {
  url: "https://www.google.com",
  themeSource: "light",
  preload: "path/to/preload.js",
};

window = new ElectronWindow();
window.createWindow(options);
```

`async setIpcMain(api: Array<IPC>): Promise<void>`: set the ipcMain for the window

Use `el3um4s/ipc-for-electron` ([GitHub](https://github.com/el3um4s/ipc-for-electron), [NPM](https://www.npmjs.com/package/@el3um4s/ipc-for-electron)) to set the ipcMain for the window

```ts
import ElectronWindow from "@el3um4s/electron-window";
import windowControls from "@el3um4s/renderer-for-electron-window-controls";

let window: ElectronWindow;

window = new ElectronWindow();
window.createWindow();

const listAPI = [windowControls];
await window.setIpcMain(listAPI);
```

`async addAutoUpdater(): Promise<void>`: add the autoUpdater to the window

If you want to use the autoupdater, you need to install

- `el3um4s/ipc-for-electron` ([GitHub](https://github.com/el3um4s/ipc-for-electron), [NPM](https://www.npmjs.com/package/@el3um4s/ipc-for-electron))
- `el3um4s/ipc-for-electron-auto-updater` ([GitHub](https://github.com/el3um4s/ipc-for-electron), [NPM](https://www.npmjs.com/package/@el3um4s/ipc-for-electron))
- `el3um4s/renderer-for-electron-auto-updater` ([GitHub](https://github.com/el3um4s/ipc-for-electron), [NPM](https://www.npmjs.com/package/@el3um4s/ipc-for-electron))

```bash
npm i @el3um4s/electron-window @el3um4s/ipc-for-electron @el3um4s/ipc-for-electron-auto-updater @el3um4s/renderer-for-electron-auto-updater
```

In the main process:

```ts
import ElectronWindow from "@el3um4s/electron-window";

let window: ElectronWindow;

window = new ElectronWindow();
window.createWindow();

window.addAutoUpdater();
```

In the preload file:

```ts
import { generateContextBridge } from "@el3um4s/ipc-for-electron";
import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";

const listAPI = [autoUpdater];

generateContextBridge(listAPI, "ipc");
```

`async addBrowserView(options?: CreateBrowserView): Promise<void>`: add a browserView to the window

```ts
import ElectronWindow from "@el3um4s/electron-window";

let window: ElectronWindow;

window = new ElectronWindow();
window.createWindow();

const options = {
  url: "https://www.google.com",
  preload: "path/to/preload.js",
  bounds: {
    paddingLeft: 64,
    paddingTop: 64,
    paddingRight: 64,
    paddingBottom: 64,
  },
};

await window.addBrowserView(options);
```

`async addBrowserViewHidden(options?: CreateBrowserView): Promise<void>`: add a browserView to the window and hide it

```ts
import ElectronWindow from "@el3um4s/electron-window";

let window: ElectronWindow;

window = new ElectronWindow();
window.createWindow();

const options = {
  url: "https://www.google.com",
  preload: "path/to/preload.js",
};

await window.addBrowserViewHidden(options);
```

`async setIpcMainView(api: Array<IPC>): Promise<void>`: set the ipcMain for the browserView

Use `el3um4s/ipc-for-electron` ([GitHub](https://github.com/el3um4s/ipc-for-electron), [NPM](https://www.npmjs.com/package/@el3um4s/ipc-for-electron)) to set the ipcMain for the window

```ts
import ElectronWindow from "@el3um4s/electron-window";
import systemInfo from "@el3um4s/ipc-for-electron-system-info";

let window: ElectronWindow;

window = new ElectronWindow();
window.createWindow();

const options = {
  url: "https://www.google.com",
  preload: "path/to/preload.js",
};

await window.addBrowserViewHidden(options);

const listAPI = [systemInfo];
await window.setIpcMainView(listAPI);
```

### API: browserView - Electron Side

- `openInBrowserView`: open the url in the browserView.
- `showBrowserView`: show the browserView. The response is sent to the `showBrowserView` channel.
- `resizeBrowserViewToMaximized`: resize the browserView to the maximized size.
- `resizeBrowserViewToUnMaximized`: resize the window to the un-maximized size.
- `removeBrowserView`: remove the browserView.
- `openBrowserViewDevTools`: open the devTools of the browserView.
- `printBrowserView`: print the browserView.
- `goBackBrowserView`: go back in the browserView.
- `goForwardBrowserView`: go forward in the browserView.
- `reloadCurrentPageBrowserView`: reload the current page in the browserView.

### API: browserView - Renderer Side

`on.browserViewCanBeShowed = async (options: { callback?: (arg0: boolean) => void; apiKey?: string; }): Promise<boolean>`

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.openInBrowserView({ url: "https://www.google.com", apiKey: "ipc" });

browserView.showBrowserView({
  bounds: {
    paddingLeft: 64,
    paddingTop: 64,
    paddingRight: 128,
    paddingBottom: 128,
  },
  apiKey: "ipc",
});

browserView.on.browserViewCanBeShowed({
  callback: (data) => {
    console.log(data);
  },
});
```

`showBrowserView = async (options: { callback?: (arg0: boolean) => void; apiKey?: string; bounds?: BrowserViewBounds; }): Promise<boolean>`: show the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.openInBrowserView({ url: "https://www.google.com", apiKey: "ipc" });

browserView.showBrowserView({
  bounds: {
    paddingLeft: 64,
    paddingTop: 64,
    paddingRight: 128,
    paddingBottom: 128,
  },
  apiKey: "ipc",
  callback: (data) => {
    console.log(
      data ? "BrowserView can be shown" : "BrowserView can't be shown"
    );
  },
});
```

`openInBrowserView = (options: { apiKey?: string; url: string }): void`: open the url in the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.openInBrowserView({ url: "https://www.google.com", apiKey: "ipc" });
```

`resizeBrowserViewToMaximized = (options?: { apiKey?: string; bounds?: BrowserViewBounds; }): void`: resize the browserView to the maximized size

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

const bounds: {
  paddingLeft: 64;
  paddingTop: 64;
  paddingRight: 64;
  paddingBottom: 64;
};

browserView.resizeBrowserViewToMaximized({ bounds, apiKey: "ipc" });
```

`resizeBrowserViewToUnMaximized = (options?: { apiKey?: string; bounds?: BrowserViewBounds; }): void`: resize the browserView to the un-maximized size

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

const bounds: {
  paddingLeft: 64;
  paddingTop: 64;
  paddingRight: 64;
  paddingBottom: 64;
};

browserView.resizeBrowserViewToUnMaximized({ bounds });
```

`removeBrowserView = (options?: { apiKey?: string }): void`: remove the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.removeBrowserView({ apiKey: "ipc" });
```

`openBrowserViewDevTools = (options?: { apiKey?: string }): void`: open the dev tools window of the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.openBrowserViewDevTools();
```

`printBrowserView = (options?: { apiKey?: string }): void`: print the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.printBrowserView();
```

`goBackBrowserView = (options?: { apiKey?: string }): void`: go back in the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.goBackBrowserView();
```

`goForwardBrowserView = (options?: { apiKey?: string }): void`: go forward in the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.goForwardBrowserView();
```

`reloadCurrentPageBrowserView = (options?: { apiKey?: string }): void`: reload the current page in the browserView

example:

```ts
import browserView from "@el3um4s/renderer-electron-window-browser-view";

browserView.reloadCurrentPageBrowserView();
```

### Default settings

```ts
const defaultSettings = {
  title: appName,
  width: 854,
  height: 480,
  frame: false,
  backgroundColor: "#FFF",
};
```

### Interfaces

**CreateWindow**

```ts
interface CreateWindow {
  url: string;
  iconPath?: string;
  preload?: string;
  themeSource?: "system" | "light" | "dark";
}
```

**CreateBrowserView**

```ts
interface CreateBrowserView {
  url?: string;
  preload?: string;
  bounds?: BrowserViewBounds;
}
```

**BrowserViewBounds**

```ts
interface BrowserViewBounds {
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  show?: boolean;
}
```
