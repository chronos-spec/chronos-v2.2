import { useEffect, useRef } from 'react';
import { SOURCES } from '../data/textes.js';
import { PAR_ID } from '../data/index.js';

// Les publications citées par les fiches complètes (sans doublon).
const PUBLICATIONS = [...new Map(
  Object.values(PAR_ID).filter((e) => e.source?.texte).map((e) => [e.source.texte, e.source])
).values()];

// ---------------------------------------------------------------------------
// MENTIONS LÉGALES, CONFIDENTIALITÉ, CRÉDITS, ACCESSIBILITÉ (#/mentions-legales)
// Obligatoires pour un site publié en France : loi n° 2004-575 du 21 juin 2004 (LCEN, article 6),
// RGPD (règlement UE 2016/679) et loi Informatique et Libertés.
// ⚠ À COMPLÉTER avant la mise en ligne : les champs de EDITEUR ci-dessous.
// ---------------------------------------------------------------------------

const EDITEUR = {
  nom: '[Prénom Nom de l’éditeur]', // personne physique qui publie le site
  contact: '[adresse e-mail de contact]', // une adresse dédiée au site est conseillée
  // Particulier non professionnel : la loi permet de ne pas publier son adresse ni son téléphone,
  // à condition que l'hébergeur (Vercel) dispose de ces informations (LCEN, art. 6, III, 2).
};
const MISE_A_JOUR = '20 novembre 2026';

