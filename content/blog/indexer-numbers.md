+++
title = "The indexer, in numbers"
date = 2026-05-18
description = "Six weeks after the rewrite: what got faster, what got smaller, and what did not move."

[taxonomies]
tags = ["rust", "storage"]
categories = ["longform"]
+++

Six weeks ago we shipped the one-pass indexer. These are the numbers from the
machines that run it every day.

<!-- more -->

## Time and memory

We indexed the same four trees with the old indexer and the new one, five
times each, on the same laptop. The table shows the median run.

| Tree            |   Files | Old time | New time | Old peak memory | New peak memory |
|-----------------|--------:|---------:|---------:|----------------:|----------------:|
| Notes           |     812 |   0.4 s  |   0.2 s  |          38 MB  |          11 MB  |
| Photo library   |  14,305 |   9.8 s  |   3.1 s  |         610 MB  |          42 MB  |
| Source checkout |  61,920 |  41.2 s  |  12.7 s  |       2,380 MB  |          97 MB  |
| Mail archive    | 203,118 | swapped  |  44.9 s  |              —  |         188 MB  |

The time is two to three times shorter. The memory is the larger change: the
old indexer held the whole tree, the new one holds one entry at a time and the
index it writes.

> The mail archive never finished before. It finishes now, in less time than
> the source checkout used to take.

## What did not move

The first run on a cold disk is as slow as it was. Almost all of that time is
the disk, not the indexer.

| Step               | Share of a cold run |
|--------------------|:-------------------:|
| Read the directory |         71 %        |
| Read the file      |         22 %        |
| Write the index    |          6 %        |
| Everything else    |          1 %        |

A faster indexer cannot fix a slow disk. The next change is to read less: skip
the files whose size and date have not changed since the last run.

## What people told us

Two reports from the issue tracker sum up the six weeks.

> I point Lantern at my home directory every morning. It used to take the fan
> with it. Now I do not notice it.
>
> — a user on a 2019 laptop

> The index file is a third of the size. Our backups of it went from minutes
> to seconds.
>
> — the team that runs the shared archive

We did not plan for the second one. A smaller index was a side effect of
writing one entry at a time, and it is the change people mention most.
