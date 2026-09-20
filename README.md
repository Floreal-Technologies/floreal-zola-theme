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

The theme reads Zola's own settings — `base_url`, `title`, `description`,
`default_language` and the `[languages]` tables — and an `[extra]` table of its
own. `theme.toml` gives each `[extra]` key a default, and Zola merges that table
under the site's, so a site names only what it changes.

| Key | Type | What it does |
| --- | --- | --- |
| `backdrops` | list of tables | the photos the switcher offers. An empty list gives a page with no photo, no switcher, and the palette of `:root` |
| `default_backdrop` | string | the `id` of the photo every page ships with. An empty string, or an id no photo carries, gives the first of `backdrops` |
| `languages` | list of tables | the languages the nav switches between, in the order it shows them |
| `friends` | list of tables | the links in the footer. A site with no friend and no photo gets no footer |
| `favicon` | string | a path under `static/`, such as `img/favicon.png`. Unset, the page asks for no icon |
| `nav` | list of tables | the pages linked from the header, beside the language nav. An empty list gives no nav |
| `date_format` | string | how a date is written on the page, in the syntax `zola`'s own `date` filter takes |

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

`trans()` fails the build on a key a language does not carry, so every table
needs the whole list.

### A config.toml that uses all of it

```toml
base_url = "https://example.org"
title = "Floréal"
description = "What the house makes."
theme = "floreal"
default_language = "en"
compile_sass = true

[languages.fr]
title = "Floréal"
description = "Ce que la maison fabrique."

[extra]
favicon = "img/favicon.png"
default_backdrop = "mountains"

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
```

## Layout

| Path | What it holds |
| --- | --- |
| `config.toml` | site settings, `theme = "floreal"`, the two languages' words, the friends list, the backdrop list. See "Configuration" |
| `content/_index.md` | the landing page: `extra.tagline`, and `extra.products`, which products it shows |
| `content/products/` | one file per product, per language, and the section that lists them |
| `themes/floreal/` | the theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js` |
| `static/` | this site's own files: the backdrop photos, the licences, `CNAME` |

Files that end in `.fr.md` are the French versions. `content/_index.md` serves `/`
and `content/_index.fr.md` serves `/fr/`.

## Pages

| URL | Template | What it is |
| --- | --- | --- |
| `/`, `/fr/` | `index.html` | the landing page, with a card per product |
| `/products/`, `/fr/products/` | `products.html` | every product, as the same cards |
| `/products/<name>/` | `product.html` | one product, with its whole text |

A card's title links to that product's page. Every page but the landing page
carries breadcrumbs, and the language nav switches to the same page in the other
language — to the landing page of that language when the page has no translation
yet.

## The parts a page is built from

| File | What it draws |
| --- | --- |
| `macros.html` | `card()`, one product as a card; `actions()`, the row of buttons under a card or a product page; `btn()`, one button; `srcset()` and `fallback()`, a backdrop's URLs; `lang_url()`, a page in the other language |
| `partials/header.html` | the name of the house, the backdrop switcher, the language nav |
| `partials/crumbs.html` | the breadcrumbs |

Every URL the templates write is a full one, built by `get_url()` or taken from a
page's `permalink`. That is what lets the same theme serve a site that lives at
the root of a domain and one that lives under a sub-path of it.

A part is a macro when it can be: a macro takes named arguments, so the call says
what it is given. A part that calls `trans()` has to be an include instead, because
a macro cannot see the context that `trans()` reads — that is the whole of the rule,
and the two includes say at the top which variables they expect.

`themes/floreal/sass/floreal.scss` lists the stylesheet's parts in cascade order — `_tokens` (the
palette of each backdrop), `_base` (the page, its links and its two paragraph
styles), then one file per component: `_header`, `_menu`, `_crumbs`, `_prose`,
`_card`, `_button`, `_footer`, `_media`. Zola compiles them into the single
`/floreal.css` the pages ask for, so a rule for a component is added to that
component's file and nothing else changes.

## Adding a product

1. Write `content/products/<name>.md` and `content/products/<name>.fr.md`.
   `extra.what` is the small label above the title, and each `[[extra.actions]]`
   is a button. Both are optional: a product that gives neither gets neither — `label`, `url`, and `primary = true` on the one the reader is
   meant to take. The same list draws the buttons on the card and on the page. The body is the text of the product's own page.
2. Put `<!-- more -->` in the body after the opening sentences. Everything above
   it is the card text; the page shows the whole body. Without the marker, the
   card shows the body entire.
3. Add the file's path to `extra.products` in `content/_index.md`, and the French
   path to `content/_index.fr.md`. That list sets which products the landing page
   shows, and in what order.

A product gets its page and its place on `/products/` from the file alone; step 3
is only about the landing page. `/products/` lists them by title.

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
