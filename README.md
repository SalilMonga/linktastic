# Linktastic

A Chrome extension that copies the current tab's title and URL as a rich HTML hyperlink to your clipboard.

Paste into Google Docs, Notion, Slack, email — anywhere that supports rich text — and get a clickable link instead of a plain URL.

## Why Linktastic?

On Windows, copying a link from Edge and pasting it into Teams or other Microsoft products gives you a nicely formatted, readable link. On a Mac with Chrome? You just get a raw URL.

I looked for extensions that could fix this, but none of them were open-source. I couldn't tell how they handled webpage data — and since I work with a lot of NDA-protected material, I wasn't comfortable giving an unknown extension access to every link on my work machine.

So I built Linktastic. It runs entirely on-device, never phones home, and the code is fully open-source so you can inspect exactly what it does. No data collection, no mystery — just rich links.

## Install (from source)

1. Clone this repo
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the cloned folder

## Usage

- **Click** the extension icon in the toolbar, or
- **Set a keyboard shortcut** via `chrome://extensions/shortcuts`

A toast notification confirms when the link is copied.

## How it works

The extension copies two clipboard formats:

| Format | Content |
|---|---|
| `text/html` | `<a href="https://example.com">Page Title</a>` |
| `text/plain` | `Page Title https://example.com` |

Rich-text editors pick up the HTML version; plain-text editors get the fallback.

## License

This project is licensed under the [MIT License with Commons Clause](LICENSE). You are free to use, modify, and share it, but you may not sell it as a paid product without permission from the author.
