import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  nativeTheme,
} from "electron";

import path = require("path");
import EventEmitter = require("events");

import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";
import { IPC } from "@el3um4s/ipc-for-electron";

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

const appName = "appName";

const defaultSettings = {
  title: appName,
  width: 854,
  height: 480,
  frame: false,
  backgroundColor: "#FFF",
};

class ElectronWindow {
  window!: BrowserWindow;
  settings: { [key: string]: unknown };
  onEvent: EventEmitter = new EventEmitter();
  preload!: string;

  browserView!: BrowserView;

  constructor(
    settings: Electron.BrowserWindowConstructorOptions | null = null
  ) {
    this.settings = settings
      ? { ...defaultSettings, ...settings }
      : { ...defaultSettings };
  }

  createWindow(options?: CreateWindow): BrowserWindow {
    const {
      url = "",
      iconPath = path.join(__dirname, "icon.png"),
      preload = path.join(__dirname, "preload.js"),
      themeSource = "system",
    } = options ? options : {};

    this.preload = preload;

    const settings = { ...this.settings };
    app.name = appName;

    const window = new BrowserWindow({
      ...settings,
      icon: iconPath,
      show: false,
      webPreferences: {
        preload,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    });

    window.loadURL(url);

    nativeTheme.themeSource = themeSource;

    window.once("ready-to-show", () => {
      window.show();
    });

    this.window = window;
    return window;
  }

  async setIpcMain(api: Array<IPC>): Promise<void> {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.window));
  }

  async addBrowserView(options?: CreateBrowserView): Promise<void> {
    const { url = "", preload = this.preload } = options ? options : {};
    const {
      bounds = {
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        show: true,
      },
    } = options ? options : {};
    const {
      paddingLeft = 0,
      paddingTop = 0,
      paddingRight = 0,
      paddingBottom = 0,
      show = true,
    } = bounds;

    const [width, height] = this.window.getSize();

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload,
      },
    });

    this.window.setBrowserView(this.browserView);

    if (show) {
      this.browserView.setBounds({
        x: paddingLeft,
        y: paddingTop,
        width: width - paddingRight,
        height: height - paddingBottom,
      });

      this.browserView.setAutoResize({
        width: true,
        height: true,
      });
    } else {
      this.browserView.setBounds({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });

      this.browserView.setAutoResize({
        width: false,
        height: false,
      });
    }

    if (url != "") {
      this.browserView.webContents.loadURL(url);
    }
  }

  async addBrowserViewHidden(options?: CreateBrowserView): Promise<void> {
    const bounds = {
      paddingLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      show: false,
    };
    this.addBrowserView({ ...options, bounds });
  }

  async setIpcMainView(api: Array<IPC>): Promise<void> {
    api.forEach(async (el) => el.initIpcMain(ipcMain, this.browserView));
  }

  async addAutoUpdater(): Promise<void> {
    this.setIpcMain([autoUpdater]);
    autoUpdater.initAutoUpdater(this.window);
    autoUpdater.checkForUpdates();
  }
}

export default ElectronWindow;
