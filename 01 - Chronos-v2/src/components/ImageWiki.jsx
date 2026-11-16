import { useEffect, useRef, useState } from 'react';
import { imageDe } from '../lib/images.js';

// Une image d'espèce venue de Wikipédia, chargée seulement quand elle arrive à l'écran.
// Toujours avec un lien vers la page d'origine (licences libres de Wikimedia Commons).
export default function ImageWiki({ titre, alt, taille = 'moyenne' }) {
  const boite = useRef(null);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(undefined); // undefined = en cours, null = pas d'image

  useEffect(() => {
    const el = boite.current;
    if (!el || !titre) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [titre]);

  useEffect(() => {
    if (!visible || !titre) return undefined;
    let actif = true;
    imageDe(titre).then((r) => actif && setImage(r));
    return () => {
      actif = false;
    };
  }, [visible, titre]);

  const sansImage = !titre || image === null;
  // « mini » : une vignette sans légende (elle peut être dans un bouton) ; le crédit est donné plus bas dans la page.
  const mini = taille === 'mini';
  const Boite = mini ? 'span' : 'figure';
  return (
    <Boite ref={boite} className={`image-wiki image-wiki--${taille}${sansImage ? ' image-wiki--vide' : ''}`}>
      {image ? (
        <>
          <img src={image.src} alt={alt} loading="lazy" decoding="async" />
          {!mini && (
          <figcaption>
            <a href={image.page} target="_blank" rel="noreferrer">
              Image : Wikipédia<span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          </figcaption>
          )}
        </>
      ) : (
        <span className="image-wiki__attente" aria-hidden={!sansImage}>
          {sansImage && !mini ? 'Pas encore d’image' : ''}
        </span>
      )}
    </Boite>
  );
}
