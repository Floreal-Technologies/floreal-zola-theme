+++
title = "Pourquoi nous avons réécrit l'indexeur"
date = 2026-04-12
description = "Une réécriture qui a rendu l'index plus petit et la recherche plus rapide."

[taxonomies]
tags = ["rust", "stockage"]
categories = ["récits longs"]
+++

Le premier indexeur lisait chaque fichier deux fois : une pour compter, une pour ranger.

<!-- more -->

## Ce qui était lent

Compter coûte peu. Ranger coûte cher. La seconde passe gardait tout l'arbre en
mémoire, et un arbre de dix mille fichiers est un arbre qui fait swapper la machine.

## Ce que nous avons fait

Une seule passe, et un compteur qui grandit au fil de l'eau.
