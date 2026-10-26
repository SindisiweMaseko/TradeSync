import fs from 'fs';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image scanlines
  // Each scanline: filter byte (0) + width * 4 bytes RGBA
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Draw a subtle border and stylized center badge
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const isInner = dist < width * 0.35;
      const isRing = dist >= width * 0.35 && dist <= width * 0.42;

      if (isInner) {
        rawData[pxOffset] = 16;      // Emerald green
        rawData[pxOffset + 1] = 185;
        rawData[pxOffset + 2] = 129;
        rawData[pxOffset + 3] = 255;
      } else if (isRing) {
        rawData[pxOffset] = 245;     // Amber gold ring
        rawData[pxOffset + 1] = 158;
        rawData[pxOffset + 2] = 11;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = 15;      // Slate 900 background
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);
  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 table & calculation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ -1;
}

fs.writeFileSync('public/pwa-192x192.png', createSolidPng(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createSolidPng(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createSolidPng(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createSolidPng(180, 180));
fs.writeFileSync('public/favicon.ico', createSolidPng(32, 32));
console.log('Icons generated successfully');