export default function MentionsLegales() {
  const titre = useRef(null);
  useEffect(() => {
    document.title = 'Mentions légales · Chronos';
    window.scrollTo(0, 0);
    titre.current?.focus({ preventScroll: true });
  }, []);

  return (
    <article className="legal">
      <h1 ref={titre} tabIndex={-1}>Mentions légales</h1>
      <p className="legal__maj">Dernière mise à jour : {MISE_A_JOUR}</p>

      <nav aria-label="Sommaire" className="legal__sommaire">
        <a href="#legal-editeur" onClick={aller}>Éditeur</a>
        <a href="#legal-hebergeur" onClick={aller}>Hébergeur</a>
        <a href="#legal-donnees" onClick={aller}>Données personnelles</a>
        <a href="#legal-cookies" onClick={aller}>Cookies et stockage</a>
        <a href="#legal-credits" onClick={aller}>Crédits et licences</a>
        <a href="#legal-sources" onClick={aller}>Sources</a>
        <a href="#legal-contenus" onClick={aller}>Contenus</a>
        <a href="#legal-accessibilite" onClick={aller}>Accessibilité</a>
      </nav>

      <section aria-labelledby="legal-editeur">
        <h2 id="legal-editeur">Éditeur du site</h2>
        <p>
          Chronos est un site personnel, non commercial et gratuit, publié par {EDITEUR.nom}, à titre de particulier.
        </p>
        <p>Directeur de la publication : {EDITEUR.nom}.</p>
        <p>Contact : {EDITEUR.contact}</p>
      </section>

      <section aria-labelledby="legal-hebergeur">
        <h2 id="legal-hebergeur">Hébergeur</h2>
        <p>
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
          Site : <a href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a>.
        </p>
      </section>

      <section aria-labelledby="legal-donnees">
        <h2 id="legal-donnees">Données personnelles</h2>
        <p>
          Chronos ne demande aucun compte, aucun formulaire, aucune adresse e-mail. Il n’y a ni publicité, ni outil
          de mesure d’audience, ni bouton de réseau social.
        </p>
        <p>Deux services reçoivent toutefois, comme pour tout site web, des données techniques de connexion :</p>
        <ul>
          <li>
            <strong>L’hébergeur Vercel</strong> reçoit l’adresse IP et le navigateur des visiteurs pour afficher le site
            et le protéger des attaques (journaux techniques conservés peu de temps).
          </li>
          <li>
            <strong>Wikipédia (Fondation Wikimedia)</strong> fournit les images des fiches : votre navigateur les
            télécharge directement depuis ses serveurs, qui reçoivent donc votre adresse IP.
          </li>
        </ul>
        <p>
          Ces deux sociétés sont situées aux États-Unis. Le transfert repose sur leurs engagements de protection des
          données (Data Privacy Framework UE–États-Unis et clauses contractuelles types). Base légale : l’intérêt
          légitime à faire fonctionner et illustrer le site (article 6.1.f du RGPD).
        </p>
        <p>
          Vous pouvez exercer vos droits (accès, effacement, opposition…) en écrivant à {EDITEUR.contact}, et
          déposer une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noreferrer">cnil.fr</a>).
        </p>
      </section>

      <section aria-labelledby="legal-cookies">
        <h2 id="legal-cookies">Cookies et stockage</h2>
        <p>
          Chronos ne dépose aucun cookie. Il garde seulement, dans votre navigateur, deux réglages que vous avez choisis
          (le zoom de la page, et l’affichage ou non de « l’année cosmique »). Ces réglages ne quittent jamais votre
          appareil et ne servent pas à vous suivre : ils ne demandent donc pas de consentement. Vous pouvez les effacer
          en vidant les données du site dans votre navigateur.
        </p>
        <p>Les polices de caractères sont hébergées avec le site : elles ne sont pas chargées depuis un service tiers.</p>
      </section>

      <section aria-labelledby="legal-credits">
        <h2 id="legal-credits">Crédits et licences</h2>
        <ul>
          <li>
            <strong>Images :</strong> elles proviennent de Wikipédia et de Wikimedia Commons, sous licences libres
            (Creative Commons, domaine public…). Chaque image renvoie vers sa page d’origine, où figurent son auteur et sa
            licence exacte. Les reconstitutions d’animaux disparus et les vues d’artiste sont des interprétations
            scientifiques, pas des photographies.
          </li>
          <li>
            <strong>Polices :</strong> Fraunces, Inter et JetBrains Mono, sous licence SIL Open Font License 1.1.
          </li>
          <li>
            <strong>Textes, mise en page et code :</strong> © {new Date().getFullYear()} {EDITEUR.nom}. Toute reproduction
            d’une partie importante du site nécessite une autorisation. Les courtes citations avec mention de la source
            sont les bienvenues.
          </li>
          <li>
            <strong>Sources :</strong> les fiches citent leurs sources (musées, agences spatiales, ouvrages de référence).
          </li>
        </ul>
        <p>
          Un ayant droit pense qu’un contenu est publié sans autorisation ? Écrivez à {EDITEUR.contact} : il sera retiré
          rapidement s’il y a lieu.
        </p>
      </section>

      <section aria-labelledby="legal-sources">
        <h2 id="legal-sources">Sources des contenus</h2>
        <p>
          Les textes du site sont rédigés à partir de sources publiques et scientifiques : organismes de recherche,
          agences spatiales, musées nationaux, archives et organisations internationales. Chaque fiche indique les
          siennes. En voici la liste complète.
        </p>
        <h3>Organismes et institutions</h3>
        <ul>
          {Object.values(SOURCES).map((src) => (
            <li key={src.url}>
              <a href={src.url} target="_blank" rel="noreferrer">{src.nom}</a>
            </li>
          ))}
        </ul>
        <h3>Publications scientifiques citées dans les fiches</h3>
        <ul>
          {PUBLICATIONS.map((src) => (
            <li key={src.texte}>
              {src.url ? <a href={src.url} target="_blank" rel="noreferrer">{src.texte}</a> : src.texte}
            </li>
          ))}
        </ul>
        <p>
          Les classifications du vivant s’appuient aussi sur G. Lecointre et H. Le Guyader, « Classification
          phylogénétique du vivant » (Belin, 4e éd., 2016) et sur le Tree of Life Web Project (tolweb.org).
        </p>
      </section>

      <section aria-labelledby="legal-contenus">
        <h2 id="legal-contenus">Contenus</h2>
        <p>
          Chronos est un site de vulgarisation. Les dates sont vérifiées et arrondies ; quand elles sont approximatives
          ou débattues par les chercheurs, la fiche l’indique. Les connaissances évoluent : une erreur repérée peut être
          signalée à {EDITEUR.contact}.
        </p>
        <p>
          Les récits religieux (comme ceux de la Bible) sont présentés comme tels, à côté des connaissances historiques
          et scientifiques, sans prendre parti.
        </p>
        <p>
          Les liens vers d’autres sites sont donnés pour aller plus loin ; l’éditeur n’est pas responsable de leur contenu.
        </p>
      </section>

      <section aria-labelledby="legal-accessibilite">
        <h2 id="legal-accessibilite">Accessibilité</h2>
        <p>
          Chronos vise le niveau AA des règles d’accessibilité WCAG 2.1 : navigation complète au clavier, textes
          alternatifs, contrastes renforcés, animations coupées si votre appareil demande moins de mouvement. Le site est
          encore en construction et n’a pas fait l’objet d’un audit officiel. Une difficulté ? Écrivez à {EDITEUR.contact}.
        </p>
      </section>

      <p className="legal__retour"><a href="#">← Retour à l’accueil</a></p>
    </article>
  );
}

// Les liens du sommaire font défiler la page sans changer l'adresse (qui sert à la navigation du site).
function aller(ev) {
  ev.preventDefault();
  const id = ev.currentTarget.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  el?.setAttribute('tabindex', '-1');
  el?.focus({ preventScroll: true });
}
