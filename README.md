# IPInfo Selection Lookup

IPInfo Selection Lookup is a Google Chrome extension that opens a selected IP address in [ipinfo.io](https://ipinfo.io/) from the right-click context menu.

This project is independently developed and is not affiliated with, endorsed by, sponsored by, or associated with IPinfo.

## What It Does

- Adds an **Open IP in ipinfo.io** item to Chrome's context menu when text is selected.
- Validates the selected text as an IPv4 or IPv6 address before opening a new tab.
- Opens `https://ipinfo.io/IP-ADDRESS` for valid selections.
- Shows a temporary in-page message for invalid, empty, partial, or multi-word selections.
- Runs locally in your browser. The extension does not collect, store, track, or transmit user information.
- Opens ipinfo.io only when you explicitly select a valid IP address and click the context menu item.

## Supported IP Address Formats

Examples of valid selections:

```text
8.8.8.8
1.1.1.1
2001:4860:4860::8888
::1
::ffff:192.0.2.128
```

Examples of ignored selections:

```text
256.1.1.1
01.2.3.4
8.8.8.8 example
https://ipinfo.io/8.8.8.8
```

## Project Structure

```text
.
├── manifest.json
├── package.json
├── src
│   ├── background.js
│   └── ip-address.js
└── test
    └── ip-address.test.js
```

## Install in Google Chrome

1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select this project folder: `chrome-extension-ipinfo`.
6. The extension is now installed.

## How to Use

1. Highlight a valid IP address on any web page.
2. Right-click the highlighted text.
3. Click **Open IP in ipinfo.io**.
4. Chrome opens a new tab with the IP address details on ipinfo.io.

If the selection is not a valid IP address, the extension shows a temporary message on the current page instead.

## Development

This extension uses Manifest V3 and has no build step or runtime dependencies.

Run the validation tests with:

```bash
npm test
```

After changing extension files, reload the extension from `chrome://extensions` before testing in Chrome again.

## Permissions

The extension's `manifest.json` `permissions` array contains exactly these permissions:

```json
[
  "activeTab",
  "contextMenus",
  "scripting"
]
```

Why each permission is needed:

- `activeTab`: gives the extension temporary access to the current tab only after you click the context menu item. This access is used only when the selected text is invalid, so the extension can show the in-page toast message on that page.
- `contextMenus`: adds the **Open IP in ipinfo.io** item to Chrome's right-click menu when text is selected.
- `scripting`: lets the extension inject the temporary invalid-selection toast into the current tab. This is what makes the toast notification work.

The extension does not request broad host permissions, browsing history, cookies, storage, clipboard access, or background access to web pages. It does not track user activity, selections, visited pages, or IP lookups.

When a valid IP address is opened, Chrome loads `https://ipinfo.io/IP-ADDRESS` in a new tab. IPinfo is an independent third-party service and is not affiliated with this project. IPinfo may receive and process the requested IP address, your browser request metadata, and your activity on ipinfo.io according to its own policies.

## Packaging

To distribute the extension manually, zip the extension files:

```bash
zip -r chrome-extension-ipinfo.zip manifest.json src README.md package.json test .gitignore
```

For Chrome Web Store distribution, create a ZIP that includes the extension files and follow Google's Chrome Web Store publishing process.
