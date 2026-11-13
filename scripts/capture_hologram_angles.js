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
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Launching headless Chrome with CDP on port', PORT);
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
      await sleep(400);
      try {
        const tabs = await getJson(`http://127.0.0.1:${PORT}/json`);
        if (tabs && tabs.length > 0 && tabs[0].webSocketDebuggerUrl) {
          wsUrl = tabs[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error('Failed to connect to Chrome CDP');
    console.log('Connected to CDP:', wsUrl);

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise((r) => (ws.onopen = r));
    console.log('WebSocket open. Initializing CDP domains...');

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://localhost:5174/ ...');
    await send('Page.navigate', { url: 'http://localhost:5174/' });
    await sleep(4000); // Allow particles and shaders to initialize

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result?.value;
    }

    async function capture(fileName) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      const outPath = path.join(ARTIFACT_DIR, fileName);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved screenshot: ${fileName} (${buf.length} bytes)`);
    }

    // 1. First, capture the natural landing page with "HELLO, I'M RAVI" and the centered hologram
    console.log('Advancing to landing page...');
    await evalCode(`
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Skip'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1500);
    await capture('hologram_landing_page.png');

    // 2. Hide text overlay temporarily for clean 5-angle inspection (pure 3D volumetric bust)
    await evalCode(`
      const landingText = document.querySelector('div[class*="pb-[9vh]"]');
      if (landingText) landingText.style.display = 'none';
      const skip = document.querySelector('button[aria-label*="Skip"], button:has-text("Skip")');
      if (skip) skip.style.display = 'none';
    `);
    await sleep(500);

    const angles = [
      { deg: 0, file: 'hologram_angle_00_front.png', label: '0° Front View' },
      { deg: 25, file: 'hologram_angle_25_quarter.png', label: '25° Quarter View' },
      { deg: 55, file: 'hologram_angle_55_three_quarter.png', label: '55° Three-Quarter View' },
      { deg: 90, file: 'hologram_angle_90_side.png', label: '90° Side View' },
      { deg: 180, file: 'hologram_angle_180_back.png', label: '180° Back View' },
    ];

    for (const a of angles) {
      console.log(`Capturing pure bust ${a.label} (${a.deg}°)...`);
      await evalCode(`window.__SET_HOLOGRAM_ANGLE(${a.deg});`);
      await sleep(800);
      await capture(a.file);
    }

    // 3. Capture active holographic scan beam
    console.log('Capturing holographic scan beam effect...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(20);`);
    await sleep(1400);
    await capture('hologram_effect_scan.png');

    // 4. Restore overlay and transition to desktop
    await evalCode(`
      const landingText = document.querySelector('div[class*="pb-[9vh]"]');
      if (landingText) landingText.style.display = '';
      window.__SET_HOLOGRAM_ANGLE(null); // Return to natural idle sway
      const enterBtn = document.querySelector('button[aria-label="Enter RAVI.OS"], button:has(span:contains("ENTER"))');
      if (enterBtn) enterBtn.click();
      else {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('ENTER'));
        if (btns[0]) btns[0].click();
      }
    `);
    await sleep(2500);

    // 5. On desktop: open wallpaper switcher and select Ravi Hologram wallpaper
    console.log('Switching to Ravi Hologram wallpaper on desktop...');
    await evalCode(`
      // Open wallpaper switcher via localStorage and Zustand or menu bar
      localStorage.setItem('ravi_os_wallpaper', 'hologram');
      // Trigger switcher dialog
      const wpMenuBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Wallpaper'));
      if (wpMenuBtn) wpMenuBtn.click();
    `);
    await sleep(1200);

    // Click 'Ravi Hologram' card
    await evalCode(`
      const holoCard = Array.from(document.querySelectorAll('div, button')).find(el => el.textContent && el.textContent.includes('Ravi Hologram'));
      if (holoCard) holoCard.click();
    `);
    await sleep(1500);

    // Close switcher dialog if still open
    await evalCode(`
      const closeBtn = document.querySelector('button[aria-label="Close"], button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(1200);

    await capture('hologram_desktop_integration.png');
    console.log('Desktop capture complete!');

    ws.close();
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
