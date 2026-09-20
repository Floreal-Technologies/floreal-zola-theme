# Floréal Zola Theme

![The landing page in two of the theme's backdrops, Mountains and Path, split by a diagonal](flor%C3%A9al-showcase.png)

The same page in two backdrops. Each one carries its own palette, so the text,
the card and the buttons change colour with the photo. `make-showcase.sh` builds
this image from the two screenshots.

## Installing

The theme needs Zola 0.22.0 or later.

1. Put the theme in `themes/floreal/`:

   ```sh
   git submodule add https://github.com/Floreal-Technologies/floreal-zola-theme themes/floreal
   ```

2. Set `theme = "floreal"` in `config.toml`.
3. Add the `[extra]` keys and the words the theme reads. The next section names
   all of them, and ends with a `config.toml` that uses every one.

## Configuration

The theme reads Zola's own settings (`base_url`, `title`, `description`,
`default_language`, `taxonomies` and the `[languages]` tables) and an
`[extra]` table of its own. `theme.toml` gives each `[extra]` key a default,
and Zola merges that table under the site's, so a site names only what it
changes.

A site that wants tags and categories in other languages too (say French)
has to repeat the same `taxonomies` list under `[languages.fr]`, as this
repository's own `config.toml` does.

A page's `<title>` is its own title. A term's page takes the term's name. A
taxonomy's own list, `/tags/` or `/categories/`, takes that taxonomy's word:
`taxonomy_tags` or `taxonomy_categories`. Every other page takes the site's
`title`.

| Key | Type | What it does |
| --- | --- | --- |
| `backdrops` | list of tables | the photos the switcher offers. An empty list gives a page with no photo, no switcher, and the palette of `:root` |
| `default_backdrop` | string | the `id` of the photo every page ships with. An empty string, or an id no photo carries, gives the first of `backdrops` |
| `languages` | list of tables | the languages the nav switches between, in the order it shows them |
| `friends` | list of tables | the links in the footer. A site with no friend and no photo gets no footer |
| `favicon` | string | a path under `static/`, such as `img/favicon.png`. Unset, the page asks for no icon |
| `nav` | list of tables | the pages linked from the header, beside the language nav. An empty list gives no nav |
| `date_format` | string | how a date is written on the page, in the syntax Zola's own `date` filter takes |

### A backdrop

Each entry of `[[extra.backdrops]]` holds:

| Key | What it is |
| --- | --- |
| `id` | the name the photo is known by, in `data-theme`, in the two words below, and in the stored choice |
| `base` | the path of its files under `static/`, with no leading slash and up to the width, such as `img/mountains-` |
| `widths` | the widths that exist, smallest first, such as `[1000, 1600, 2560]`. The widest is the one a browser that knows no `srcset` is given |
| `width`, `height` | the intrinsic size of the photo, which keeps the page from moving as it loads |
| `palette` | optional. See "Adding a background" |

### A language

Each entry of `[[extra.languages]]` holds:

| Key | What it is |
| --- | --- |
| `code` | the language code. One of these must be the site's `default_language`; each of the others must have a `[languages.<code>]` table of its own |
| `path` | the landing page of that language, as a path under the site root: `/` for the default language, `/fr/` for the others |
| `label` | the word the nav shows |

The list is the theme's, not Zola's: Zola's `[languages]` tables say which
languages the site builds, and this list says which ones the nav offers and what
it calls them. A language that is missing here is built but never linked to.

### A friend

Each entry of `[[extra.friends]]` holds a `name` and a `url`.

### A nav entry

Each entry of `[[extra.nav]]` holds:

| Key | What it is |
| --- | --- |
| `key` | the entry's name, used to look up its label: `nav_<key>` in `[translations]` |
| `path` | the page it links to, as a path under the language's own root, with no leading slash, such as `blog/` |

One list serves every language: the theme builds each link from the current
language's `home_url`, so `blog/` becomes `/blog/` in English and `/fr/blog/`
in French.

### The words

Every word the templates write themselves comes from `trans()`, so each
language's translations table — `[translations]` for the default language, and
`[languages.<code>.translations]` for the others — has to carry all of these:

