import { buildIpInfoUrl, normalizeSelectedIpAddress } from "./ip-address.js";

const MENU_ID = "open-selection-in-ipinfo";
const INVALID_SELECTION_MESSAGE =
  "Invalid IP address. Select a single valid IPv4 or IPv6 address.";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Open IP in ipinfo.io",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const ipAddress = normalizeSelectedIpAddress(info.selectionText);

  if (!ipAddress) {
    showInvalidSelectionToast(tab?.id);
    return;
  }

  chrome.tabs.create({
    url: buildIpInfoUrl(ipAddress),
    active: true
  });
});

function showInvalidSelectionToast(tabId) {
  if (!tabId) {
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId },
      func: renderInvalidSelectionToast,
      args: [INVALID_SELECTION_MESSAGE]
    })
    .catch(() => {
      // Chrome blocks script injection on internal pages and other restricted URLs.
    });
}

function renderInvalidSelectionToast(message) {
  function getSelectionRect() {
    const selection = window.getSelection?.();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);

    if (rects.length > 0) {
      return rects[rects.length - 1];
    }

    const rect = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      return null;
    }

    return rect;
  }

  function positionToastNearSelection(toast) {
    const margin = 16;
    const gap = 8;
    const selectionRect = getSelectionRect();

    if (!selectionRect) {
      toast.style.top = `${margin}px`;
      toast.style.right = `${margin}px`;
      toast.style.left = "auto";
      return;
    }

    const toastRect = toast.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - toastRect.width - margin);
    const centeredLeft = selectionRect.left + (selectionRect.width - toastRect.width) / 2;
    const left = Math.min(Math.max(centeredLeft, margin), maxLeft);
    const bottomTop = selectionRect.bottom + gap;
    const top =
      bottomTop + toastRect.height + margin <= window.innerHeight
        ? bottomTop
        : Math.max(margin, selectionRect.top - toastRect.height - gap);

    toast.style.top = `${top}px`;
    toast.style.left = `${left}px`;
    toast.style.right = "auto";
  }

  const toastId = "ipinfo-selection-lookup-toast";
  const existingToast = document.getElementById(toastId);

  if (existingToast) {
    existingToast.textContent = message;
    positionToastNearSelection(existingToast);
    window.clearTimeout(existingToast.hideTimeoutId);
    existingToast.hideTimeoutId = window.setTimeout(() => {
      existingToast.remove();
    }, 3500);
    return;
  }

  const toast = document.createElement("div");
  toast.id = toastId;
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.style.position = "fixed";
  toast.style.zIndex = "2147483647";
  toast.style.maxWidth = "min(360px, calc(100vw - 32px))";
  toast.style.boxSizing = "border-box";
  toast.style.padding = "12px 14px";
  toast.style.border = "1px solid #b91c1c";
  toast.style.borderRadius = "6px";
  toast.style.background = "#fee2e2";
  toast.style.color = "#7f1d1d";
  toast.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.18)";
  toast.style.font = "14px/1.4 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  toast.style.letterSpacing = "0";

  document.documentElement.append(toast);
  positionToastNearSelection(toast);

  toast.hideTimeoutId = window.setTimeout(() => {
    toast.remove();
  }, 3500);
}
