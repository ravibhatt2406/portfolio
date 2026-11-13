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
      fs.writeFileSync(path.join(ARTIFACT_DIR, fileName), buf);
      console.log(`Saved: ${fileName} (${buf.length} bytes)`);
    }

    // Skip intro typography to reach clean landing
    await evalCode(`
      const btns = Array.from(document.querySelectorAll('button'));
      const s = btns.find(b => b.textContent && b.textContent.includes('Skip'));
      if (s) { s.click(); }
    `);
    await sleep(1500);

    // Hide text overlay temporarily for pure 3D bust evaluation
    await evalCode(`
      const textContainer = document.querySelector('div[class*="pb-[9vh]"]');
      if (textContainer) textContainer.style.display = 'none';
      const skip = document.querySelector('button[aria-label*="Skip"], button:has-text("Skip")');
      if (skip) skip.style.display = 'none';
    `);
    await sleep(600);

    // 1. Front view (0°)
    console.log('Capturing 1. Front view...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(0);`);
    await sleep(700);
    await capture('test_01_front_view.png');

    // 2. 25-degree view
    console.log('Capturing 2. 25-degree view...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(25);`);
    await sleep(700);
    await capture('test_02_angle_25.png');

    // 3. 55-degree view
    console.log('Capturing 3. 55-degree view...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(55);`);
    await sleep(700);
    await capture('test_03_angle_55.png');

    // 4. 90-degree side view
    console.log('Capturing 4. 90-degree side view...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(90);`);
    await sleep(700);
    await capture('test_04_angle_90_side.png');

    // 5. 180-degree back view
    console.log('Capturing 5. 180-degree back view...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(180);`);
    await sleep(700);
    await capture('test_05_angle_180_back.png');

    // 6. Facial close-up
    console.log('Capturing 6. Facial close-up...');
    await evalCode(`
      window.__SET_HOLOGRAM_ANGLE(0);
      const points = document.querySelector('canvas');
    `);
    // Zoom in camera slightly for close-up
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);
    await capture('test_06_facial_closeup.png');

    // Reset viewport back to 1600x1000
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(600);

    // 7. Complete bust preview (Front with natural framing)
    console.log('Capturing 7. Complete bust preview...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(10);`);
    await sleep(700);
    await capture('test_07_complete_bust.png');

    // 8. Preview without decorative effects
    console.log('Capturing 8. Preview without decorative effects...');
    await evalCode(`
      window.__SET_HOLOGRAM_ANGLE(15);
      const desk = window.__useDesktop ? window.__useDesktop.getState() : null;
      if (desk) desk.setReducedMotion(true);
    `);
    await sleep(800);
    await capture('test_08_no_decorative.png');

    // Re-enable motion
    await evalCode(`
      const desk = window.__useDesktop ? window.__useDesktop.getState() : null;
      if (desk) desk.setReducedMotion(false);
    `);
    await sleep(600);

    // 9. Preview with scanning
    console.log('Capturing 9. Preview with scanning...');
    await evalCode(`window.__SET_HOLOGRAM_ANGLE(0);`);
    await sleep(1500); // Allow scan beam to sweep
    await capture('test_09_scanning_effect.png');

    // 10. Preview with cursor interaction
    console.log('Capturing 10. Preview with cursor interaction...');
    await evalCode(`
      window.__SET_HOLOGRAM_ANGLE(null); // Return to interactive tracking
    `);
    // Simulate pointer move over the hologram
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 950,
      y: 420,
    });
    await sleep(800);
    await capture('test_10_cursor_interaction.png');

    // Restore text and capture landing page & desktop integration
    await evalCode(`
      const textContainer = document.querySelector('div[class*="pb-[9vh]"]');
      if (textContainer) textContainer.style.display = '';
    `);
    await sleep(600);
    await capture('test_11_landing_presentation.png');

    // Advance to desktop
    await evalCode(`
      const enterBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('ENTER'));
      if (enterBtn) enterBtn.click();
    `);
    await sleep(2500);

    // Set wallpaper to hologram
    await evalCode(`
      const menuBtns = Array.from(document.querySelectorAll('button'));
      const wp = menuBtns.find(b => b.textContent && b.textContent.includes('Wallpaper'));
      if (wp) wp.click();
    `);
    await sleep(800);
    await evalCode(`
      const gridBtns = document.querySelectorAll('div.grid button');
      if (gridBtns && gridBtns[1]) gridBtns[1].click();
    `);
    await sleep(800);
    await evalCode(`
      const close = document.querySelector('button[aria-label="Close"], button:has(svg.lucide-x)');
      if (close) close.click();
    `);
    await sleep(1500);
    await capture('test_12_desktop_wallpaper_enlarged.png');

    ws.close();
    console.log('All 12 test captures complete!');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
