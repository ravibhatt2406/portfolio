import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity/brain/6dc40571-da28-405e-bf16-f28a75bbc250';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function main() {
  const chrome = spawn(
    CHROME_PATH,
    [
      '--remote-debugging-port=9222',
      '--headless=new',
      '--disable-gpu',
      '--window-size=1600,1000',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(350);
      try {
        const tabs = await getJson('http://127.0.0.1:9222/json');
        if (tabs?.[0]?.webSocketDebuggerUrl) {
          wsUrl = tabs[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    function send(m, p = {}) {
      return new Promise((resolve, reject) => {
        const mid = id++;
        pending.set(mid, { resolve, reject });
        ws.send(JSON.stringify({ id: mid, method: m, params: p }));
      });
    }
    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:5174/' });
    await sleep(2500);

    // Skip intro twice to land on desktop
    await send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const skip = btns.find(b => b.textContent && b.textContent.includes('Skip'));
        if (skip) {
          skip.click();
          setTimeout(() => {
            skip.click();
          }, 350);
        }
      `,
    });
    await sleep(3000);

    // Open Wallpaper Switcher
    await send('Runtime.evaluate', {
      expression: `
        const menuBtns = Array.from(document.querySelectorAll('button'));
        const wp = menuBtns.find(b => b.textContent && b.textContent.includes('Wallpaper'));
        if (wp) wp.click();
      `,
    });
    await sleep(800);

    // Click 2nd card (Ravi Hologram)
    await send('Runtime.evaluate', {
      expression: `
        const gridBtns = document.querySelectorAll('div.grid button');
        if (gridBtns && gridBtns[1]) {
          gridBtns[1].click();
        }
      `,
    });
    await sleep(800);

    // Close switcher dialog
    await send('Runtime.evaluate', {
      expression: `
        const close = document.querySelector('button[aria-label="Close"], button:has(svg.lucide-x)');
        if (close) close.click();
      `,
    });
    await sleep(1500);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'hologram_desktop_integration.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved hologram_desktop_integration.png successfully!');
    ws.close();
  } finally {
    chrome.kill();
  }
}
main();
