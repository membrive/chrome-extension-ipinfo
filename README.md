# IPInfo Selection Lookup

IPInfo Selection Lookup is a Google Chrome extension that opens a selected IP address in [ipinfo.io](https://ipinfo.io/) from the right-click context menu.

This project is independently developed and is not affiliated with, endorsed by, sponsored by, or associated with IPinfo.

## What It Does

- Adds an **Open IP in ipinfo.io** item to Chrome's context menu when text is selected.
- Validates the selected text as an IPv4 or IPv6 address before opening a new tab.
- Opens `https://ipinfo.io/IP-ADDRESS` for valid selections.
- Does nothing for invalid, empty, partial, or multi-word selections.
- Runs locally in your browser. It does not collect, store, or transmit data anywhere except the ipinfo.io tab you explicitly open.

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

## Development

This extension uses Manifest V3 and has no build step or runtime dependencies.

Run the validation tests with:

```bash
npm test
```

After changing extension files, reload the extension from `chrome://extensions` before testing in Chrome again.

## Permissions

The extension requests only:

- `contextMenus`: required to add the right-click menu item for selected text.

It does not request broad host permissions, page access, browsing history, cookies, storage, or clipboard permissions.

## Packaging

To distribute the extension manually, zip the extension files:

```bash
zip -r chrome-extension-ipinfo.zip manifest.json src README.md package.json test .gitignore
```

For Chrome Web Store distribution, create a ZIP that includes the extension files and follow Google's Chrome Web Store publishing process.
