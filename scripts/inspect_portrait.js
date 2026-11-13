const http = require('http');

async function inspect() {
  const cdpRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await cdpRes.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('5174'));
  if (!page) {
    console.error('No Vite page found');
    return;
  }
  const ws = new (require('ws'))(page.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (msg) => {
        const data = JSON.parse(msg);
        if (data.id === curId) {
          ws.off('message', handler);
          resolve(data.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

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

        // Find bounding box of subject (alpha > 50)
        let minX = 512, maxX = 0, minY = 512, maxY = 0;
        for (let y = 0; y < 512; y++) {
          for (let x = 0; x < 512; x++) {
            const a = data[(y * 512 + x) * 4 + 3];
            if (a > 50) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Sample key regions
        // Hair top
        let hairTopY = minY;
        // Chin bottom (where facial skin/beard ends before neck)
        // Let's sample vertical line down center (x = 256)
        const centerLine = [];
        for (let y = minY; y <= maxY; y += 4) {
          const idx = (y * 512 + 256) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
          const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
          centerLine.push({ y, uY: (y/512).toFixed(3), lum: lum.toFixed(2), r, g, b, a });
        }

        return {
          minX: minX / 512, maxX: maxX / 512,
          minY: minY / 512, maxY: maxY / 512,
          centerLine: centerLine.filter((_, i) => i % 4 === 0)
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log(JSON.stringify(evalRes.result.value, null, 2));
  ws.close();
}

inspect().catch(console.error);

