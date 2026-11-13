import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity/brain/6dc40571-da28-405e-bf16-f28a75bbc250';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9222;

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

async function run() {
  console.log('Launching Chrome with CDP for Phase 21 Suite...');
  const chrome = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
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
        const tabs = await getJson(`http://127.0.0.1:${PORT}/json`);
        if (tabs?.[0]?.webSocketDebuggerUrl) {
          wsUrl = tabs[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error('Could not get CDP webSocketDebuggerUrl');

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

    console.log('Navigating to http://localhost:5174/ ...');
    await send('Page.navigate', { url: 'http://localhost:5174/' });
    await sleep(4000);

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result?.value;
    }

    async function capture(fileName) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      const outPath = path.join(ARTIFACT_DIR, fileName);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved: ${fileName} (${buf.length} bytes)`);
    }

    // Skip intro text
    await evalCode(`
      const btns = Array.from(document.querySelectorAll('button'));
      const s = btns.find(b => b.textContent && b.textContent.includes('Skip'));
      if (s) { s.click(); }
      const textOverlay = document.querySelector('div[class*="pointer-events-none"]');
      if (textOverlay) textOverlay.style.display = 'none';
      const centerText = document.querySelector('div[class*="pb-[9vh]"]');
      if (centerText) centerText.style.display = 'none';
    `);
    await sleep(2000);

    // ================================================================
    // PREVIEW 1: Internal hologram particles moving (external disabled, no cursor)
    // ================================================================
    console.log('Capturing Preview 1: Internal hologram particles only...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = true;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = false;
      window.__SET_HOLOGRAM_ANGLE(0);
      window.dispatchEvent(new MouseEvent('mouseleave'));
    `);
    await sleep(1200);
    await capture('phase21_01_internal_only.png');

    // ================================================================
    // PREVIEW 2: External ambient particles floating (internal disabled)
    // ================================================================
    console.log('Capturing Preview 2: External ambient particles only (face silhouette clear)...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = false;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = true;
      window.__SET_HOLOGRAM_ANGLE(0);
      window.dispatchEvent(new MouseEvent('mouseleave'));
    `);
    await sleep(1200);
    await capture('phase21_02_external_only.png');

    // ================================================================
    // PREVIEW 3: Both systems running simultaneously
    // ================================================================
    console.log('Capturing Preview 3: Both particle systems running simultaneously...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = true;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = true;
      window.__SET_HOLOGRAM_ANGLE(0);
    `);
    await sleep(1200);
    await capture('phase21_03_dual_simultaneous.png');

    // ================================================================
    // PREVIEW 4: Cursor interaction with internal hologram
    // ================================================================
    console.log('Capturing Preview 4: Cursor interaction on internal hologram...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = true;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = false;
      // Position cursor near right cheek/shoulder
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      const clientX = rect.left + rect.width * 0.60;
      const clientY = rect.top + rect.height * 0.45;
      window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }));
    `);
    // Also use CDP Input.dispatchMouseEvent to ensure complete browser-level event dispatch
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 980,
      y: 450,
    });
    await sleep(1000);
    await capture('phase21_04_cursor_internal.png');

    // ================================================================
    // PREVIEW 5: Cursor interaction with external particles
    // ================================================================
    console.log('Capturing Preview 5: Cursor interaction on external particles...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = false;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = true;
    `);
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 1050,
      y: 350,
    });
    await sleep(1000);
    await capture('phase21_05_cursor_external.png');

    // ================================================================
    // PREVIEW 6: Complete hologram in idle state on Desktop
    // ================================================================
    console.log('Capturing Preview 6: Complete hologram in idle state (desktop mode)...');
    await evalCode(`
      window.__TOGGLE_HOLOGRAM_INTERNAL = true;
      window.__TOGGLE_HOLOGRAM_EXTERNAL = true;
      window.__SET_HOLOGRAM_ANGLE(null); // restore natural organic sway
      if (window.useDesktop) {
        window.useDesktop.getState().setWallpaper('hologram');
        window.useDesktop.getState().setPhase('desktop');
      }
    `);
    // Move cursor outside to simulate idle state
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 10,
      y: 10,
    });
    await sleep(2500);
    await capture('phase21_06_complete_idle_desktop.png');

    console.log('Phase 21 suite captured successfully!');
  } finally {
    try {
      chrome.kill();
    } catch (e) {}
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
