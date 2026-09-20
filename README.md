# Floréal Zola Theme

![The landing page in two of the theme's backdrops, Mountains and Path, split by a diagonal](flor%C3%A9al-showcase.png)

Two backdrops, one page: each palette recolours the text, card and buttons.
`make-showcase.sh` builds this image from the two screenshots.

## Installing

The theme needs Zola 0.22.0 or later.

1. Put the theme in `themes/floreal/`:

   ```sh
   git submodule add https://github.com/Floreal-Technologies/floreal-zola-theme themes/floreal
   ```

2. Set `theme = "floreal"` in `config.toml`.
3. Add the `[extra]` keys and the translation words.

## Configuration

The theme reads Zola's settings (`base_url`, `title`, `description`,
`default_language`, `taxonomies`, `[languages]`) and its `[extra]` table,
defaulted by `theme.toml`. A site names only what it changes.

A site with taxonomies in more than one language repeats the list under
`[languages.fr]`, as this repository's `config.toml` does.

A page's `<title>`:

- A page's own title (normal pages).
- A term's name (term pages).
- The taxonomy's name, from `[extra.taxonomy_labels.<lang>]`, on `/tags/` or
  `/categories/`.
- The site's `title`, elsewhere.

| Key | Type | What it does |
| --- | --- | --- |
| `backdrops` | list of tables | the photos the switcher offers. Empty list: no photo, no switcher, palette of `:root` |
| `default_backdrop` | string | the `id` of the photo every page ships with. Empty, or an unknown id, picks the first of `backdrops` |
| `languages` | list of tables | the languages the nav switches between, in the order it shows them |
| `friends` | list of tables | the links in the footer. A site with no friend and no photo gets no footer |
| `favicon` | string | a path under `static/`, such as `img/favicon.png`. Unset, the page asks for no icon |
| `nav` | list of tables | the pages linked from the header, beside the language nav. An empty list gives no nav |
| `backdrop_labels` | table of tables | what each photo is called in the switcher: `[extra.backdrop_labels.<lang>]`, one entry per backdrop id. A photo named nowhere there is called by its id |
| `backdrop_credits` | table of tables | the line that names one photographer: `[extra.backdrop_credits.<lang>]`, one entry per backdrop id. HTML stands as written. A photo with no line is not credited |
| `nav_labels` | table of tables | the word each nav entry is given: `[extra.nav_labels.<lang>]`, one entry per nav key. A key named nowhere there is written out as it stands |
| `taxonomy_labels` | table of tables | what each taxonomy is called: `[extra.taxonomy_labels.<lang>]`, one entry per taxonomy name. A taxonomy named nowhere here is written out as it stands, so a site can declare a taxonomy and nothing else |
| `date_format` | string | how a date is written on the page, in the syntax Zola's own `date` filter takes |

### A backdrop

`[[extra.backdrops]]` fields:

| Key | What it is |
| --- | --- |
| `id` | the name the photo is known by, in `data-theme`, in the two words below, and in the stored choice |
| `base` | the path of its files under `static/`, with no leading slash and up to the width, such as `img/mountains-` |
| `widths` | the widths that exist, smallest first, such as `[1000, 1600, 2560]`. The widest is the one a browser that knows no `srcset` is given |
| `width`, `height` | the intrinsic size of the photo, which keeps the page from moving as it loads |
| `palette` | optional. See "Adding a background" |

### A language

`[[extra.languages]]` fields:

| Key | What it is |
| --- | --- |
| `code` | the language code. One of these must be the site's `default_language`; each of the others must have a `[languages.<code>]` table of its own |
| `path` | the landing page of that language, as a path under the site root: `/` for the default language, `/fr/` for the others |
| `label` | the word the nav shows |

This list is the theme's, not Zola's build list: it sets which languages
the nav offers, and their labels. A language missing here still builds,
but the nav skips it.

### A friend

`[[extra.friends]]` holds `name` and `url`.

### A nav entry

`[[extra.nav]]` fields:

| Key | What it is |
| --- | --- |
| `key` | the entry's name, used to look up its label under `[extra.nav_labels.<lang>]`. A key named nowhere there is written out as it stands |
| `path` | the page it links to, as a path under the language's own root, with no leading slash, such as `blog/` |

One list serves every language: `blog/` becomes `/blog/` in English,
`/fr/blog/` in French.

### The words

Every word the templates write comes from `trans()`. Each language needs
these keys, in `[translations]` (default) or `[languages.<code>.translations]`
(others).

