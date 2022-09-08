/* eslint-disable @typescript-eslint/no-unused-vars */

import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow } from "electron";

import { NameAPI_BrowserView as NameAPI } from "./interfaces";
import { BrowserViewBounds } from "./interfaces";

const nameAPI: NameAPI = "browserView";

// to Main
const validSendChannel: SendChannels = {
  showBrowserView: showBrowserView,
  openInBrowserView: openInBrowserView,
  removeBrowserView: removeBrowserView,
  openBrowserViewDevTools: openBrowserViewDevTools,
  printBrowserView: printBrowserView,
  resizeBrowserViewToMaximized: resizeBrowserViewToMaximized,
  resizeBrowserViewToUnMaximized: resizeBrowserViewToUnMaximized,
  goBackBrowserView: goBackBrowserView,
  goForwardBrowserView: goForwardBrowserView,
  reloadCurrentPageBrowserView: reloadCurrentPageBrowserView,
};

// from Main
const validReceiveChannel: string[] = ["showBrowserView"];

const browserView = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default browserView;

// Enter here the functions for ElectronJS

function setBounds(
  customWindow: BrowserWindow,
  bounds: BrowserViewBounds,
  autoResize = true
) {
  const {
    paddingLeft = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    show = true,
  } = bounds;

  const bw = customWindow.getBrowserView();
  const [width, height] = customWindow.getSize();

  if (bw && show) {
    bw.setBounds({
      x: paddingLeft,
      y: paddingTop,
      width: width - paddingRight,
      height: height - paddingBottom,
    });
    bw.setAutoResize({
      width: autoResize,
      height: autoResize,
    });
  } else if (bw && !show) {
    bw.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    bw.setAutoResize({
      width: false,
      height: false,
    });
  }
}

async function openInBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: { url: string }
) {
  const bw = customWindow.getBrowserView();
  if (bw) {
    bw.webContents.loadURL(message.url);
  }
}

async function showBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: BrowserViewBounds
) {
  const bw = customWindow.getBrowserView();

  const { show = true } = message;

  if (show) {
    const canShow = bw ? true : false;
    customWindow.webContents.send("showBrowserView", canShow);
  }

  setBounds(customWindow, message, true);
}

async function resizeBrowserViewToMaximized(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: BrowserViewBounds
) {
  const bw = customWindow.getBrowserView();

  if (bw && bw.getBounds().width > 0) {
    setBounds(customWindow, message, true);
  }
}

async function resizeBrowserViewToUnMaximized(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: BrowserViewBounds
) {
  const bw = customWindow.getBrowserView();
  if (bw && bw.getBounds().width > 0) {
    setBounds(customWindow, message, true);
  }
}

async function removeBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw) {
    customWindow.removeBrowserView(bw);
  }
}

async function openBrowserViewDevTools(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw) {
    bw.webContents.openDevTools();
  }
}

async function printBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw) {
    bw.webContents.print();
  }
}

async function goBackBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw && bw?.webContents?.canGoBack()) {
    bw.webContents.goBack();
  }
}

async function goForwardBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw && bw?.webContents?.canGoForward()) {
    bw.webContents.goForward();
  }
}

async function reloadCurrentPageBrowserView(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: unknown
) {
  const bw = customWindow.getBrowserView();
  if (bw) {
    bw.webContents.reload();
  }
}
