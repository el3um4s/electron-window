import ElectronWindow from "./ew/ElectronWindow";
import type {
  CreateWindow,
  CreateBrowserView,
  BrowserViewBounds,
} from "./ew/ElectronWindow";

import browserView from "./IPC/BrowserView";

export { CreateWindow, CreateBrowserView, BrowserViewBounds, browserView };
export default ElectronWindow;