| Key | Where it is read |
| --- | --- |
| `home_label` | the first breadcrumb |
| `breadcrumb_nav` | the name of the breadcrumbs, for a screen reader |
| `language_nav` | the name of the language nav, for a screen reader |
| `background_nav` | the name of the backdrop switcher, for a screen reader |
| `friends` | the words before the footer links |
| `not_found` | the line the 404 page says |
| `back_home` | the link under it |
| `nav_label` | the name of the pages nav, for a screen reader |
| `pagination_nav` | the name of the pager under a paginated list of articles, for a screen reader |
| `newer` | the pager's link to the newer page |
| `older` | the pager's link to the older page |
| `article_nav` | the name of the nav to the articles either side of one, for a screen reader |
| `newer_article` | the label over the link to the newer article |
| `older_article` | the label over the link to the older article |

`trans()` fails the build if a language's table lacks a key its built pages
read. The names a site coins itself are the exception: a taxonomy, a backdrop,
a nav entry. Those are read from `[extra.taxonomy_labels.<lang>]`,
`[extra.backdrop_labels.<lang>]`, `[extra.backdrop_credits.<lang>]` and
`[extra.nav_labels.<lang>]`, not from `trans()`. A name the table does not
carry falls back to the id or key it was declared under, with dashes and
underscores read as spaces: `authors` becomes `Authors`, `release-notes`
becomes `Release Notes`. A credit is the one with no such fallback: a photo
with no line is simply not credited. Declaring a taxonomy, a photo or a nav
entry therefore never breaks the build; it reads by its own name until a table
names it.

### A config.toml that uses all of it

```toml
base_url = "https://example.org"
title = "Floréal"
description = "What the house makes."
theme = "floreal"
default_language = "en"
compile_sass = true

taxonomies = [
  { name = "tags" },
  { name = "categories" },
]

[languages.fr]
title = "Floréal"
description = "Ce que la maison fabrique."
taxonomies = [
  { name = "tags" },
  { name = "categories" },
]

[extra]
favicon = "img/favicon.png"
default_backdrop = "mountains"
date_format = "%Y-%m-%d"

[extra.backdrop_labels.en]
mountains = "Mountains"
path = "Path"

[extra.backdrop_labels.fr]
mountains = "Montagnes"
path = "Chemin"

[extra.backdrop_credits.en]
mountains = "Photo by <a href=\"https://example.com\">Someone</a>"
path = "Photo by <a href=\"https://example.com\">Someone Else</a>"

[extra.backdrop_credits.fr]
mountains = "Photo de <a href=\"https://example.com\">Quelqu'un</a>"
path = "Photo de <a href=\"https://example.com\">Quelqu'un d'autre</a>"

[extra.nav_labels.en]
about = "About"
blog = "Blog"

[extra.nav_labels.fr]
about = "À propos"
blog = "Journal"

[extra.taxonomy_labels.en]
tags = "Tags"
categories = "Categories"

[extra.taxonomy_labels.fr]
tags = "Étiquettes"
categories = "Catégories"

[[extra.languages]]
code = "en"
path = "/"
label = "EN"

[[extra.languages]]
code = "fr"
path = "/fr/"
label = "FR"

[[extra.friends]]
name = "A House We Keep Company With"
url = "https://example.com"

[[extra.nav]]
key = "about"
path = "about/"

[[extra.nav]]
key = "blog"
path = "blog/"

[[extra.backdrops]]
id = "mountains"
base = "img/mountains-"
widths = [1000, 1600, 2560]
width = 2560
height = 1707

[extra.backdrops.palette]
ink = "#f4f1ea"
accent = "#c87a4b"
scrim = "rgba(20, 18, 16, 0.45)"

[[extra.backdrops]]
id = "path"
base = "img/path-"
widths = [1000, 1600, 2560]
width = 2560
height = 1707

[translations]
home_label = "Home"
breadcrumb_nav = "Breadcrumb"
language_nav = "Language"
background_nav = "Background"
friends = "We keep company with"
not_found = "This page is not here."
back_home = "Back to the front"
nav_label = "Pages"
pagination_nav = "Pages of articles"
newer = "Newer"
older = "Older"
article_nav = "Other articles"
newer_article = "Newer"
older_article = "Older"

[languages.fr.translations]
home_label = "Accueil"
breadcrumb_nav = "Fil d'Ariane"
language_nav = "Langue"
background_nav = "Arrière-plan"
friends = "Nous accompagnons"
not_found = "Cette page n'est pas ici."
back_home = "Retour à la façade"
nav_label = "Pages"
pagination_nav = "Pages d'articles"
newer = "Plus récents"
older = "Plus anciens"
article_nav = "Autres articles"
newer_article = "Plus récent"
older_article = "Plus ancien"
```

## Layout

