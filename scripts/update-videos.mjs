// Lee el feed público de tu canal y guarda los últimos videos en videos.json
import { writeFile } from 'node:fs/promises';

const ID = process.env.CHANNEL_ID || 'UCD7SeQSWO7ciLtfmkuPukOg';
const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`);
if (!r.ok) throw new Error('No se pudo leer el feed: ' + r.status);
const xml = await r.text();

const pick = (s, tag) => (s.match(new RegExp(`<${tag}>([^<]*)</${tag}>`)) || [])[1] || '';
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 9).map((m) => ({
  id: pick(m[1], 'yt:videoId'),
  title: decode(pick(m[1], 'title')),
  date: pick(m[1], 'published'),
}));
if (!videos.length) throw new Error('El feed no trajo videos');

await writeFile('videos.json', JSON.stringify({ videos }, null, 2) + '\n');
console.log(`Guardados ${videos.length} videos`);
