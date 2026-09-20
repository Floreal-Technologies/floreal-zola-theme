+++
title = "Why we rewrote the indexer"
date = 2026-04-12
description = "A rewrite that made the index smaller and the search faster."

[taxonomies]
tags = ["rust", "storage"]
categories = ["longform"]
+++

The first indexer read every file twice: once to count, once to store.

<!-- more -->

## What was slow

Counting is cheap. Storing is not. The second pass held the whole tree in
memory, and a tree of ten thousand files is a tree the machine swaps.

## What we did

One pass, and a counter that grows as it goes.
