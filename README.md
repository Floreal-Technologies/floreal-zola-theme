# Floréal Zola Theme

![The landing page in two of the theme's backdrops, Mountains and Path, split by a diagonal](flor%C3%A9al-showcase.png)

Two backdrops, one page. Each palette recolors the text, the card and the
buttons. `make-showcase.sh` builds this image from the two screenshots.

## Installing

The theme needs Zola 0.23.6 or later.

1. Add the theme as a submodule:

   ```sh
   git submodule add https://github.com/Floreal-Technologies/floreal-zola-theme themes/floreal
   ```

2. Set `theme = "floreal"` in `config.toml`.

That is all. Every key the theme reads has a default in `theme.toml`, and the
theme strings ship in English.

## Configuration

The theme reads these Zola settings: `base_url`, `title`, `description`,
`default_language`, `taxonomies` and `[languages]`.

It also reads `[extra]`, with the defaults from `theme.toml`. Zola merges it
key by key, so a site keeps the defaults for what it does not set.

A site with taxonomies in more than one language repeats the list under
`[languages.fr]`. The `config.toml` file of this repository does this.

The `<title>` of a page comes from one of these:

- The title of the page, on a normal page.
- The name of the term, on a term page.
- The name of the taxonomy from `[extra.labels.<lang>]`, on `/tags/` and `/categories/`.
- The `title` of the site, on all other pages.

| Key | Type | What it does |
| --- | --- | --- |
| `backdrops` | list of tables | The backdrops the switcher offers. An empty list gives no backdrop, no switcher, and the palette of `:root` |
| `default_backdrop` | string | The `id` of the backdrop that every page ships with. An empty or unknown id selects the first backdrop |
| `friends` | list of tables | The links in the footer. A site with no friend and no backdrop gets no footer |
| `favicon` | string | A path under `static/`, such as `img/favicon.png`. Unset, the page asks for no icon |
| `logo` | string | A path under `static/`. Shown left of the site name and over the landing card when set. See "A logo" |
| `logo_tint` | boolean | `true` paints the logo with the colour of the backdrop. `false` shows the file as it is. The default is `true` |
| `nav` | list of tables | The pages linked from the header, beside the language nav. An empty list gives no nav |
| `labels` | table of tables | The name of a thing, per language, under `[extra.labels.<lang>]`. One table names a nav entry by its path, a taxonomy by its name, and a backdrop by its id |
| `backdrop_credits` | table of tables | The credit line for one photographer, under `[extra.backdrop_credits.<lang>]`, one entry per backdrop id. HTML stands as written. A backdrop with no line gets no credit |
| `strings` | table of tables | The theme strings, per language, under `[extra.strings.<lang>]`. English ships with the theme. A site names only what it translates |
| `language_labels` | table | The name of a language in the nav, keyed by code. A language named nowhere here shows its code in capitals |
| `language_order` | list of strings | The order of the language nav. Unset, the language of the site comes first and the rest follow in alphabetical order |
| `date_format` | string | The format of a date on the page, in the syntax of the Zola `date` filter |
| `meta_taxonomy` | string | The taxonomy shown beside the date of an article. The default is `categories`. Every other taxonomy shows as terms under the article |
| `justif` | table | Justified article paragraphs, broken by [justif](https://github.com/lyallcooper/justif). Off by default. See "Justified text" |
| `icons` | table | How `floreal.icon` draws a glyph: `mode = "inline"` or `mode = "sprite"`. The default is `inline`. See "Adding an icon" |

### A backdrop

`[[extra.backdrops]]` holds these fields:

| Key | What it is |
| --- | --- |
| `id` | The name of the backdrop. It is used in `data-theme`, in the two tables that name it, and in the stored choice |
| `width`, `height` | The intrinsic size of the image. It keeps the page from moving as the image loads |
| `base` | Optional. The path of the files under `static/`, with no leading slash, up to the width. The default is `img/<id>-` |
| `widths` | Optional. The widths that exist, smallest first. The default is `[1000, 1600, 2560]`, which the recipe under "Adding a background" makes. A browser with no `srcset` support gets the largest width |
| `palette` | Optional. See "Adding a background" |

### A logo

`extra.logo` puts a logo left of the site name, in the header of every page.
It also puts a larger copy over the line of the landing card.

With `logo_tint = true`, the theme uses only the shape of the file. It paints
the shape with the `sand` key of the palette of the backdrop, the colour of
the primary button.

With `logo_tint = false`, the file shows with its own colours.

```toml
[extra]
logo = "img/logo.svg"

[extra.backdrops.palette]
sand = "#c87a4b"
```

### Languages

The theme takes the languages from `default_language` and the
`[languages.<code>]` tables of Zola.

A language that the site builds is a language that the nav offers. Two
optional keys change the nav:

```toml
[extra]
language_order = ["fr", "en"]

[extra.language_labels]
fr = "Français"
```

`language_labels` gives a language a name other than its code in capitals.
`language_order` fixes the order.

### A friend

`[[extra.friends]]` holds `name` and `url`.

Useful for a webring.

### A nav entry

`[[extra.nav]]` holds one key, `path`:

```toml
[[extra.nav]]
path = "blog/"
```

A path with no scheme is read against the landing page of the reader. Thus
`blog/` is `/blog/` in English and `/fr/blog/` in French.

A path can also be `@/blog/_index.md`. Zola resolves it and stops the build if
the file is absent.

A path can also be a full URL, which leads off the site.

The word of the entry comes from `[extra.labels.<lang>]`, under the path with
its slashes removed: `blog/` is read as `blog`.

An entry named nowhere there shows its key.

### The names a site coins

One table names everything that a site calls by its own name:

```toml
[extra.labels.en]
about = "About"
blog = "Blog"
tags = "Tags"
mountains = "Mountains"

[extra.labels.fr]
about = "À propos"
blog = "Journal"
tags = "Étiquettes"
mountains = "Montagnes"
```

A nav entry, a taxonomy and a backdrop are read from the same table. A site
with `/tags/` in the header and `tags` as a taxonomy means the same word twice.

A key that the table does not hold falls back to the key itself, with dashes
and underscores as spaces: `release-notes` becomes `Release Notes`.

A new taxonomy, backdrop or nav entry therefore never stops the build.

`[extra.backdrop_credits.<lang>]` has no such fallback. A backdrop with no line
gets no credit.

### The theme strings

The theme strings ship with the theme, in English, in `theme.toml`. A site
translates one string by naming that key under `[extra.strings.<lang>]`.

Every key that it does not name falls back to the English, so a
part-translated language still reads correctly.

| Key | Where it is read |
| --- | --- |
| `home_label` | The first breadcrumb |
| `skip_to_content` | The link past the header bar, shown when the keyboard reaches it |
| `breadcrumb_nav` | The name of the breadcrumbs, for a screen reader |
| `language_nav` | The name of the language nav, for a screen reader |
| `background_nav` | The name of the backdrop switcher, for a screen reader |
| `nav_label` | The name of the pages nav, for a screen reader |
| `friends` | The words before the footer links |
| `not_found` | The line on the 404 page |
| `back_home` | The link under that line |
| `pagination_nav` | The name of the pager under a paginated article list, for a screen reader |
| `newer` | The pager link to the newer page |
| `older` | The pager link to the older page |
| `article_nav` | The name of the nav to the articles on each side, for a screen reader |
| `newer_article` | The label over the link to the newer article |
| `older_article` | The label over the link to the older article |

### Justified text

[justif](https://github.com/lyallcooper/justif) justifies the paragraphs of an
article and of an item page the way TeX does, breaking a whole paragraph at
once.

```toml
[extra.justif]
enabled = true
```

It covers `.article .prose p` and `.item .prose p`, takes the hyphenation
dictionary from the `lang` of `<html>`, and loads justif 0.9.1 from jsDelivr
with its integrity hash. A site that serves its own copy writes `src`, and
`integrity` or an empty string.

The tag blocks the first paint, so no line re-flows.

### Code blocks

```toml
[markdown.highlighting]
theme = "catppuccin-mocha"
style = "class"
```

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

[markdown.highlighting]
theme = "catppuccin-mocha"
style = "class"

[languages.fr]
title = "Floréal"
description = "Ce que la maison fabrique."
taxonomies = [
  { name = "tags" },
  { name = "categories" },
]

[extra]
favicon = "img/favicon.png"
logo = "img/logo.svg"
default_backdrop = "mountains"

[extra.justif]
enabled = true

[extra.labels.en]
about = "About"
blog = "Blog"
tags = "Tags"
categories = "Categories"
mountains = "Mountains"
path = "Path"

[extra.labels.fr]
about = "À propos"
blog = "Journal"
tags = "Étiquettes"
categories = "Catégories"
mountains = "Montagnes"
path = "Chemin"

[extra.backdrop_credits.en]
mountains = "Photo by <a href=\"https://example.com\">Someone</a>"
path = "Photo by <a href=\"https://example.com\">Someone Else</a>"

[extra.backdrop_credits.fr]
mountains = "Photo de <a href=\"https://example.com\">Quelqu'un</a>"
path = "Photo de <a href=\"https://example.com\">Quelqu'un d'autre</a>"

[extra.strings.fr]
home_label = "Accueil"
skip_to_content = "Aller au contenu"
breadcrumb_nav = "Fil d'Ariane"
language_nav = "Langue"
background_nav = "Arrière-plan"
nav_label = "Pages"
friends = "Nous accompagnons"
not_found = "Cette page n'est pas ici."
back_home = "Retour à la façade"
pagination_nav = "Pages d'articles"
newer = "Plus récents"
older = "Plus anciens"
article_nav = "Autres articles"
newer_article = "Plus récent"
older_article = "Plus ancien"

[[extra.friends]]
name = "A House We Keep Company With"
url = "https://example.com"

[[extra.nav]]
path = "about/"

[[extra.nav]]
path = "blog/"

[[extra.backdrops]]
id = "mountains"
width = 2560
height = 1707

[extra.backdrops.palette]
ink = "#f4f1ea"
accent = "#c87a4b"
scrim = "rgba(20, 18, 16, 0.45)"

[[extra.backdrops]]
id = "path"
width = 2560
height = 1707
```

## Layout

| Path | What it holds |
| --- | --- |
| `config.toml` | The site settings, `theme = "floreal"`, the names the site coins, the friends list and the backdrop list. See "Configuration" |
| `content/_index.md` | The landing page: `extra.tagline` and `extra.hero`. See "The landing page" |
| `content/about.md` | A standalone page, reached from the header bar. See "Adding a standalone page" |
| `content/items/` | One file per item, per language, and the section that lists them. The name of the section is the site's own: `products/`, `work/`, anything |
| `content/blog/` | One file per article, per language, and the section that lists and paginates them |
| `themes/floreal/` | The theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js`, `static/icons/coreui/` |
| `static/` | The files of the site: the backdrop images, the licenses, `CNAME` |

Files that end in `.fr.md` are the French versions. `content/_index.md` serves
`/`, and `content/_index.fr.md` serves `/fr/`.

This is the layout that a site with the theme writes. The `config.toml` file
and `content/` directory of this repository are the demo site.

Each template reads what its content carries:

- A section shows article rows if its pages have dates, and cards if they do
  not. `extra.layout` in its front matter sets this directly.
- A page with a date is an article. It shows the date, its terms, and the
  article on each side.
- A page with `extra.what` is an item. A page with neither is standalone.

Every page also does this:

- The buttons of the landing card lead where the front matter sends them.
- The title of an item card links to the page of that item.
- Every page except the landing page and the 404 page carries breadcrumbs.
- The language nav switches to the same page in the other language. For an
  untranslated page it switches to the landing page of that language.
- The language nav is a drop-down of the same shape as the backdrop switcher.
  The template writes it closed.
- A reader with no script gets the same links as a plain row.

## The parts a page is built from

The components in `components.html`:

| Component | What it shows |
| --- | --- |
| `floreal.t` | One theme string |
| `floreal.label` | One name that the site coins |
| `floreal.card` | One page as a card |
| `floreal.article_row` | One article in a list |
| `floreal.pills` | The terms of one page |
| `floreal.actions`, `floreal.btn`, `floreal.href` | The buttons, and where they lead |
| `floreal.shot_url`, `floreal.srcset`, `floreal.fallback` | The URLs of one backdrop. `floreal.shot_url` names one file, and the other two are built on it |
| `floreal.lang_url`, `floreal.lang_label` | One page and one language in the nav |
| `floreal.nav_key`, `floreal.nav_url` | The label key and the target of one header nav entry |
| `floreal.feed_links` | The feeds of one thing |
| `floreal.icon` | One glyph of the CoreUI free or brand set. See "Adding an icon" |
| `floreal.tooltip` | One word with a note above it. See "Adding a tooltip" |

A component is called as a tag, such as `{{ <floreal.t key="not_found" /> }}`.
Write any value other than a plain string in braces, as in `page={article}`.

A component sees only what it gets. A parameter written `@name` is implicit,
and Tera reads it from the calling template.

Thus `config`, `lang`, the date format and the taxonomy lists do not appear at
every call.

`article_list.html` and `pager.html` are includes, not components, because
they read `paginator`. Each one lists what it expects at the top.

`themes/floreal/sass/floreal.scss` lists the stylesheet parts, in cascade
order:

## Add something to every page

```html
{#- templates/extend/head.html -#}
<link rel="stylesheet" href="{{ get_url(path="site.css", cachebust=true) | safe }}">
```

## Adding a background

1. Put `<id>-1000`, `<id>-1600` and `<id>-2560`, as `.jpg` and `.webp`, in
   `static/img/`.
2. Add an `[[extra.backdrops]]` block with `id`, `width` and `height`. A
   backdrop that obeys step 1 needs no `base` and no `widths`.
3. Name it under `[extra.labels.<lang>]` for the button label, and under
   `[extra.backdrop_credits.<lang>]` for the footer line, in each language.
   Both are optional. With no label the button shows the id. With no line the
   backdrop gets no credit.
4. Add `[extra.backdrops.palette]` in the same block, with any of these keys:
   `ink`, `ink-dim`, `line`, `tint`, `card`, `card-solid`, `accent`,
   `sand`, `sand-lift`, `on-sand`, `bg`, `color-scheme`, `focus-pos`, `scrim`,
   `text-glow`, `title-glow`, `panel-shadow`, `focus-ring`, `measure`,
   `backdrop-blur`, `radius`, `line-lift`, `mono`.
   Each key becomes a CSS variable for that backdrop. With no palette, the
   theme uses the default in `themes/floreal/sass/_tokens.scss`.
   The following keys are derived:
   * `line`, `tint`, `line-lift` from `ink`;
   * `card-solid` from `card`;
   * `sand-lift`, `on-sand` from `sand`.

A bright image needs its own `scrim`, `text-glow`, `title-glow` and
`panel-shadow`. `text-glow` and `title-glow` are the shadows that hold the
words off the image. With dark ink, it also needs `color-scheme = "light"`.

`extra.default_backdrop` names the backdrop that the built page ships with.
A site that names none ships the first backdrop of the list.

## Adding an icon

The theme ships two sets of [CoreUI Icons](https://coreui.io/icons/), under
`themes/floreal/static/icons/coreui/`:

| Sprite | Prefix | What it holds |
| --- | --- | --- |
| `free.svg` | `cil-` | The free set: interface glyphs |
| `brand.svg` | `cib-` | The brand set: logos of products and projects |

Write the id in a page or in a template. The prefix selects the sprite:

```
{{ <floreal.icon name="cil-user" /> }}
{{ <floreal.icon name="cib-haskell" /> }}
```

`scripts/update-coreui-icons.sh` fetches both sprites from the `@coreui/icons`
package, with its LICENSE and version.

`[extra.icons]` sets `mode`, which selects how the glyph reaches the page:

| Mode | What it does |
| --- | --- |
| `inline` | The default. The theme cuts the symbol out of the sprite and writes it into the page. |
| `sprite` | The theme writes a `<use>` that points into the sprite file. |

The glyphs are CC BY 4.0.

## Adding a tooltip

`floreal.tooltip` draws a word with a note above it. The note shows when the
pointer is over the word, or when the word has the keyboard focus.

The word is the body of the tag. `text` is the note, and stands as written:

```
{% <floreal.tooltip text="A static site generator, written in Rust."> %}Zola{% </floreal.tooltip> %}
```
