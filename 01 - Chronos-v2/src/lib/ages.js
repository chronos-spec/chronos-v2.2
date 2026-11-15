// Écrit un âge lisible : « 3,5 milliards d’années », « 66 millions d’années », « 40 000 ans ».
export function texteAge(ans) {
  if (!ans) return 'aujourd’hui';
  if (ans >= 1e9) return `${(ans / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} milliard${ans >= 2e9 ? 's' : ''} d’années`;
  if (ans >= 1e6) return `${(ans / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} million${ans >= 2e6 ? 's' : ''} d’années`;
  return `${Math.round(ans).toLocaleString('fr-FR')} ans`;
}

// « de 68 à 66 millions d’années » plutôt que « de 68 millions d’années à 66 millions d’années ».
export function plageAges(debut, fin) {
  const unite = (a) => (a >= 1e9 ? 'Ga' : a >= 1e6 ? 'Ma' : 'ans');
  if (unite(debut) === unite(fin) && unite(debut) !== 'ans') {
    const d = texteAge(debut);
    const nombre = texteAge(fin).split(' ')[0];
    return `de ${d.split(' ')[0]} à ${nombre} ${d.split(' ').slice(1).join(' ').replace(/^million /, 'millions ').replace(/^milliard /, 'milliards ')}`;
  }
  if (unite(debut) === 'ans' && unite(fin) === 'ans') {
    return `de ${texteAge(debut).replace(' ans', '')} à ${texteAge(fin)}`;
  }
  return `de ${texteAge(debut)} à ${texteAge(fin)}`;
}
