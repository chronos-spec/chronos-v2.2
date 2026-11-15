// Le menu déroulant des catégories : un vrai <select>, lisible au clavier et par les lecteurs d'écran.
export default function ChoixCategorie({ etage, valeur, onChanger }) {
  const idChamp = `categorie-${etage.id}`;
  const actuelle = etage.categories.find((c) => c.id === valeur);

  // Regroupe les catégories qui ont un « groupe » (ex. Histoire du christianisme).
  const groupes = [];
  etage.categories.forEach((c) => {
    const nom = c.groupe || '';
    let g = groupes.find((x) => x.nom === nom);
    if (!g) groupes.push((g = { nom, categories: [] }));
    g.categories.push(c);
  });

  const option = (c) => <option key={c.id} value={c.id}>{c.nom}</option>;

  return (
    <div className="choix">
      <label className="choix__libelle" htmlFor={idChamp}>Aller à une période</label>
      <div className="choix__cadre">
        <select
          id={idChamp}
          className="choix__menu"
          value={valeur}
          onChange={(e) => onChanger(e.target.value)}
        >
          {groupes.map((g) =>
            g.nom ? (
              <optgroup key={g.nom} label={g.nom}>{g.categories.map(option)}</optgroup>
            ) : (
              g.categories.map(option)
            )
          )}
        </select>
        <svg className="choix__fleche" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
      {actuelle.periode && <p className="choix__periode">{actuelle.periode}</p>}
    </div>
  );
}