| Key | Where it is read |
| --- | --- |
| `home_label` | the first breadcrumb |
| `products_label` | the name of the card section on the landing page, for a screen reader |
| `breadcrumb_nav` | the name of the breadcrumbs, for a screen reader |
| `language_nav` | the name of the language nav, for a screen reader |
| `background_nav` | the name of the backdrop switcher, for a screen reader |
| `friends` | the words before the footer links |
| `not_found` | the line the 404 page says |
| `back_home` | the link under it |
| `backdrop_<id>` | the name of one photo, in the switcher. One per backdrop |
| `credit_<id>` | the line that names one photographer, in the footer. One per backdrop |
| `nav_label` | the name of the pages nav, for a screen reader |
| `nav_<key>` | the label of one nav entry. One per entry of `[[extra.nav]]` |
| `taxonomy_tags`, `taxonomy_categories` | the name of that taxonomy, in its own list's `<title>` and heading, and in the breadcrumb from one of its terms. Read as soon as `taxonomies` is set, not only when `nav` links to it. The key is `taxonomy_<name>`, one per taxonomy the site declares |
| `pagination_nav` | the name of the pager under a paginated list of articles, for a screen reader |
| `newer` | the pager's link to the newer page |
| `older` | the pager's link to the older page |
| `article_nav` | the name of the nav to the articles either side of one, for a screen reader |
| `newer_article` | the label over the link to the newer article |
| `older_article` | the label over the link to the older article |

`trans()` fails the build on a key a language does not carry, so a table needs
every key the pages that site builds actually read.

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
products_label = "What we make"
breadcrumb_nav = "Breadcrumb"
language_nav = "Language"
background_nav = "Background"
friends = "We keep company with"
not_found = "This page is not here."
back_home = "Back to the front"
backdrop_mountains = "Mountains"
backdrop_path = "Path"
credit_mountains = "Photo by <a href=\"https://example.com\">Someone</a>"
credit_path = "Photo by <a href=\"https://example.com\">Someone Else</a>"
nav_label = "Pages"
nav_blog = "Blog"
taxonomy_tags = "Tags"
taxonomy_categories = "Categories"
pagination_nav = "Pages of articles"
newer = "Newer"
older = "Older"
article_nav = "Other articles"
newer_article = "Newer"
older_article = "Older"

