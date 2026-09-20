+++
title = "On backdrops"
date = 2026-03-02
description = "Why the theme reads a photo's own colours instead of asking for one."

[taxonomies]
tags = ["design"]
categories = ["notes"]
+++

A page with a photo behind it needs a palette that agrees with the photo.

<!-- more -->

## The problem with a fixed palette

One set of colours looks wrong against half the photos anyone will pick. A
green field wants warm ink; a grey coast wants cool ink. Asking the person
who wrote `config.toml` to choose colours by eye, per photo, is asking for
trouble.

## What the theme does instead

Each photo carries its own palette, set once, next to its file. The page
reads whichever photo is on screen and switches without a reload.
