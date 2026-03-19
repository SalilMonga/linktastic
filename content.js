// content.js
console.log('content.js loaded');
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || msg.action !== 'copy') return;
    (async () => {
        const title = msg.title || '';
        const url = msg.url || '';
        const html = `<a href="${url}">${title}</a>`;
        try {
            if (navigator.clipboard && navigator.clipboard.write) {
                const blobHtml = new Blob([html], { type: 'text/html' });
                const blobPlain = new Blob([`${title} ${url}`], { type: 'text/plain' });
                const item = new ClipboardItem({
                    'text/html': blobHtml,
                    'text/plain': blobPlain
                });
                await navigator.clipboard.write([item]);
                showCopyToast('Copied rich link');
                sendResponse({ ok: true, method: 'clipboard.write' });
                return;
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(`${title} ${url}`);
                showCopyToast('Copied link');
                sendResponse({ ok: true, method: 'clipboard.writeText' });
                return;
            }
            const container = document.createElement('div');
            container.contentEditable = 'true';
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.innerHTML = html;
            document.documentElement.appendChild(container);
            const range = document.createRange();
            range.selectNodeContents(container);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            container.remove();
            showCopyToast('Copied rich link');
            sendResponse({ ok: true, method: 'execCommand' });
        } catch (err) {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(`${title} ${url}`);
                    sendResponse({ ok: true, method: 'clipboard.writeText(fallback)' });
                    return;
                }
            } catch (_) { }
            sendResponse({ ok: false, error: String(err) });
        }
    })();
    return true;
});

// Small in-page toast to notify user of copy success
function showCopyToast(text) {
    try {
        const id = 'copy-rich-link-toast';
        let el = document.getElementById(id);

        if (!el) {
            el = document.createElement('div');
            el.id = id;

            el.innerHTML = `
            <div class="crl-pill">
                <span class="crl-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 8l-4-4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 4v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M20 20H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </span>
                <span class="crl-text"></span>
            </div>
            `;

            document.documentElement.appendChild(el);
        }

        el.querySelector('.crl-text').textContent = text;

        clearTimeout(el._timeout);
        clearTimeout(el._removeTimeout);

        el.classList.remove('crl-show');
        void el.offsetWidth;
        el.classList.add('crl-show');

        el._timeout = setTimeout(() => {
            el.classList.remove('crl-show');
            el._removeTimeout = setTimeout(() => el.remove(), 250);
        }, 1400);

    } catch (e) { }
}