+++
title = "L'indexeur, en chiffres"
date = 2026-05-18
description = "Six semaines après la réécriture : ce qui va plus vite, ce qui prend moins de place, et ce qui n'a pas bougé."

[taxonomies]
tags = ["rust", "stockage"]
categories = ["récits longs"]
+++

Il y a six semaines, nous avons livré l'indexeur en une passe. Voici les
chiffres des machines qui le font tourner chaque jour.

<!-- more -->

## Temps et mémoire

Nous avons indexé les quatre mêmes arborescences avec l'ancien indexeur et le
nouveau, cinq fois chacune, sur le même portable. Le tableau donne la médiane.

| Arborescence      | Fichiers | Ancien temps | Nouveau temps | Ancien pic mémoire | Nouveau pic mémoire |
|-------------------|---------:|-------------:|--------------:|-------------------:|--------------------:|
| Notes             |      812 |       0,4 s  |        0,2 s  |             38 Mo  |              11 Mo  |
| Photothèque       |   14 305 |       9,8 s  |        3,1 s  |            610 Mo  |              42 Mo  |
| Dépôt de sources  |   61 920 |      41,2 s  |       12,7 s  |          2 380 Mo  |              97 Mo  |
| Archive de courriel | 203 118 |    en swap   |       44,9 s  |                —   |             188 Mo  |

Le temps est deux à trois fois plus court. La mémoire est le plus grand
changement : l'ancien indexeur gardait toute l'arborescence, le nouveau ne garde
qu'une entrée à la fois et l'index qu'il écrit.

> L'archive de courriel n'allait jamais au bout. Elle y va maintenant, en moins
> de temps qu'il n'en fallait au dépôt de sources.

## Ce qui n'a pas bougé

Le premier passage sur un disque froid est aussi lent qu'avant. Presque tout ce
temps est celui du disque, pas celui de l'indexeur.

| Étape                 | Part d'un passage à froid |
|-----------------------|:-------------------------:|
| Lire le répertoire    |           71 %            |
| Lire le fichier       |           22 %            |
| Écrire l'index        |            6 %            |
| Tout le reste         |            1 %            |

Un indexeur plus rapide ne répare pas un disque lent. Le prochain changement
consiste à lire moins : sauter les fichiers dont la taille et la date n'ont pas
changé depuis le dernier passage.

## Ce qu'on nous a dit

Deux retours du suivi des tickets résument ces six semaines.

> Je lance Lantern sur mon répertoire personnel chaque matin. Avant, le
> ventilateur partait avec. Maintenant, je ne le remarque plus.
>
> — un utilisateur sur un portable de 2019

> Le fichier d'index fait un tiers de sa taille. Nos sauvegardes sont passées
> de quelques minutes à quelques secondes.
>
> — l'équipe qui gère l'archive partagée

Nous n'avions pas prévu le second. Un index plus petit était un effet de bord de
l'écriture entrée par entrée, et c'est le changement que l'on cite le plus.
