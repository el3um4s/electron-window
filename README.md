# Electron Window (NOT YET TESTED)

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

### API

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
