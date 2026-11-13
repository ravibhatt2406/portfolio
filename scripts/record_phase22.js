import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/User/.gemini/antigravity/brain/6dc40571-da28-405e-bf16-f28a75bbc250';
const FRAMES_DIR = path.join(ARTIFACT_DIR, 'scratch', 'phase22_frames');
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9222;

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

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
  console.log('Launching Chrome with CDP for Phase 22 video recording & preview suite...');
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

    async function captureScreenshot(filePath) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      fs.writeFileSync(filePath, buf);
      return buf;
    }

    // Switch to desktop mode with hologram wallpaper
    await evalCode(`
      const btns = Array.from(document.querySelectorAll('button'));
      const s = btns.find(b => b.textContent && b.textContent.includes('Skip'));
      if (s) { s.click(); }
      if (window.useDesktop) {
        window.useDesktop.getState().setWallpaper('hologram');
        window.useDesktop.getState().setPhase('desktop');
      }
    `);
    await sleep(2500);

    // 1. Capture High-Res Preview: Complete Atomic Cage & 3 Energy Rings (Idle State)
    console.log('Capturing Preview 1: 3 Energy Rings Atomic Cage (Idle State)...');
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 20, y: 20 });
    await sleep(1000);
    const idlePath = path.join(ARTIFACT_DIR, 'phase22_01_three_energy_rings_idle.png');
    await captureScreenshot(idlePath);
    console.log(`Saved: ${idlePath}`);

    // 2. Capture High-Res Preview: Cursor moving over facial particles (Ripple & Dispersal)
    console.log('Capturing Preview 2: Cursor Interaction on Face (Ripple & Flow)...');
    // On 1600x1000, desktop hologram center is at x ~ 1120, y ~ 480
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1120, y: 440 });
    await sleep(800);
    const ripplePath = path.join(ARTIFACT_DIR, 'phase22_02_cursor_ripple_interaction.png');
    await captureScreenshot(ripplePath);
    console.log(`Saved: ${ripplePath}`);

    // 3. Capture High-Res Preview: Cursor Smooth Recovery
    console.log('Capturing Preview 3: Smooth Recovery (Cursor moves away)...');
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1500, y: 100 });
    await sleep(1000);
    const recoveryPath = path.join(ARTIFACT_DIR, 'phase22_03_particle_smooth_recovery.png');
    await captureScreenshot(recoveryPath);
    console.log(`Saved: ${recoveryPath}`);

    // ================================================================
    // RECORD SCREENCAST FRAMES FOR VIDEO
    // ================================================================
    console.log('Recording video frames demonstrating all 3 rings & cursor interaction...');
    const totalFrames = 60;
    const fps = 15;

    for (let f = 0; f < totalFrames; f++) {
      let mouseX = 100, mouseY = 100;

      if (f < 15) {
        // Phase A (0 - 1.0s): Idle state, all 3 rings flowing
        mouseX = 100;
        mouseY = 100;
      } else if (f < 40) {
        // Phase B (1.0s - 2.6s): Cursor sweeps across the face (x from 1040 to 1200, y from 420 to 500)
        const progress = (f - 15) / 25;
        mouseX = 1040 + progress * 160;
        mouseY = 420 + Math.sin(progress * Math.PI) * 70;
      } else {
        // Phase C (2.6s - 4.0s): Cursor glides away to top-right, face particles smoothly recover
        const progress = (f - 40) / 20;
        mouseX = 1200 + progress * 320;
        mouseY = 490 - progress * 390;
      }

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(mouseX),
        y: Math.round(mouseY),
      });

      await sleep(1000 / fps);

      const frameFile = path.join(FRAMES_DIR, `frame_${String(f).padStart(3, '0')}.png`);
      await captureScreenshot(frameFile);
      if (f % 10 === 0) console.log(`Captured frame ${f}/${totalFrames}`);
    }

    console.log('Encoding MP4 video with ffmpeg...');
    const videoOut = path.join(ARTIFACT_DIR, 'phase22_hologram_energy_rings_and_cursor.mp4');
    
    await new Promise((resolve, reject) => {
      const ff = spawn('ffmpeg', [
        '-y',
        '-framerate', String(fps),
        '-i', path.join(FRAMES_DIR, 'frame_%03d.png'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '20',
        videoOut,
      ]);
      ff.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
      ff.on('error', reject);
    });

    console.log(`Successfully generated video: ${videoOut}`);
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
