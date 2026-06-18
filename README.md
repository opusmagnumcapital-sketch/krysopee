# Krysopée — Site officiel

Site statique HTML/CSS pour krysopee.capital

## Structure des fichiers

| Fichier | Description |
|---|---|
| `index.html` | Page d'accueil principale |
| `fondateur.html` | Page Jean-Luc Manzaroli |
| `methode.html` | La Méthode — triptyque & quatre phases alchimiques |
| `compte-propre.html` | Activité 01 — Trading Compte Propre |
| `recherche.html` | Activité 02 — Recherche & Indicateurs IA |
| `confidentialite.html` | Politique de confidentialité |
| `mentions-legales.html` | Mentions légales |
| `style.css` | Feuille de styles partagée |
| `parcours.js` | Gestion du parcours visiteur (voir ci-dessous) |
| `favicon.svg` | Icône du site |

## Déploiement GitHub Pages

1. Pousser l'ensemble des fichiers à la racine du dépôt
2. Activer GitHub Pages depuis Settings > Pages > Branch: main
3. Le CNAME est configuré pour `krysopee.capital`

## Parcours visiteur

Le seuil d'entrée (`index.html`) propose deux portes : **L'Œuvre Visible** (technicien — méthode et marchés) et **L'Œuvre Intérieure** (éveillé — psychologie et transmission). Le choix est mémorisé dans `sessionStorage` par `parcours.js`, ce qui permet :

- d'adapter le ton de certains textes selon le profil (balises `data-ton="defaut visible interieure"`) ;
- d'afficher un bandeau "Vous suivez : …" avec une option pour changer de voie à tout moment ;
- de proposer, en fin de parcours sur `index.html`, une invitation à explorer l'autre voie.

Séquence de chaque parcours :
- **Technicien** : `compte-propre.html` → `recherche.html` → `index.html#fides`
- **Éveillé** : `fondateur.html` → `methode.html` → `index.html#fides`

☉ · Nemini Teneri · ☿
