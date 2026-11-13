import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9225;

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
  const chrome = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      '--headless=new',
      '--disable-gpu',
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
    await send('Page.navigate', { url: 'http://localhost:5174/' });
    await sleep(2500);

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const img = new Image();
          img.src = '/src/assets/portrait/portrait_clean.png';
          await new Promise(r => img.onload = r);
          const cv = document.createElement('canvas');
          cv.width = cv.height = 512;
          const ctx = cv.getContext('2d');
          ctx.drawImage(img, 0, 0, 512, 512);
          const data = ctx.getImageData(0, 0, 512, 512).data;

          // Find features along vertical and horizontal lines
          // Search for eyes: darkest regions in brow/eye area (y between 160 and 220)
          let minLumLeft = 1, eyeLx = 0, eyeLy = 0;
          let minLumRight = 1, eyeRx = 0, eyeRy = 0;
          for (let y = 170; y < 220; y++) {
            for (let x = 180; x < 240; x++) {
              const idx = (y * 512 + x) * 4;
              const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
              if (lum < minLumLeft) { minLumLeft = lum; eyeLx = x; eyeLy = y; }
            }
            for (let x = 270; x < 330; x++) {
              const idx = (y * 512 + x) * 4;
              const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
              if (lum < minLumRight) { minLumRight = lum; eyeRx = x; eyeRy = y; }
            }
          }

          // Search nose tip (y between 220 and 260, x around 256)
          let maxNoseLum = 0, noseX = 256, noseY = 240;
          for (let y = 220; y < 255; y++) {
            for (let x = 240; x < 272; x++) {
              const idx = (y * 512 + x) * 4;
              const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
              if (lum > maxNoseLum) { maxNoseLum = lum; noseX = x; noseY = y; }
            }
          }

          // Search mouth (dark line between 260 and 290)
          let minMouthLum = 1, mouthX = 256, mouthY = 275;
          for (let y = 265; y < 290; y++) {
            for (let x = 240; x < 272; x++) {
              const idx = (y * 512 + x) * 4;
              const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
              if (lum < minMouthLum) { minMouthLum = lum; mouthX = x; mouthY = y; }
            }
          }

          // Hair top boundary (lowest y where alpha > 30 and lum < 0.3)
          let hairTopY = 512;
          for (let y = 30; y < 200; y++) {
            const idx = (y * 512 + 256) * 4;
            if (data[idx+3] > 30) { hairTopY = y; break; }
          }

          // Forehead hairline (transition from dark hair to brighter forehead skin at center x = 256)
          let hairlineY = 0;
          for (let y = hairTopY; y < 200; y++) {
            const idx = (y * 512 + 256) * 4;
            const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
            if (lum > 0.40) { hairlineY = y; break; }
          }

          // Chin bottom (transition from beard to neck shadow at x = 256)
          let chinY = 0;
          for (let y = 290; y < 360; y++) {
            const idx = (y * 512 + 256) * 4;
            const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
            // Beard has low lum, then under chin it drops or rises into neck
          }

          // Collar line (transition into maroon shirt: r > 100, b < 60)
          let collarY = 0;
          for (let y = 330; y < 450; y++) {
            const idx = (y * 512 + 256) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2];
            if (r > 80 && r > b * 1.5 && g < 60) { collarY = y; break; }
          }

          // Sample horizontal line across cheeks at y = 230 (v = 0.45)
          const row230 = [];
          for (let x = 0; x < 512; x += 16) {
            const idx = (230 * 512 + x) * 4;
            row230.push({ x, a: data[idx+3], r: data[idx], g: data[idx+1], b: data[idx+2] });
          }

          return {
            eyeL: { x: eyeLx / 512, y: eyeLy / 512, lum: minLumLeft },
            eyeR: { x: eyeRx / 512, y: eyeRy / 512, lum: minLumRight },
            noseTip: { x: noseX / 512, y: noseY / 512, lum: maxNoseLum },
            mouth: { x: mouthX / 512, y: mouthY / 512, lum: minMouthLum },
            row230
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('LANDMARKS:', JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