| Path | What it holds |
| --- | --- |
| `config.toml` | site settings, `theme = "floreal"`, the two languages' words, the friends list, the backdrop list. See "Configuration" |
| `content/_index.md` | the landing page: `extra.tagline`, and `extra.hero`, the card in the middle of it. See "The landing page" |
| `content/about.md` | a page that stands on its own, reached from the header bar. See "Adding a page that stands on its own" |
| `content/products/` | one file per product, per language, and the section that lists them |
| `content/blog/` | one file per article, per language, and the section that lists and paginates them |
| `themes/floreal/` | the theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js`, `static/icons/` |
| `static/` | this site's own files: the backdrop photos, the licences, `CNAME` |

Files ending in `.fr.md` are the French versions: `content/_index.md` serves
`/`, `content/_index.fr.md` serves `/fr/`.

This is the layout a site using the theme writes. This repository's
`config.toml` and `content/` are its demo site.

## Pages

| URL | Template | What it is |
| --- | --- | --- |
| `/`, `/fr/` | `index.html` | the landing page: the tagline, and one card with the punchline and the ways in |
| `/products/`, `/fr/products/` | `products.html` | every product, as the same cards |
| `/products/<name>/` | `product.html` | one product, with its whole text |
| `/blog/`, `/fr/blog/` | `blog.html` | the first page of the article list |
| `/blog/page/<n>/`, `/fr/blog/page/<n>/` | `blog.html` | a later page of the same list |
| `/blog/<article>/` | `article.html` | one article, with its terms and its neighbours |
| `/about/`, `/fr/about/` | `page.html` | a page that stands on its own, written straight under `content/` |
| `/tags/`, `/categories/` | `taxonomy_list.html` | every term of that taxonomy |
| `/tags/<term>/`, `/categories/<term>/` | `taxonomy_single.html` | the articles filed under one term |

- The landing card's buttons lead where its front matter sends them; a
  product card's title links to that product's page.
- Every page but the landing page carries breadcrumbs.
- The language nav switches to the same page in the other language, or its
  landing page if untranslated. It is a row of links, which `floreal.js` folds
  into a drop-down of the same shape as the backdrop switcher: a reader with no
  script keeps every language, one click away.

## The parts a page is built from

| File | What it draws |
| --- | --- |
| `macros.html` | `card()`, one product as a card; `actions()`, the row of buttons under a card or a product page; `btn()`, one button; `href()`, where one button leads; `srcset()` and `fallback()`, a backdrop's URLs; `lang_url()`, a page in the other language |
| `partials/header.html` | the bar across the top: the name of the house, the pages, the backdrop switcher, the language nav |
| `partials/crumbs.html` | the breadcrumbs |
| `partials/pager.html` | the newer and older links under a list that runs to more than one page |

Every URL the templates write is a full one, from `get_url()`, or, in
`pills()`, from `get_taxonomy_url()`.

A part is a macro, unless it calls `trans()`: then it needs an include.
The three includes list their expected variables at the top.

`themes/floreal/sass/floreal.scss` lists the stylesheet's parts, in cascade order:

- `_tokens`: the palette of each backdrop.
- `_base`: the page, its links, and its two paragraph styles.
- One file per component: `_header`, `_menu`, `_crumbs`, `_prose`, `_card`,
  `_article`, `_button`, `_footer`, `_media`.

Zola compiles them into one file, `/floreal.css`. A component's rule goes
in its file only.

## The landing page

`/` and `/fr/` show `extra.tagline` from `content/_index.md`, and under it one
card: the line that says what the software is for, and the buttons that lead
into the site. The landing page writes both itself, in each language.

```toml
[extra]
tagline = "A house front, and the notes it keeps."

[extra.hero]
punchline = "Software that says what it did, and proves it."

[[extra.hero.actions]]
label = "What we make"
url = "@/products/_index.md"
primary = true

