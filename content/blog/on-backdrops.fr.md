+++
title = "Des arrière-plans"
date = 2026-03-02
description = "Pourquoi le thème lit les couleurs propres à une photo plutôt que d'en demander une."

[taxonomies]
tags = ["conception"]
categories = ["notes"]
+++

Une page avec une photo en fond a besoin d'une palette qui s'accorde avec la photo.

<!-- more -->

## Le problème d'une palette fixe

Un seul jeu de couleurs tombe mal contre la moitié des photos que l'on
choisira. Un champ vert veut une encre chaude ; une côte grise veut une encre
froide. Demander à la personne qui écrit `config.toml` de choisir les
couleurs à l'œil, photo par photo, c'est s'attirer des ennuis.

## Ce que fait le thème à la place

Chaque photo porte sa propre palette, fixée une fois pour toutes, à côté de
son fichier. La page lit la photo affichée et change sans recharger.
