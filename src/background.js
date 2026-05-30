import { buildIpInfoUrl, normalizeSelectedIpAddress } from "./ip-address.js";

const MENU_ID = "open-selection-in-ipinfo";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Open IP address in ipinfo.io",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const ipAddress = normalizeSelectedIpAddress(info.selectionText);

  if (!ipAddress) {
    return;
  }

  chrome.tabs.create({
    url: buildIpInfoUrl(ipAddress),
    active: true
  });
});
