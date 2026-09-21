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

```rust
pub fn index(root: &Path) -> io::Result<Index> {
    let mut index = Index::default();
    for entry in WalkDir::new(root) {
        index.push(entry?.path())?;
    }
    Ok(index)
}
```

The counter is the length of the index, so `index.len()` is the count the first
pass used to make. The line that reads the tree is the only line that touches
the disk.

```rust,linenos,hl_lines=2
fn push(&mut self, path: &Path) -> io::Result<()> {
    self.entries.push(Entry::read(path)?);
    Ok(())
}
```
