// Les images des espèces, prises sur Wikipédia (Wikimedia Commons, licences libres).
// On regroupe les demandes (jusqu'à 50 titres par appel) et on garde les réponses en mémoire.

const cache = new Map(); // titre -> Promise<{ src, page } | null>
const enAttente = new Map(); // langue -> Map(titre -> resolve)
let minuterie = 0;

function envoyer() {
  minuterie = 0;
  enAttente.forEach((demandes, langue) => {
    enAttente.delete(langue);
    const titres = [...demandes.keys()];
    for (let i = 0; i < titres.length; i += 50) {
      const lot = titres.slice(i, i + 50);
      const url =
        `https://${langue}.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
        `&prop=pageimages|info&inprop=url&piprop=thumbnail&pithumbsize=480&redirects=1&titles=` +
        encodeURIComponent(lot.join('|'));
      fetch(url)
        .then((r) => r.json())
        .then((j) => {
          const vers = {};
          (j.query?.normalized || []).forEach((n) => { vers[n.to] = n.from; });
          (j.query?.redirects || []).forEach((r) => { vers[r.to] = vers[r.from] || r.from; });
          const trouves = new Set();
          Object.values(j.query?.pages || {}).forEach((p) => {
            const titre = vers[p.title] || p.title;
            const resoudre = demandes.get(titre);
            if (!resoudre) return;
            trouves.add(titre);
            resoudre(p.thumbnail ? { src: p.thumbnail.source, page: p.fullurl } : null);
          });
          lot.filter((t) => !trouves.has(t)).forEach((t) => demandes.get(t)?.(null));
        })
        .catch(() => lot.forEach((t) => demandes.get(t)?.(null)));
    }
  });
}

// titre : « Trilobita » (Wikipédia en français) ou « en:Birkenia » (en anglais).
export function imageDe(titre) {
  if (!titre) return Promise.resolve(null);
  if (!cache.has(titre)) {
    const [langue, nom] = titre.startsWith('en:') ? ['en', titre.slice(3)] : ['fr', titre];
    cache.set(
      titre,
      new Promise((resoudre) => {
        if (!enAttente.has(langue)) enAttente.set(langue, new Map());
        enAttente.get(langue).set(nom, resoudre);
        if (!minuterie) minuterie = setTimeout(envoyer, 30);
      })
    );
  }
  return cache.get(titre);
}
