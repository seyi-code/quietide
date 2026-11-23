/**
 * Generates Quietide PWA icons without external deps.
 * Run: node scripts/write-icons.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { deflateSync } from "zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "public", "icons");
mkdirSync(dir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/** Solid navy + blue ring + purple center (Quietide mark) */
function makePng(size) {
  const rowSize = 1 + size * 4;
  const raw = Buffer.alloc(rowSize * size);
  const bg = [11, 15, 26, 255];
  const ring = [107, 140, 255, 255];
  const inner = [11, 15, 26, 255];
  const dot = [167, 139, 250, 255];
  const cx = (size - 1) / 2;
  const rOuter = size * 0.33;
  const rInner = size * 0.18;
  const rDot = size * 0.07;
  for (let y = 0; y < size; y++) {
    const o = y * rowSize;
    raw[o] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cx;
      const d = Math.sqrt(dx * dx + dy * dy);
      let c = bg;
      if (d <= rDot) c = dot;
      else if (d <= rInner) c = inner;
      else if (d <= rOuter) c = ring;
      const p = o + 1 + x * 4;
      raw[p] = c[0];
      raw[p + 1] = c[1];
      raw[p + 2] = c[2];
      raw[p + 3] = c[3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
  ["favicon-32.png", 32],
  ["favicon-16.png", 16],
]) {
  writeFileSync(join(dir, name), makePng(size));
  console.log("wrote", name);
}
console.log("Icons ready.");
