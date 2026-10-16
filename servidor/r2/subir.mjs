// Sube musica/*.mp3 a Cloudflare R2 por consola (multipart, reanuda lo ya subido).
// Uso (desde servidor/r2/):
//   npm install
//   R2_ENDPOINT=https://<id>.r2.cloudflarestorage.com R2_KEY=... R2_SECRET=... R2_BUCKET=metrallapunk node subir.mjs
import { readdir } from 'node:fs/promises';
import { createReadStream, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const { R2_ENDPOINT, R2_KEY, R2_SECRET, R2_BUCKET } = process.env;
if (!R2_ENDPOINT || !R2_KEY || !R2_SECRET || !R2_BUCKET) {
  console.error('Faltan vars: R2_ENDPOINT R2_KEY R2_SECRET R2_BUCKET');
  process.exit(1);
}
const s3 = new S3Client({
  region: 'auto', endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_KEY, secretAccessKey: R2_SECRET },
});
const dir = join(new URL('.', import.meta.url).pathname, '..', '..', 'musica');
const files = (await readdir(dir)).filter(f => f.toLowerCase().endsWith('.mp3')).sort();

for (const f of files) {
  const key = `musica/${f}`;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    console.log(`= ya estaba: ${f}`);
    continue;
  } catch { /* no existe: subir */ }
  const size = statSync(join(dir, f)).size;
  console.log(`↑ subiendo (${(size / 1048576).toFixed(1)} MB): ${f}`);
  await new Upload({
    client: s3,
    params: { Bucket: R2_BUCKET, Key: key, Body: createReadStream(join(dir, f)), ContentType: 'audio/mpeg' },
    queueSize: 4, partSize: 10 * 1024 * 1024,
  }).done();
  console.log(`✓ ${f}`);
}
console.log('Hecho. Ahora: node aplicar-urls.mjs https://TU-DOMINIO-PUBLICO');
