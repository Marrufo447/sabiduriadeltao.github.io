const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (d) => new Date(d).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
const CH = 'https://www.youtube.com/@Sabidur%C3%ADaDelTao447';
const UPLOADS = 'UUD7SeQSWO7ciLtfmkuPukOg';

// Reflexión del día (cambia cada 24 h)
const QUOTES = [
  ['Lo más noble se parece al agua: beneficia a todos los seres sin competir con ninguno.', 'cap. 8'],
  ['Un viaje de mil leguas empieza con un solo paso.', 'cap. 64'],
  ['Quien conoce a los demás es inteligente; quien se conoce a sí mismo es sabio.', 'cap. 33'],
  ['Quien sabe contentarse con lo que tiene ya es rico.', 'cap. 33'],
  ['Lo blando vence a lo duro, y lo débil vence a lo fuerte.', 'cap. 78'],
  ['Practica el no forzar y nada quedará sin hacerse.', 'cap. 3'],
  ['Se moldea el barro para hacer una vasija, pero lo que la hace útil es su vacío.', 'cap. 11'],
  ['El sabio no acumula: cuanto más da a los demás, más tiene.', 'cap. 81'],
];
const q = QUOTES[Math.floor(Date.now() / 864e5) % QUOTES.length];
$('#q').textContent = '“' + q[0] + '”';
$('#qsrc').textContent = 'Tao Te Ching, ' + q[1];
$('#y').textContent = new Date().getFullYear();

// Franja de olas (seigaiha)
(() => {
  let o = '';
  for (let r = 0; r < 11; r++) for (let c = -1; c <= 32; c++)
    o += `<g transform="translate(${c * 40 + (r % 2 ? 20 : 0)} ${r * 10})"><circle r="20"/><circle r="14"/><circle r="8"/></g>`;
  $('#sg').innerHTML = o;
})();

// Enlaces «Ver videos»: búsqueda dentro de tu canal
document.querySelectorAll('[data-q]').forEach((a) => {
  a.href = CH + '/search?query=' + encodeURIComponent(a.dataset.q);
  a.target = '_blank'; a.rel = 'noopener';
});

$('#share').addEventListener('click', async (e) => {
  const b = e.currentTarget, d = { title: 'Sabiduría del Tao', url: location.href };
  try {
    if (navigator.share) await navigator.share(d);
    else { await navigator.clipboard.writeText(d.url); b.textContent = 'Enlace copiado'; }
  } catch {}
});

// Videos: los escribe videos.json (lo actualiza GitHub solo). Plan B: reproductor del canal.
fetch('videos.json', { cache: 'no-cache' })
  .then((r) => r.json())
  .then((d) => {
    if (!d.videos || !d.videos.length) throw new Error('vacío');
    $('#vlist').innerHTML = d.videos.map((v) => `
      <a class="vid" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">
        <div class="th"><img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt=""></div>
        <time datetime="${esc(v.date)}">${fmt(v.date)}</time>
        <h3>${esc(v.title)}</h3>
      </a>`).join('');
  })
  .catch(() => {
    $('#vlist').outerHTML = `<iframe class="frame" src="https://www.youtube-nocookie.com/embed/videoseries?list=${UPLOADS}" title="Videos del canal" loading="lazy" allowfullscreen></iframe>`;
  });
