// Deux boutons − / + et le niveau actuel. Sert au zoom de la page et au zoom des frises.
export default function ZoomControles({ libelle, valeur, onMoins, onPlus, onRemettre, peutMoins = true, peutPlus = true, classe = '' }) {
  return (
    <div className={`zoom ${classe}`} role="group" aria-label={libelle}>
      <button type="button" className="zoom__bouton" onClick={onMoins} disabled={!peutMoins} aria-label={`${libelle} : dézoomer`}>
        <span aria-hidden="true">−</span>
      </button>
      <button type="button" className="zoom__valeur" onClick={onRemettre} aria-label={`${libelle} : ${valeur}. Revenir à la taille normale`}>
        {valeur}
      </button>
      <button type="button" className="zoom__bouton" onClick={onPlus} disabled={!peutPlus} aria-label={`${libelle} : zoomer`}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
