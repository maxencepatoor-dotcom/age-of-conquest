# Age of Conquest — prototype 0.2

Application web progressive (PWA), pensée pour fonctionner localement dans le navigateur et être publiée sur GitHub Pages.

## Fichiers
- `index.html` : structure de l'interface
- `styles.css` : présentation responsive
- `app.js` : règles et état de campagne
- `manifest.webmanifest` : installation PWA
- `sw.js` : cache hors ligne
- `icon.svg` : icône

## Fonctions présentes
- Sélection parmi six factions
- Carte SVG avec provinces sélectionnables
- Trésorerie, revenus, garnisons et bâtiments
- Recrutement, déplacement d'armée et résolution automatique des assauts
- Passage de tour et événements rivaux simples
- Sauvegarde locale automatique
- Export/import JSON de campagne

## Publication GitHub Pages
1. Créer un dépôt GitHub public nommé `age-of-conquest`.
2. Ajouter tous les fichiers de ce dossier à la racine du dépôt.
3. Dans Settings > Pages, choisir Deploy from a branch, `main`, `/ (root)`.
4. Ouvrir l'URL GitHub Pages dans Safari. Pour l'installation iPhone : Partager > Sur l'écran d'accueil.

Aucun serveur ni compte n'est requis pour jouer. La sauvegarde reste dans le stockage local du navigateur. Exporter régulièrement un JSON pour conserver une copie.

## Limites connues du prototype
La carte est schématique et les règles de bataille/IA sont provisoires. La prochaine étape est d'améliorer la géographie, le système d'armées et l'IA sans casser le format de sauvegarde.
