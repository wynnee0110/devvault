import { app, ipcMain, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(app.getPath("userData"), "vault.json");
async function readData() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}
ipcMain.handle("vault:get", async () => {
  return await readData();
});
ipcMain.handle("vault:save", async (_, newItem) => {
  const items = await readData();
  const updatedItems = [newItem, ...items];
  await writeData(updatedItems);
  return updatedItems;
});
ipcMain.handle("vault:update", async (_, { id, updates }) => {
  const items = await readData();
  const updatedItems = items.map(
    (item) => item.id === id ? { ...item, ...updates } : item
  );
  await writeData(updatedItems);
  return updatedItems;
});
ipcMain.handle("vault:delete", async (_, id) => {
  const items = await readData();
  const updatedItems = items.filter((item) => item.id !== id);
  await writeData(updatedItems);
  return updatedItems;
});
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    title: "Devvault",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  Menu.setApplicationMenu(null);
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
