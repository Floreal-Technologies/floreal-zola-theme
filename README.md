# Floréal Zola Theme

![The landing page in two of the theme's backdrops, Mountains and Path, split by a diagonal](flor%C3%A9al-showcase.png)

Two backdrops, one page. Each palette recolors the text, the card and the
buttons. `make-showcase.sh` builds this image from the two screenshots.

## Installing

The theme needs Zola 0.23.0 or later. The templates use Tera 2, which came with
Zola 0.23. They do not run on Zola 0.22.

1. Add the theme as a submodule:

   ```sh
   git submodule add https://github.com/Floreal-Technologies/floreal-zola-theme themes/floreal
   ```

2. Set `theme = "floreal"` in `config.toml`.

That is all. Every key the theme reads has a default in `theme.toml`, and the
theme strings ship in English.

A site with no `[extra]` table builds and reads correctly. The rest of this
document gives what a site can change.

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
| `nav` | list of tables | The pages linked from the header, beside the language nav. An empty list gives no nav |
| `labels` | table of tables | The name of a thing, per language, under `[extra.labels.<lang>]`. One table names a nav entry by its path, a taxonomy by its name, and a backdrop by its id |
| `backdrop_credits` | table of tables | The credit line for one photographer, under `[extra.backdrop_credits.<lang>]`, one entry per backdrop id. HTML stands as written. A backdrop with no line gets no credit |
| `strings` | table of tables | The theme strings, per language, under `[extra.strings.<lang>]`. English ships with the theme. A site names only what it translates |
| `language_labels` | table | The name of a language in the nav, keyed by code. A language named nowhere here shows its code in capitals |
| `language_order` | list of strings | The order of the language nav. Unset, the language of the site comes first and the rest follow in alphabetical order |
| `date_format` | string | The format of a date on the page, in the syntax of the Zola `date` filter |
| `meta_taxonomy` | string | The taxonomy shown beside the date of an article. The default is `categories`. Every other taxonomy shows as terms under the article |
| `justif` | table | Justified article paragraphs, broken by [justif](https://github.com/lyallcooper/justif). Off by default. See "Justified text" |

### A backdrop

`[[extra.backdrops]]` holds these fields:

| Key | What it is |
| --- | --- |
| `id` | The name of the backdrop. It is used in `data-theme`, in the two tables that name it, and in the stored choice |
| `width`, `height` | The intrinsic size of the image. It keeps the page from moving as the image loads |
| `base` | Optional. The path of the files under `static/`, with no leading slash, up to the width. The default is `img/<id>-` |
| `widths` | Optional. The widths that exist, smallest first. The default is `[1000, 1600, 2560]`, which the recipe under "Adding a background" makes. A browser with no `srcset` support gets the largest width |
| `palette` | Optional. See "Adding a background" |

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

Unset, the language of the site comes first and the rest follow in
alphabetical order. A site with one language gets no language nav.

Every page carries `dir` on `<html>`, from the Zola `text_direction()`
function. A right-to-left language reads correctly without more configuration.

### A friend

`[[extra.friends]]` holds `name` and `url`.

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
article and of a product page the way TeX does, breaking a whole paragraph at
once.

```toml
[extra.justif]
enabled = true
```

It covers `.article .prose p` and `.product .prose p`, takes the hyphenation
dictionary from the `lang` of `<html>`, and loads justif 0.9.1 from jsDelivr
with its integrity hash. A site that serves its own copy writes `src`, and
`integrity` or an empty string.

The tag blocks the first paint, so no line re-flows.

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
| `content/products/` | One file per product, per language, and the section that lists them |
| `content/blog/` | One file per article, per language, and the section that lists and paginates them |
| `themes/floreal/` | The theme: `theme.toml`, `templates/`, `sass/`, `static/floreal.js`, `static/icons/` |
| `static/` | The files of the site: the backdrop images, the licenses, `CNAME` |

Files that end in `.fr.md` are the French versions. `content/_index.md` serves
`/`, and `content/_index.fr.md` serves `/fr/`.

This is the layout that a site with the theme writes. The `config.toml` file
and `content/` directory of this repository are the demo site.

## Pages

| URL | Template | What it is |
| --- | --- | --- |
| `/`, `/fr/` | `index.html` | The landing page: the tagline, and one card with the punchline and the links |
| `/products/`, `/fr/products/` | `section.html` | Every product, as cards |
| `/products/<name>/` | `page.html` | One product, with its full text |
| `/blog/`, `/fr/blog/` | `section.html` | The first page of the article list |
| `/blog/page/<n>/`, `/fr/blog/page/<n>/` | `section.html` | A later page of the same list |
| `/blog/<article>/` | `page.html` | One article, with its terms and its neighbors |
| `/about/`, `/fr/about/` | `page.html` | A standalone page, written directly under `content/` |
| `/tags/`, `/categories/` | `taxonomy_list.html` | Every term of that taxonomy |
| `/tags/<term>/`, `/categories/<term>/` | `taxonomy_single.html` | The articles under one term |

Zola selects `section.html` and `page.html` when nothing names another
template. A new section therefore looks like the rest, with no front matter.

Each template reads what its content carries:

- A section shows article rows if its pages have dates, and cards if they do
  not. `extra.layout` in its front matter sets this directly.
- A page with a date is an article. It shows the date, its terms, and the
  article on each side.
- A page with `extra.what` is a product. A page with neither is standalone.

Every page also does this:

- The buttons of the landing card lead where the front matter sends them.
- The title of a product card links to the page of that product.
- Every page except the landing page and the 404 page carries breadcrumbs.
- The language nav switches to the same page in the other language. For an
  untranslated page it switches to the landing page of that language.
- The language nav is a drop-down of the same shape as the backdrop switcher.
  The template writes it closed.
- A reader with no script gets the same links as a plain row.

## The parts a page is built from

| File | What it shows |
| --- | --- |
| `base.html` | The head, and what every page shares: the backdrop, the header bar, the breadcrumbs and the footer. It also resolves the title, the description, the crumbs, the language list and the date format, so no other template does |
| `components.html` | The components. See the table that follows |
| `partials/header.html` | The bar across the top: the site name, the pages, the backdrop switcher, the language nav |
| `partials/crumbs.html` | The breadcrumbs |
| `partials/article_list.html` | An article list, and the pager under it |
| `partials/pager.html` | The newer and older links under a list of more than one page |
| `partials/backdrop.html` | The backdrop, and the list that the script switches it from |
| `partials/footer.html` | The friends, and the credit line |

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

Every URL that the templates write is a full URL, from `get_url()`, or from
`get_taxonomy_url()` in `floreal.pills`.

A part is a component. Tera 2 registers every component in `components.html`
itself, so a template names `floreal.<part>` and imports nothing.

The `floreal.` prefix separates them from the components of a site.

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

- `_vars`: The width of the column, the panel of a raised surface, and the box
  of a control. None can be a custom property: a media query cannot read one.
- `_tokens`: The palette of each backdrop.
- `_base`: The page, its links, and its two paragraph styles.
- One file per component: `_header`, `_menu`, `_crumbs`, `_prose`, `_card`,
  `_article`, `_terms`, `_button`, `_footer`, `_media`.

Zola compiles them into one file, `/floreal.css`. The rules of a component stay
in the file of that component.

## The landing page

`/` and `/fr/` show `extra.tagline` from `content/_index.md`.

Under it they show one card: the line that says what the software does, and
the buttons that lead into the site.

The landing page writes both, in each language.

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
| `tagline` | The line under the site name. A landing page without it gets no line |
| `hero.punchline` | The line on the card. A landing page with no `[extra.hero]` gets no card |
| `hero.actions` | The buttons under it, in the order written. The fields are those of a product action: `label`, `url`, `primary`, `where`. A landing page without them gets a card and no buttons |

The `url` of an action reads like the `url` of a product. A full URL stands as
written.

A value such as `@/products/_index.md`, or a path that starts with `/`, is a
page of this site. The theme builds the full URL from it.

Use the `@/` form. Zola resolves it to the address of that page and stops the
build if the file is absent.

The French landing page names its own files, such as `@/blog/_index.fr.md`.

The card shows the actions of a product card. An action with `where = "page"`
is left out, and so is an action that leads to the landing page.

Sections are not cards. The header bar reaches `/products/`, `/blog/`, `/tags/`
and `/categories/` through `[[extra.nav]]`.

## Adding a standalone page

A page written directly under `content/`, such as About or a license note,
belongs to no section and carries no date.

`page.html` shows it as a standalone page.

1. Write `content/about.md` and `content/about.fr.md`, with a `title` and a
   `description`. The body is the page.
2. Add the entry to `[[extra.nav]]` and its word to `[extra.labels.<lang>]`:

   ```toml
   [[extra.nav]]
   path = "about/"

   [extra.labels.en]
   about = "About"

   [extra.labels.fr]
   about = "À propos"
   ```

`[[extra.actions]]` works here as on a product page. It gives a row of buttons
under the text.

The row holds the actions with `where = "page"` and the actions with no
`where`.

The breadcrumbs read Home / this page. A page inside a section names that
section between the two.

## Adding a product

1. If `content/products/_index.md` and `_index.fr.md` do not exist, write them
   first:

   ```toml
   +++
   title = "What we make"
   sort_by = "title"
   +++
   ```

   The pages carry no dates, so the section shows cards. If a product ever
   carries a date, `extra.layout = "cards"` sets this directly.
2. Write `content/products/<name>.md` and `content/products/<name>.fr.md`. Two
   keys are optional:
   - `extra.what`: The label above the title. It also tells `page.html` that
     the page is a product.
   - `[[extra.actions]]`: One entry per button.

   | Key | What it does |
   | --- | --- |
   | `label` | The word on the button |
   | `url` | Where the button leads. A full URL stands as written. A value such as `@/products/<name>.md`, or a path that starts with `/`, is a page of this site, and the theme builds the full URL from it |
   | `primary` | `true` on the one action for the reader to take. One per row at most |
   | `where` | The row of the button: `"card"`, `"page"` or `"both"`. A button with no `where` is in both rows |

   `where` separates the two rows. The card holds the link to the product
   page, and the page holds what the reader does next.

   A button that leads to the page that the reader is on is left out.

   The body is the text of the product page.
3. Put `<!-- more -->` after the first sentences. The page always shows the
   full body.

   The card shows only the text above the marker. With no marker it shows the
   full body.

The product page and its card on `/products/` come from the file alone, and
`/products/` sorts by title.

The landing page shows no product. It shows one card of its own, with a button
that leads here.

## Adding an article

1. If `content/blog/_index.md` and `_index.fr.md` do not exist, write them
   first:

   ```toml
   +++
   title = "Blog"
   sort_by = "date"
   paginate_by = 5
   generate_feeds = true
   +++
   ```

   The pages carry dates, so the section shows article rows.
2. Write `content/blog/<name>.md` and `content/blog/<name>.fr.md`. Give each a
   `date` and a `[taxonomies]` table, such as `tags = ["design"]` and
   `categories = ["notes"]`. The date makes the page an article.
3. Put `<!-- more -->` after the first sentences. The text above it is the row
   on `/blog/`. The article page always shows the full body.

A term needs no declaration other than the `taxonomies` line in `config.toml`.

The first article that names a term gets a page, at `/tags/<term>/` or
`/categories/<term>/`.

`extra.meta_taxonomy` names the taxonomy shown beside the date of an article.
The default is `categories`.

Every other taxonomy shows as terms under the article.

Two front matter keys of Zola are useful here. Neither needs anything from the
theme:

| Key | What it does |
| --- | --- |
| `hidden = true` | Keeps the page out of every list: its section, its term pages and the feeds. Zola still builds the page, and a link to it still works |
| `include_in_feeds = false` | Keeps the page out of the feeds only. The page stays in the lists |

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
   `ink`, `ink-dim`, `line`, `tint`, `card`, `card-solid`, `accent`, `sand`,
   `sand-lift`, `on-sand`, `bg`, `focus-pos`, `scrim`, `text-glow`,
   `title-glow`, `panel-shadow`, `focus-ring`, `measure`, `backdrop-blur`.
   Each key becomes a CSS variable for that backdrop. With no palette, the
   theme uses the default in `themes/floreal/sass/_tokens.scss`.

A credit shows only when its backdrop is active.

A bright image needs the last six keys. `text-glow` and `title-glow` are the
shadows that hold the words off the image.

`backdrop-blur` is how much the theme softens the image on a page that the
reader reads. `backdrop-blur: 0` leaves the image sharp.

`extra.default_backdrop` names the backdrop that the built page ships with.
A site that names none ships the first backdrop of the list.

The browser keeps the choice of the reader under `floreal-theme`. A script in
the page head reads it before the first paint.

An unlisted id is ignored.

## The demo site

The `config.toml` file and `content/` directory at the root of this repository
are the demo site of the theme, not an example.

`themes/floreal` is a link back to the root, so the demo reads the theme as a
real site does: through `theme = "floreal"`, with the `theme.toml` defaults.

Run `zola serve` here to see a change directly. A site with the theme writes
its own `config.toml` and `content/`, and ignores these.
