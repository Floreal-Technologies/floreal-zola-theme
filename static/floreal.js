/* The two drop-downs in the header.
   Both ship from the template whole and closed, so nothing here builds mark-up
   or moves anything: the reader never sees the header change shape. The
   stylesheet lays the language panel back out as a plain row when no script is
   running, and hides the switcher, which has nothing to switch without one.
   The backdrop switcher swaps the photo, follows [data-theme] on <html> (set in
   the page head, before paint), and remembers the choice.
   Both are opened and closed by the one piece of code below. */
(function () {
  "use strict";

  /* The same key as the pre-paint script in base.html. */
  var KEY = "floreal-theme";

  var root = document.documentElement;

  /* The entry a panel opens on: the backdrop that is on, or the language the
     reader is reading. The two navs mark it in their own way, a radio group in
     one and a link in the other. */
  function marked(item) {
    return item.getAttribute("aria-checked") === "true" ||
           item.getAttribute("aria-current") === "true";
  }

  /* What a trigger and its panel do, whatever the panel holds: the trigger
     opens and closes it, and Escape, a press outside, or the focus leaving
     close it. The arrow keys walk the panel's entries, in a ring. */
  function dropdown(nav) {
    var toggle = nav.querySelector(".menu-toggle");
    var menu = nav.querySelector("ul");
    var items = Array.prototype.slice.call(menu.querySelectorAll("a, button"));

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function setOpen(yes) {
      /* Nothing inside the panel may keep the focus once the panel is hidden. */
      if (!yes && menu.contains(document.activeElement)) toggle.focus();
      toggle.setAttribute("aria-expanded", String(yes));
      menu.hidden = !yes;
      if (yes) {
        document.addEventListener("pointerdown", outside);
        (items.filter(marked)[0] || items[0]).focus();
      } else {
        document.removeEventListener("pointerdown", outside);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      if (!isOpen()) {
        setOpen(true);
        return;
      }
      var down = event.key === "ArrowDown";
      var here = items.indexOf(document.activeElement);
      /* From outside the list — a browser that would not take the focus — each key
         enters it from its own end. */
      if (here === -1) {
        items[down ? 0 : items.length - 1].focus();
        return;
      }
      items[(here + (down ? 1 : items.length - 1)) % items.length].focus();
    });

    /* A press elsewhere closes the menu, on the press and not on the release,
       which is how the menus of the desktop behave. The page is listened to
       only while the panel is open: a closed menu costs a reader nothing. */
    function outside(event) {
      if (!nav.contains(event.target)) setOpen(false);
    }

    /* And so does the focus leaving by the keyboard. A null relatedTarget is a
       press on something that cannot hold the focus, or the window losing it:
       the handler above has the first, and the second must not close anything.
       Safari and Firefox on macOS do not focus a button that is pressed, so
       acting on a null relatedTarget here would close the menu a moment before
       the click on the trigger opened it again. */
    nav.addEventListener("focusout", function (event) {
      if (isOpen() && event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false);
    });

    return { toggle: toggle, menu: menu, items: items, setOpen: setOpen };
  }

  function backdrops() {
    var nav = document.querySelector(".themes");
    var backdrop = document.querySelector(".backdrop");
    var picture = backdrop && backdrop.querySelector("picture");
    var data = document.getElementById("backdrops");
    if (!nav || !picture || !data) return;

    var panel = dropdown(nav);
    var label = nav.querySelector(".menu-label");
    var items = panel.items;

    /* The list comes from config.toml, through the template, with every URL
       already resolved against the site's base. */
    var SHOTS = {};
    JSON.parse(data.textContent).forEach(function (shot) {
      SHOTS[shot.id] = shot;
    });

    var source = picture.querySelector("source");
    var img = picture.querySelector("img");
    /* Whichever photo the markup shipped, whatever the stored theme is. */
    var shown = backdrop.dataset.shot;

    function swap(name) {
      var shot = SHOTS[name];
      backdrop.classList.add("swapping");
      source.srcset = shot.webp;
      img.srcset = shot.jpg;
      img.width = shot.width;
      img.height = shot.height;
      img.src = shot.src;
      shown = name;

      var done = function () { backdrop.classList.remove("swapping"); };
      if (img.decode) {
        img.decode().then(done, done);
      } else {
        done();
      }
    }

    function apply(name, remember) {
      if (!SHOTS[name]) return;
      root.dataset.theme = name;
      items.forEach(function (item) {
        var chosen = item.dataset.shot === name;
        item.setAttribute("aria-checked", String(chosen));
        /* The trigger says which backdrop is on, in the language of the page. */
        if (chosen) label.textContent = item.textContent.trim();
      });
      if (shown !== name) swap(name);
      if (remember) {
        try { localStorage.setItem(KEY, name); } catch (e) { /* private mode */ }
      }
    }

    panel.menu.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-shot]");
      if (!button) return;
      apply(button.dataset.shot, true);
      panel.setOpen(false);
      panel.toggle.focus();
    });

    apply(SHOTS[root.dataset.theme] ? root.dataset.theme : shown, false);
  }

  backdrops();

  /* The language nav is a drop-down and nothing more: the template wrote it. */
  var langs = document.querySelector(".langs");
  if (langs) dropdown(langs);
})();
