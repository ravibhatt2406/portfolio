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
  console.log('Launching Chrome with CDP...');
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
    if (!wsUrl) throw new Error('Could not connect to Chrome CDP');

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
    await sleep(3500);

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

    // Advance cleanly to Desktop and set wallpaper to hologram
    console.log('Navigating directly to Desktop via useDesktop store...');
    await evalCode(`
      if (window.useDesktop) {
        window.useDesktop.getState().setPhase('desktop');
        window.useDesktop.getState().setWallpaper('hologram');
      }
    `);
    await sleep(2500);

    // 1. Recovered stable hologram - Front view (0°)
    console.log('Capturing 1. Front view (0°)...');
    await evalCode('window.__SET_HOLOGRAM_ANGLE && window.__SET_HOLOGRAM_ANGLE(0)');
    await sleep(800);
    await capture('recovery_01_front_view.png');

    // 2. Slight three-quarter view (12°)
    console.log('Capturing 2. Slight three-quarter view (12°)...');
    await evalCode('window.__SET_HOLOGRAM_ANGLE && window.__SET_HOLOGRAM_ANGLE(12)');
    await sleep(800);
    await capture('recovery_02_slight_three_quarter.png');

    // 3. Side view (20°)
    console.log('Capturing 3. Side view (20°)...');
    await evalCode('window.__SET_HOLOGRAM_ANGLE && window.__SET_HOLOGRAM_ANGLE(20)');
    await sleep(800);
    await capture('recovery_03_side_view.png');

    // Reset angle lock to natural subtle idle sway
    await evalCode('window.__SET_HOLOGRAM_ANGLE && window.__SET_HOLOGRAM_ANGLE(null)');
    await sleep(800);

    // 4. Full Desktop Composition
    console.log('Capturing 4. Full Desktop Composition...');
    await capture('recovery_04_desktop_composition.png');

    // 5. Landing Intro
    console.log('Capturing 5. Landing Intro...');
    await evalCode(`
      if (window.useDesktop) {
        window.useDesktop.getState().setPhase('intro');
      }
    `);
    await sleep(2500);
    await capture('recovery_05_landing_intro.png');

    console.log('All recovery captures complete!');
    ws.close();
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
