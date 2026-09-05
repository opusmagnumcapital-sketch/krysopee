# Krysopée — Site officiel

Site statique HTML/CSS pour krysopee.capital

## Structure des fichiers

| Fichier | Description |
|---|---|
| `index.html` | Page d'accueil — neutre, 6 blocs |
| `manifeste.html` | Le Manifeste — traduction descendante des 7 chapitres publics + glossaire |
| `ecosysteme.html` | Écosystème — K-V2 PHIBO, Krysalide, teaser Praxis |
| `krysalide.html` | Krysalide — le compte de trading de Krysopée (anciennement `k-solstice.html`, renommé août 2026 ; ancienne URL conservée comme redirection statique) |
| `parcours-opus-magnum.html` | Parcours Opus Magnum — transmission individuelle et sélective |
| `miroir.html` | Le Miroir des Trois Voies — questionnaire d'auto-positionnement en 24 questions, intégré à la navigation depuis août 2026 |
| `praxis.html` | Praxis — teaser et renvoi vers les publications LinkedIn |
| `fondateur.html` | Page Jean-Luc Manzaroli — sans photo |
| `contact.html` | Contact — formulaire épuré (nom / e-mail / message) |
| `confidentialite.html` | Politique de confidentialité |
| `mentions-legales.html` | Mentions légales |
| `style.css` | Feuille de styles partagée |
| `favicon.svg` | Icône du site |

**Note (août 2026)** : Fides & Co et la Fondation Amaltheia ne figurent dans aucune page du site actuel — Fides & Co est en pause opérationnelle pour 2-3 ans minimum. Cette entrée README a été corrigée pour refléter le contenu réel des fichiers.

## Déploiement GitHub Pages

1. Pousser l'ensemble des fichiers à la racine du dépôt
2. Activer GitHub Pages depuis Settings > Pages > Branch: main
3. Le CNAME est configuré pour `krysopee.capital`

## Changements par rapport à la version précédente (juin 2026)

- Suppression du double parcours visiteur (Technicien / Éveillé) — l'accueil est désormais neutre.
- Suppression de `parcours.js`, `compte-propre.html`, `recherche.html`, `methode.html` — leur contenu est redistribué dans `manifeste.html` et `ecosysteme.html`.
- Suppression de toute référence au canal K | Arcana (Substack), fermé.
- Suppression du module "Aurum Nostrum".
- Correction d'un bug de nommage : les anciennes pages légales (`confidentielle.html`, `mentions-légaux.html`) ne correspondaient pas aux liens du footer (`confidentialite.html`, `mentions-legales.html`) — corrigé.
- Nouvelle arborescence à 7 pages : Accueil · Le Manifeste · Écosystème · Parcours Opus Magnum · Praxis · Fondateur · Contact.

☉ · Nemini Teneri · ☿
