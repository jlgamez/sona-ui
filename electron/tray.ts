import { app, Menu, nativeImage, Tray } from "electron";
import path from "node:path";

type TrayActions = {
  openSettings: () => void;
  quit: () => void;
};

function trayIcon(here: string) {
  // build/trayTemplate.png (+ @2x); the "Template" suffix lets macOS adapt it to light and dark.
  const dir = app.isPackaged
    ? path.join(process.resourcesPath, "tray")
    : path.resolve(here, "../../build");
  const icon = nativeImage.createFromPath(path.join(dir, "trayTemplate.png"));
  icon.setTemplateImage(true);
  return icon;
}

/** Creates the menu bar icon. Keep the returned Tray referenced or it is garbage collected. */
export function createTray(here: string, actions: TrayActions): Tray {
  const tray = new Tray(trayIcon(here));
  tray.setToolTip("Sona");

  const buildMenu = () =>
    Menu.buildFromTemplate([
      { label: "Open Settings", click: actions.openSettings },
      {
        label: "Start at login",
        type: "checkbox",
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) =>
          app.setLoginItemSettings({
            openAtLogin: item.checked,
            args: item.checked ? ["--hidden"] : [],
          }),
      },
      { type: "separator" },
      { label: "Quit Sona", click: actions.quit },
    ]);

  // Rebuilt on every open so the checkbox shows the real login item state.
  tray.on("click", () => tray.popUpContextMenu(buildMenu()));
  tray.on("right-click", () => tray.popUpContextMenu(buildMenu()));
  return tray;
}
