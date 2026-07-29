/**
 * Pilot — keyboard command bar
 * Public API: Pilot.mount({ commands, suggest?, root?, input?, menu? })
 */
(function (global) {
  "use strict";

  const commands = [];
  let ui = { root: null, input: null, menu: null };
  let suggestFn = null;
  let locked = null;
  let active = false;
  let menuItems = [];
  let menuIndex = 0;

  const Pilot = {
    mount(options) {
      options = options || {};

      ui.root = options.root || document.getElementById("pilot");
      ui.input = options.input || document.getElementById("pilot-input");
      ui.menu = options.menu || document.getElementById("pilot-menu");
      suggestFn = typeof options.suggest === "function" ? options.suggest : null;

      bindCommands(options.commands || []);

      ui.input.addEventListener("input", onInput);
      ui.input.addEventListener("keydown", onKeyDown);
      ui.input.addEventListener("blur", onBlur);
      document.addEventListener("keydown", onGlobalKeyDown);

      if (ui.menu) {
        ui.menu.addEventListener("mousedown", onMenuMouseDown);
      }

      setActive(false);
    },
  };

  function bindCommands(list) {
    commands.length = 0;

    list.forEach(function (item) {
      if (typeof item.run !== "function") {
        console.warn("[Pilot] command needs a run function");
        return;
      }

      const names = normalizeNames(item);
      if (!names.length) {
        console.warn("[Pilot] command needs a non-empty names array");
        return;
      }

      commands.push({
        names: names,
        args: item.args || 0,
        run: item.run,
      });
    });
  }

  function normalizeNames(item) {
    if (Array.isArray(item.names) && item.names.length) {
      return item.names.map(function (n) {
        return String(n).toLowerCase();
      });
    }
    return [];
  }

  function onInput() {
    const text = ui.input.value;

    if (locked) {
      const ok = locked.names.some(function (n) {
        return text === n || text.startsWith(n + " ");
      });
      if (!ok) locked = null;
    }

    if (!text.trim()) locked = null;
    menuIndex = 0;
    render();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      if (!menuItems.length) return;
      e.preventDefault();
      moveMenu(1);
    } else if (e.key === "ArrowUp") {
      if (!menuItems.length) return;
      e.preventDefault();
      moveMenu(-1);
    } else if (e.key === " ") {
      if (!locked && tryLockExactToken()) {
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (ui.input.value || locked) {
        reset();
      } else {
        setActive(false);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  }

  function onMenuMouseDown(e) {
    const item = e.target.closest(".pilot-menu-item");
    if (!item) return;
    e.preventDefault();
    menuIndex = Number(item.getAttribute("data-index")) || 0;
    acceptMenuItem();
    ui.input.focus();
  }

  function onBlur() {
    setTimeout(function () {
      if (!active) return;
      if (ui.root && ui.root.contains(document.activeElement)) return;
      setActive(false);
    }, 0);
  }

  function onGlobalKeyDown(e) {
    if (e.key !== "Tab") return;
    if (window.matchMedia("(max-width: 640px)").matches) return;

    e.preventDefault();
    setActive(!active);
  }

  function setActive(next) {
    active = !!next;

    if (ui.root) {
      ui.root.classList.toggle("is-active", active);
      ui.root.setAttribute("data-active", active ? "true" : "false");
    }

    if (active) {
      if (document.activeElement !== ui.input) {
        reset();
      }
      ui.input.focus();
    } else {
      reset();
      ui.input.blur();
    }

    render();
  }

  function tryLockExactToken() {
    if (ui.input.value.indexOf(" ") !== -1) return false;

    const token = ui.input.value.trim().toLowerCase();
    const match = exactVerb(token);
    if (!match) return false;

    lockMatch(match);
    return true;
  }

  function exactVerb(token) {
    if (!token) return null;
    const t = token.toLowerCase();

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      if (cmd.names.indexOf(t) !== -1) {
        return { cmd: cmd, word: t };
      }
    }
    return null;
  }

  function lockMatch(match) {
    locked = {
      names: match.cmd.names,
      args: match.cmd.args,
      run: match.cmd.run,
      word: match.word,
    };
    ui.input.value = match.word + (match.cmd.args > 0 ? " " : "");
    menuIndex = 0;
    render();
  }

  function handleEnter() {
    if (menuItems.length && acceptMenuItem()) {
      if (locked && locked.args === 0) {
        execute();
      } else if (locked && split(ui.input.value).slice(1).length >= locked.args) {
        execute();
      }
      return;
    }

    if (!locked) {
      const match = bestVerb(ui.input.value.trim());
      if (!match) return;
      lockMatch(match);
      if (locked.args === 0) execute();
      return;
    }

    execute();
  }

  function getMenuItems() {
    if (!active) return [];

    if (!locked) {
      const token = ui.input.value.trim().toLowerCase();
      if (!token) return [];

      const items = [];
      const seen = {};

      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];

        for (let j = 0; j < cmd.names.length; j++) {
          const word = cmd.names[j];
          if (seen[word]) continue;
          if (!word.startsWith(token)) continue;
          seen[word] = true;
          items.push({ kind: "verb", label: word, word: word, cmd: cmd });
        }
      }

      items.sort(function (a, b) {
        return a.label.length - b.label.length || a.label.localeCompare(b.label);
      });
      return items;
    }

    if (locked.args === 0) return [];

    const raw = ui.input.value;
    const parts = split(raw);
    const args = parts.slice(1);
    const slot = raw.endsWith(" ") ? args.length : Math.max(0, args.length - 1);
    if (slot >= locked.args) return [];

    const partial = raw.endsWith(" ") ? "" : args[args.length - 1] || "";
    const options = askArgs(locked.names[0], partial, args);

    return options
      .filter(function (option) {
        return option.toLowerCase().startsWith(partial.toLowerCase());
      })
      .map(function (option) {
        return { kind: "arg", label: option, value: option };
      });
  }

  function moveMenu(delta) {
    if (!menuItems.length) return;
    menuIndex = (menuIndex + delta + menuItems.length) % menuItems.length;
    renderMenu();
  }

  function acceptMenuItem() {
    if (!menuItems.length) return false;
    if (menuIndex < 0 || menuIndex >= menuItems.length) menuIndex = 0;

    const item = menuItems[menuIndex];
    if (!item) return false;

    if (item.kind === "verb") {
      lockMatch({ cmd: item.cmd, word: item.word });
      return true;
    }

    acceptArg(item.value);
    return true;
  }

  function acceptArg(value) {
    const raw = ui.input.value;
    const parts = split(raw);

    if (!parts.length) return;

    if (raw.endsWith(" ") || parts.length === 1) {
      ui.input.value = parts[0] + " " + value;
    } else {
      parts[parts.length - 1] = value;
      ui.input.value = parts.join(" ");
    }

    ui.input.setSelectionRange(ui.input.value.length, ui.input.value.length);
    menuIndex = 0;
    render();
  }

  function bestVerb(token) {
    if (!token) return null;
    const t = token.toLowerCase();

    const exact = exactVerb(t);
    if (exact) return exact;

    let best = null;
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      for (let j = 0; j < cmd.names.length; j++) {
        const word = cmd.names[j];
        if (!word.startsWith(t)) continue;
        if (!best || word.length < best.word.length) {
          best = { cmd: cmd, word: word };
        }
      }
    }
    return best;
  }

  function execute() {
    if (!locked) return;
    const args = split(ui.input.value).slice(1);
    if (args.length < locked.args) return;

    try {
      locked.run(args);
    } catch (_) {
      /* ignore */
    }
    reset();
  }

  function reset() {
    ui.input.value = "";
    locked = null;
    menuIndex = 0;
    render();
  }

  function render() {
    menuItems = getMenuItems();
    if (menuIndex >= menuItems.length) menuIndex = Math.max(0, menuItems.length - 1);
    if (menuIndex < 0) menuIndex = 0;
    renderMenu();
  }

  function renderMenu() {
    if (!ui.menu) return;

    if (!menuItems.length) {
      ui.menu.innerHTML = "";
      ui.menu.classList.remove("is-open");
      ui.menu.hidden = true;
      return;
    }

    ui.menu.hidden = false;
    ui.menu.classList.add("is-open");
    ui.menu.innerHTML = menuItems
      .map(function (item, index) {
        const activeClass = index === menuIndex ? " is-active" : "";
        return (
          '<div class="pilot-menu-item' +
          activeClass +
          '" role="option" data-index="' +
          index +
          '" aria-selected="' +
          (index === menuIndex ? "true" : "false") +
          '">' +
          esc(item.label) +
          "</div>"
        );
      })
      .join("");

    const activeItem = ui.menu.querySelector(".pilot-menu-item.is-active");
    if (activeItem && activeItem.scrollIntoView) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }

  function askArgs(name, partial, allArgs) {
    if (!suggestFn) return [];
    try {
      return suggestFn(name, partial, allArgs) || [];
    } catch (_) {
      return [];
    }
  }

  function split(text) {
    return text.trim().split(/\s+/).filter(Boolean);
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  global.Pilot = Pilot;
})(window);
