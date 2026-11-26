import { useEffect, useMemo, useRef, useState } from 'react';
import { PAR_ID } from '../data/index.js';
import { dateCosmique, dateLoupe } from '../lib/calendrier.js';
import {
  lireNaissance, texteNaissance, ageEnAnnees, ageRevolu, secondesCosmiques, texteSecondes,
  avantNaissance, depuisNaissance, comparaisons,
} from '../lib/maVie.js';
import './MaVie.css';

// ---------------------------------------------------------------------------
// TA VIE SUR LA FRISE (#/ma-vie, ou #/ma-vie/1997, ou #/ma-vie/1997-12-13)
// Le visiteur donne son année (ou sa date) de naissance. Tout est calculé ici,
// dans le navigateur : rien n'est envoyé, rien n'est enregistré.
// ---------------------------------------------------------------------------

const ans = (n) => `${n.toLocaleString('fr-FR')} an${n > 1 ? 's' : ''}`;

export default function MaVie({ naissance: texte }) {
  const titre = useRef(null);
  const aujourdhui = useMemo(() => new Date(), []);
  const naissance = lireNaissance(texte, aujourdhui);
  const [annee, setAnnee] = useState(naissance ? String(naissance.annee) : '');
  const [date, setDate] = useState(naissance?.complete ? texteNaissance(naissance) : '');
  const [erreur, setErreur] = useState(texte && !naissance ? 'Cette date n’est pas valable.' : '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Ta vie sur la frise · Odysseum';
    window.scrollTo(0, 0);
    titre.current?.focus({ preventScroll: true });
  }, [texte]);

  function valider(e) {
    e.preventDefault();
    const choix = date || annee.trim();
    const n = lireNaissance(choix, aujourdhui);
    if (!n) {
      setErreur(`Indique une année entre 1900 et ${aujourdhui.getFullYear()}, ou une date passée.`);
      return;
    }
    setErreur('');
    setMessage('');
    window.location.hash = `/ma-vie/${texteNaissance(n)}`;
  }

  async function partager() {
    const lien = window.location.href;
    const phrase = `Dans l'année cosmique, j'existe depuis ${texteSecondes(secondesCosmiques(ageEnAnnees(naissance, aujourdhui)))}. Et toi ?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ma vie sur la frise · Odysseum', text: phrase, url: lien });
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return; // le visiteur a fermé la fenêtre de partage
    }
    try {
      await navigator.clipboard.writeText(lien);
      setMessage('Lien copié ! Tu peux le coller où tu veux.');
    } catch {
      setMessage(`Copie impossible ici. Voici le lien : ${lien}`);
    }
  }

  return (
    <article className="ma-vie" data-etage="aujourdhui">
      <h1 ref={titre} tabIndex={-1}>Ta vie sur la frise</h1>
      <p className="ma-vie__intro">
        Donne ton année de naissance (ou ta date exacte) : on place ta vie dans les 13,8 milliards d’années de
        l’Univers. Le calcul se fait sur ton appareil, rien n’est envoyé.
      </p>

      <form className="ma-vie__formulaire verre" onSubmit={valider} noValidate>
        <div className="ma-vie__champ">
          <label htmlFor="ma-vie-annee">Année de naissance</label>
          <input
            id="ma-vie-annee" type="number" inputMode="numeric" min="1900" max={aujourdhui.getFullYear()}
            value={annee} onChange={(e) => { setAnnee(e.target.value); setDate(''); }}
            aria-describedby={erreur ? 'ma-vie-erreur' : undefined} aria-invalid={erreur ? true : undefined}
          />
        </div>
        <p className="ma-vie__ou" aria-hidden="true">ou</p>
        <div className="ma-vie__champ">
          <label htmlFor="ma-vie-date">Date exacte <span className="ma-vie__facultatif">(facultatif)</span></label>
          <input
            id="ma-vie-date" type="date" min="1900-01-01" max={texteNaissance({
              annee: aujourdhui.getFullYear(), mois: aujourdhui.getMonth() + 1, jour: aujourdhui.getDate(), complete: true,
            })}
            value={date} onChange={(e) => { setDate(e.target.value); if (e.target.value) setAnnee(e.target.value.slice(0, 4)); }}
          />
        </div>
        <button type="submit" className="bouton-principal">Voir ma vie</button>
        {erreur && <p id="ma-vie-erreur" className="ma-vie__erreur" role="alert">⚠ {erreur}</p>}
      </form>

      {naissance && <Resultat naissance={naissance} aujourdhui={aujourdhui} onPartager={partager} message={message} />}
    </article>
  );
}

function Resultat({ naissance, aujourdhui, onPartager, message }) {
  const age = ageEnAnnees(naissance, aujourdhui);
  const revolu = ageRevolu(naissance, aujourdhui);
  const secondes = secondesCosmiques(age);
  const avant = avantNaissance(naissance);
  const depuis = depuisNaissance(naissance);
  const autres = comparaisons(naissance, age);
  const ecriture = PAR_ID.ecriture;

  return (
    <section className="ma-vie__resultat" aria-labelledby="ma-vie-titre-resultat" aria-live="polite">
      <h2 id="ma-vie-titre-resultat">Ta vie dans l’année cosmique</h2>
      <div className="ma-vie__chiffre verre">
        <p>
          Si toute l’histoire de l’Univers tenait en un an, tu existerais depuis
        </p>
        <p className="ma-vie__secondes">{texteSecondes(secondes)}</p>
        <p>
          Ta naissance tomberait le 31 décembre, {dateCosmique(age)}.
          {revolu !== null ? ` Tu as ${ans(revolu)}.` : ' (Calcul approximatif : sans date exacte, on compte à partir du milieu de l’année.)'}
        </p>
        {ecriture?.ans && (
          <p>
            Et si toute l’histoire écrite tenait en un an, tu serais né(e) le <strong>{dateLoupe(age, ecriture.ans)}</strong>.
          </p>
        )}
      </div>

      {avant.length > 0 && (
        <>
          <h2>Quand tu es né(e)…</h2>
          <ul className="ma-vie__liste">
            {avant.map((e) => (
              <li key={e.id}>
                <span className="ma-vie__date">{e.dateCourte}</span>
                <span>
                  {e.titre} : {e.periode ? 'début ' : ''}{ans(e.ecart)} avant ton année de naissance.
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {depuis.length > 0 && (
        <>
          <h2>Depuis ta naissance</h2>
          <ul className="ma-vie__liste">
            {depuis.map((e) => (
              <li key={e.id}>
                <span className="ma-vie__date">{e.annee}</span>
                <span>{e.titre} : l’année de tes {ans(e.age)}.</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {autres.length > 0 && (
        <>
          <h2>Pour mesurer</h2>
          <ul className="ma-vie__liste">
            {autres.map((c) => <li key={c.id}><span>{c.texte}</span></li>)}
          </ul>
        </>
      )}

      <div className="ma-vie__partage">
        <button type="button" className="bouton-principal" onClick={onPartager}>Partager mon résultat</button>
        <p className="ma-vie__note">Le lien contient la date que tu as choisie, et rien d’autre.</p>
        <p role="status" className="ma-vie__message">{message}</p>
      </div>
    </section>
  );
}