[[extra.hero.actions]]
label = "Read the notes"
url = "@/blog/_index.md"
```

| Key | What it does |
| --- | --- |
| `tagline` | the line under the house name. A landing page with none gets no line |
| `hero.punchline` | the line the card says. A landing page with no `[extra.hero]` gets no card |
| `hero.actions` | the buttons under it, in the order written. The fields are a product action's: `label`, `url`, `primary`, `where`. A landing page with none gets a card and no buttons |

An action's `url` is read the way a product's is: a full URL stands as it is,
and `@/products/_index.md` or a path that starts with `/` is a page of this
site, which the theme builds the full URL from. Prefer the `@/` form: Zola
resolves it to that page's own address, breaks the build if the file is not
there, and the French landing page names its own files,
`@/blog/_index.fr.md` among them.

The card draws the actions a product card would: an action that names
`where = "page"` is left out, and one that leads to the landing page itself is
dropped.

Sections are not cards. `/products/`, `/blog/`, `/tags/` and `/categories/` are
reached from the header bar, through `[[extra.nav]]`.

## Adding a page that stands on its own

A page written straight under `content/` — About, Contact, a licence note —
belongs to no section, carries no date, and is drawn by `page.html`, the
template Zola reaches for when nothing names another.

1. Write `content/about.md` and `content/about.fr.md`, with a `title` and a
   `description`. The body is the page.
2. Add the entry to `[[extra.nav]]`, and its word to
   `[extra.nav_labels.<lang>]`, so the header bar carries it:

   ```toml
   [[extra.nav]]
   key = "about"
   path = "about/"

   [extra.nav_labels.en]
   about = "About"

   [extra.nav_labels.fr]
   about = "À propos"
   ```

`[[extra.actions]]` works here as it does on a product page: a row of buttons
under the text, drawn from the actions that name `where = "page"` or nothing.
The breadcrumbs read Home / this page. A page written inside a section names
that section between the two, and a section that sets `page_template` draws
its own pages with that template instead.

## Adding a product

1. If `content/products/_index.md` (and `_index.fr.md`) does not exist yet,
   write it first, with `template = "products.html"` and
   `page_template = "product.html"`:

   ```toml
   +++
   title = "What we make"
   sort_by = "title"
   template = "products.html"
   page_template = "product.html"
   +++
   ```

   These keys make the theme draw the pages, or Zola serves its
   placeholder page instead.
2. Write `content/products/<name>.md` and `content/products/<name>.fr.md`.
   Two keys below are optional. Neither gives a label or buttons.
   - `extra.what`: the label above the title.
   - `[[extra.actions]]`: one entry per button.

   | Key | What it does |
   | --- | --- |
   | `label` | the word the button shows |
   | `url` | where the button leads. A full URL is used as it stands; `@/products/<name>.md` or a path that starts with `/` is a page of this site, and the theme builds the full URL from it |
   | `primary` | `true` on the one action the reader is to take. At most one per row |
   | `where` | which row the button is in: `"card"`, `"page"`, or `"both"`. A button that says nothing is in both |

   `where` keeps the two rows apart: the card holds the way in to the product's
   page, the page holds what the reader does next. A button that leads to the
   page being read is dropped.

   The body is the product's page text.
3. Put `<!-- more -->` after the opening sentences. The page always shows
   the whole body. The card shows only the text above it, or the whole
   body without a marker.
Once step 1 is done, a product's page and its card on `/products/` come from
the file alone. `/products/` lists by title. The landing page shows no
product: it shows one card of its own, and a button that leads here.

## Adding an article

1. If `content/blog/_index.md` (and `_index.fr.md`) does not exist yet, write
   it first, with `template = "blog.html"` and `page_template = "article.html"`:

   ```toml
   +++
   title = "Blog"
   sort_by = "date"
   paginate_by = 5
   generate_feeds = true
   template = "blog.html"
   page_template = "article.html"
   +++
   ```

   These keys make the theme draw the pages, or Zola serves its
   placeholder page (`<title>Zola</title>`) instead.
2. Write `content/blog/<name>.md` and `content/blog/<name>.fr.md`, each with a
   `date` and a `[taxonomies]` table, such as `tags = ["design"]` and
   `categories = ["notes"]`.
3. Put `<!-- more -->` after the opening sentences. Above it is the row's
   text on `/blog/`. The article page shows the whole body always.

A term needs no declaration beyond the `taxonomies` line in `config.toml`:
the first article naming it gets a page, at `/tags/<term>/` or
`/categories/<term>/`.

## Adding a background

For a new backdrop:

1. Put `<id>-1000`, `<id>-1600`, `<id>-2560` as `.jpg` and `.webp`, in
   `static/img/`.
2. Add an `[[extra.backdrops]]` block with `id`, `base`, `widths`, `width`,
   and `height`.
3. Name it under `[extra.backdrop_labels.<lang>]` (button label) and
   `[extra.backdrop_credits.<lang>]` (footer line), in each language. Both are
   optional: with no label the button reads the id, with no line the photo is
   not credited. A backdrop's credit shows only when that backdrop is active.
4. Add `[extra.backdrops.palette]`, in the same block, with these keys:
   `ink`, `ink-dim`, `line`, `tint`, `card`, `card-solid`, `accent`, `sand`,
   `sand-lift`, `on-sand`, `bg`, `focus-pos`, `scrim`. Each becomes a CSS
   variable for that backdrop. No palette: use the default in
   `themes/floreal/sass/_tokens.scss`.

`extra.default_backdrop` names the photo the built page ships with. A site
naming none ships the list's first backdrop.

The reader's choice is kept in the browser under `floreal-theme`, and read
by a script in the page head before the first paint. An unlisted id is
ignored.

## The demo site

`config.toml` and `content/` at this repository's root are the theme's own
demo site, not an example. Run `zola serve` here to see a change directly.
A site using the theme writes its own, and ignores these.