[languages.fr.translations]
home_label = "Accueil"
products_label = "Ce que nous fabriquons"
breadcrumb_nav = "Fil d'Ariane"
language_nav = "Langue"
background_nav = "Arrière-plan"
friends = "Nous accompagnons"
not_found = "Cette page n'est pas ici."
back_home = "Retour à la façade"
backdrop_mountains = "Montagnes"
backdrop_path = "Chemin"
credit_mountains = "Photo de <a href=\"https://example.com\">Quelqu'un</a>"
credit_path = "Photo de <a href=\"https://example.com\">Quelqu'un d'autre</a>"
nav_label = "Pages"
nav_blog = "Journal"
taxonomy_tags = "Étiquettes"
taxonomy_categories = "Catégories"
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
| `content/_index.md` | the landing page: `extra.tagline`, and `extra.products`, which products it shows |
| `content/products/` | one file per product, per language, and the section that lists them |
| `content/blog/` | one file per article, per language, and the section that lists and paginates them |
| `themes/floreal/` | the theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js` |
| `static/` | this site's own files: the backdrop photos, the licences, `CNAME` |

Files that end in `.fr.md` are the French versions. `content/_index.md` serves `/`
and `content/_index.fr.md` serves `/fr/`.

This layout is what a site using the theme writes. The `config.toml` and
`content/` at the root of this repository are the theme's own demo site. See
"The demo site".

## Pages

| URL | Template | What it is |
| --- | --- | --- |
| `/`, `/fr/` | `index.html` | the landing page, with a card per product |
| `/products/`, `/fr/products/` | `products.html` | every product, as the same cards |
| `/products/<name>/` | `product.html` | one product, with its whole text |
| `/blog/`, `/fr/blog/` | `blog.html` | the first page of the article list |
| `/blog/page/<n>/`, `/fr/blog/page/<n>/` | `blog.html` | a later page of the same list |
| `/blog/<article>/` | `article.html` | one article, with its terms and its neighbours |
| `/tags/`, `/categories/` | `taxonomy_list.html` | every term of that taxonomy |
| `/tags/<term>/`, `/categories/<term>/` | `taxonomy_single.html` | the articles filed under one term |

A card's title links to that product's page. Every page but the landing page
carries breadcrumbs, and the language nav switches to the same page in the other
language — to the landing page of that language when the page has no translation
yet.

## The parts a page is built from

| File | What it draws |
| --- | --- |
| `macros.html` | `card()`, one product as a card; `actions()`, the row of buttons under a card or a product page; `btn()`, one button; `srcset()` and `fallback()`, a backdrop's URLs; `lang_url()`, a page in the other language; `article_row()`, one article in a list; `pills()`, the terms a page carries; `feed_link()`, one feed's `<link>` in the head |
| `partials/header.html` | the name of the house, the backdrop switcher, the pages nav, the language nav |
| `partials/crumbs.html` | the breadcrumbs |
| `partials/pager.html` | the newer and older links under a list that runs to more than one page |

Every URL the templates write is a full one, built by `get_url()`, taken from a
page's `permalink`, or, in `pills()`, built by `get_taxonomy_url()`. That is
what lets the same theme serve a site that lives at the root of a domain and
one that lives under a sub-path of it.

A part is a macro when it can be: a macro takes named arguments, so the call says
what it is given. A part that calls `trans()` has to be an include instead, because
a macro cannot see the context that `trans()` reads — that is the whole of the rule,
and the three includes say at the top which variables they expect.

`themes/floreal/sass/floreal.scss` lists the stylesheet's parts in cascade order — `_tokens` (the
palette of each backdrop), `_base` (the page, its links and its two paragraph
styles), then one file per component: `_header`, `_menu`, `_crumbs`, `_prose`,
`_card`, `_article`, `_button`, `_footer`, `_media`. Zola compiles them into the single
`/floreal.css` the pages ask for, so a rule for a component is added to that
component's file and nothing else changes.

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

   The two template keys are what make the theme draw the pages. A section
   without them builds without error and serves Zola's own placeholder page
   instead.
2. Write `content/products/<name>.md` and `content/products/<name>.fr.md`.
   `extra.what` is the small label above the title, and each `[[extra.actions]]`
   is a button. Both are optional: a product that gives neither gets neither — `label`, `url`, and `primary = true` on the one the reader is
   meant to take. The same list draws the buttons on the card and on the page. The body is the text of the product's own page.
3. Put `<!-- more -->` in the body after the opening sentences. Everything above
   it is the card text; the page shows the whole body. Without the marker, the
   card shows the body entire.
4. Add the file's path to `extra.products` in `content/_index.md`, and the French
   path to `content/_index.fr.md`. That list sets which products the landing page
   shows, and in what order.

A product gets its page and its place on `/products/` from the file alone once
step 1 is done; step 4 is only about the landing page. `/products/` lists them
by title.

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

   The two template keys are what make the theme draw the pages. A section
   without them builds without error and serves Zola's own placeholder page
   (`<title>Zola</title>`) instead, because the theme ships no `section.html`
   or `page.html` of its own.
2. Write `content/blog/<name>.md` and `content/blog/<name>.fr.md`, each with a
   `date` and a `[taxonomies]` table, such as `tags = ["design"]` and
   `categories = ["notes"]`.
3. Put `<!-- more -->` in the body after the opening sentences, the way a
   product's page does. Everything above it is the row's text on `/blog/`; the
   article's own page shows the whole body.

A term needs no declaration beyond the `taxonomies` line in `config.toml`: the
first article that names one is enough to give it a page, at `/tags/<term>/`
or `/categories/<term>/`.

## Adding a background

The switcher at the top of the page reads `[[extra.backdrops]]` in `config.toml`.
For a new one:

1. Put `<id>-1000`, `<id>-1600` and `<id>-2560`, as both `.jpg` and `.webp`, in
   `static/img/`.
2. Add an `[[extra.backdrops]]` block with `id`, `base`, `widths`, `width` and
   `height`, as "A backdrop" above gives them.
3. Add `backdrop_<id>` (the button label) and `credit_<id>` (the footer line) to
   both `[translations]` tables. The credit shows itself when that photo is the
   one on: `base.html` writes the rule that pairs the two.
4. Give it an `[extra.backdrops.palette]` table, under its own
   `[[extra.backdrops]]` block: `ink`, `ink-dim`, `line`, `tint`, `card`,
   `card-solid`, `accent`, `sand`, `sand-lift`, `on-sand`, `bg`, `focus-pos`
   and `scrim`. Each key becomes a custom property on
   `html[data-theme="<id>"]`, written into the page by `base.html`. A photo
   that is given no palette is read against the one on `:root`, in
   `themes/floreal/sass/_tokens.scss`, which belongs to no photo.

`extra.default_backdrop` names the photo the built page ships with; a site that
names none ships the first of the list. The reader's own choice is kept in the
browser, under the key `floreal-theme`, and a small script in the head of every
page reads it back before the first paint, so the page does not show one palette
and then another. A stored id that the list no longer carries is passed over.

## The demo site

`config.toml` and `content/` at the root of this repository are the theme's
own site, not an example to copy. `zola serve`, run here, builds it, so a
change to a template or a stylesheet can be looked at without a second
repository. A site that uses the theme writes its own `config.toml` and `content/`, as
"Installing" says, and ignores both.
