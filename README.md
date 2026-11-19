# Age of Conquest — version 0.8

Prototype de grande stratégie solo dans le Vieux Monde de Warhammer Fantasy.

## Nouveautés 0.8
- Retour à une carte 2D de style atlas médiéval sur parchemin.
- Provinces colorées selon leur propriétaire et sélectionnables.
- Ajout de l’Ostermark, du Mootland et d’Athel Loren.
- Villes, cités fortifiées et capitales affichées sur la carte.
- Garnisons urbaines ennemies indiquées par des badges et détaillées dans la fiche de province.
- Défense des villes prise en compte lors des batailles et changement de contrôle après conquête.
- Zoom, déplacement de la carte et commandes adaptées au tactile.

## Installation
Remplacer `index.html`, `app.js`, `styles.css`, `sw.js` et `README.md` à la racine du dépôt GitHub Pages. Conserver le dossier `assets` et ses images.

## Limites
La carte est une reconstruction vectorielle originale inspirée des atlas communautaires et des sources de jeu de rôle Warhammer. Les frontières et coordonnées restent une interprétation de prototype et doivent être affinées province par province. Les effectifs de garnison sont des valeurs de jeu, non des chiffres canoniques du lore.


## Version 0.9 — événements de campagne

Ajout d'un moteur d'événements dynamiques liés à la faction jouée : tensions des Électeurs, appels d'Ulric, rancunes naines, Waaagh!, éveil des morts, quête du Graal, signes du Chaos, gardiens de Kislev, caravane marchande, maladie et artefacts. Les événements modifient réellement les ressources, les garnisons, les armées et les relations diplomatiques. Leur apparition est aléatoire et dépend de la faction choisie.


## Version 1.0
- Ajout d’un bouton « Noms » sur la carte pour masquer/afficher les noms des provinces et dégager la lecture des villes et des armées.
- Commandes de zoom regroupées et plus faciles à utiliser sur écran tactile.
- Ajustements de la barre d’armée et de la légende sur petits écrans.
- Les sauvegardes de campagne existantes restent conservées : cette mise à jour ne réinitialise pas la partie.


## Version 1.0 — refonte visuelle de la carte
- Relief topographique et courbes de niveau supplémentaires.
- Encrage côtier et détails de terrain pour donner davantage de profondeur à l’atlas.
- Frontières provinciales plus fines, lisibles et mieux différenciées selon le contrôle.
- Typographie des provinces et des villes renforcée pour la lecture sur mobile.
- Aucun changement des règles de campagne ni des sauvegardes.


## Version 2.0 — refonte de la carte stratégique
- Refonte du fond cartographique : mer texturée, côtes encrées, papier, relief dessiné, chaînes montagneuses, forêts, rivières et routes.
- Les provinces, villes et armées restent des couches SVG interactives indépendantes du décor.
- Ajout de modes d’affichage Relief / Politique / Routes et conservation du masquage des noms.
- Le moteur de campagne et le format des sauvegardes ne sont pas réinitialisés.

**Limite connue :** cette étape améliore fortement la représentation et la lecture de la carte actuelle, mais ne constitue pas encore une reconstruction géographique exhaustive et certifiée de toutes les régions et colonies de Total War: Warhammer. Les provinces et positions existantes restent à vérifier et à compléter à partir de références cartographiques fiables.
