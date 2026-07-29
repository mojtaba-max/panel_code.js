const ALLOWED_COLORS = new Set(['blue', 'red', 'green', 'amber']);
const UPLOAD_PASSWORD = 'Adm1238';
const UPLOAD_GATE_KEY = 'panel-upload-unlocked';

const list = document.getElementById('projects');
const search = document.getElementById('search');
const empty = document.getElementById('empty');
const cards = document.getElementsByClassName('card');
const pilotInput = document.getElementById('pilot-input');
const pilotLead = document.getElementById('pilot-lead');

const ICON_PROMPT = '<svg class="pilot-soft-tri" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 5.8c0-1 1.1-1.6 1.9-1.1l9 5.7c.8.5.8 1.7 0 2.2l-9 5.7c-.8.5-1.9-.1-1.9-1.1V5.8z"/></svg>';
const ICON_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const ICON_TAG = '<span class="pilot-hash">#</span>';

let projectsData = [];

function applySearch() {
    const q = search.value.trim().toLowerCase();
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const text = cards[i].innerText.toLowerCase() + ' ' + (cards[i].getAttribute('data-tags') || '');

        if (!q || text.includes(q)) {
            cards[i].style.display = '';
            visibleCount++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

function projectSlug(project) {
    const href = project.href || '';
    const match = href.match(/project\/([^/]+)/);
    return match ? match[1].toLowerCase() : '';
}

function projectSuggestKeys(project) {
    const keys = [];
    const slug = projectSlug(project);

    if (slug) {
        keys.push(slug);
        slug.split('-').forEach(function (part) {
            if (part) {
                keys.push(part);
            }
        });
    }

    const title = (project.title || '').toLowerCase().trim();

    if (title) {
        keys.push(title.replace(/\s+/g, '-'));
        title.split(/\s+/).forEach(function (part) {
            if (part) {
                keys.push(part);
            }
        });
    }

    return keys;
}

function findProject(query) {
    const q = (query || '').trim().toLowerCase();

    if (!q) {
        return null;
    }

    let best = null;
    let bestScore = -1;

    for (let i = 0; i < projectsData.length; i++) {
        const project = projectsData[i];
        const slug = projectSlug(project);
        const title = (project.title || '').toLowerCase();
        const tags = Array.isArray(project.tags) ? project.tags.join(' ').toLowerCase() : '';
        const keys = projectSuggestKeys(project);
        let score = -1;

        if (slug === q || title === q || keys.indexOf(q) !== -1) {
            score = 100;
        } else if (slug.startsWith(q) || title.startsWith(q)) {
            score = 80;
        } else if (keys.some(function (key) { return key.startsWith(q); })) {
            score = 60;
        } else if (title.includes(q) || tags.includes(q) || slug.includes(q)) {
            score = 40;
        }

        if (score > bestScore) {
            bestScore = score;
            best = project;
        }
    }

    return bestScore >= 0 ? best : null;
}

function openProject(args) {
    const project = findProject(args[0]);

    if (!project || !project.href) {
        return;
    }

    window.location.href = project.href;
}

function openUpload(args) {
    const password = (args[0] || '').trim();

    if (password !== UPLOAD_PASSWORD) {
        return;
    }

    sessionStorage.setItem(UPLOAD_GATE_KEY, '1');
    window.location.href = 'upload.html';
}

function searchByTag(args) {
    const tag = (args[0] || '').trim().toLowerCase();
    let visibleCount = 0;

    search.value = tag;

    for (let i = 0; i < cards.length; i++) {
        const tags = (cards[i].getAttribute('data-tags') || '').toLowerCase().split(/\s+/).filter(Boolean);

        if (!tag || tags.indexOf(tag) !== -1) {
            cards[i].style.display = '';
            visibleCount++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

function collectTags() {
    const seen = {};
    const results = [];

    for (let i = 0; i < projectsData.length; i++) {
        const tags = projectsData[i].tags;

        if (!Array.isArray(tags)) {
            continue;
        }

        for (let j = 0; j < tags.length; j++) {
            const tag = String(tags[j] || '').trim().toLowerCase();

            if (!tag || tag.indexOf(' ') !== -1 || seen[tag]) {
                continue;
            }

            seen[tag] = true;
            results.push(tag);
        }
    }

    results.sort();
    return results;
}

function isOpenCommandActive() {
    return /^(?:open|go)\s/i.test(pilotInput.value);
}

function isTagCommandActive() {
    return /^(?:tag|tags)\s/i.test(pilotInput.value);
}

function syncPilotIcon() {
    if (!pilotLead) {
        return;
    }

    if (isOpenCommandActive()) {
        pilotLead.innerHTML = ICON_ARROW;
    } else if (isTagCommandActive()) {
        pilotLead.innerHTML = ICON_TAG;
    } else {
        pilotLead.innerHTML = ICON_PROMPT;
    }
}

function suggestCommands(cmd, partial) {
    const p = (partial || '').toLowerCase();

    if (cmd === 'open') {
        const seen = {};
        const results = [];

        for (let i = 0; i < projectsData.length; i++) {
            const keys = projectSuggestKeys(projectsData[i]);

            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];

                if (seen[key]) {
                    continue;
                }

                if (!p || key.indexOf(p) === 0) {
                    seen[key] = true;
                    results.push(key);
                }
            }
        }

        return results;
    }

    if (cmd === 'tag') {
        return collectTags().filter(function (tag) {
            return !p || tag.indexOf(p) === 0;
        });
    }

    return [];
}

function createCard(project) {
    const color = ALLOWED_COLORS.has(project.color) ? project.color : 'blue';
    const tags = Array.isArray(project.tags) ? project.tags.join(' ') : '';

    const card = document.createElement('a');
    card.className = 'card card--' + color;
    card.href = project.href || '#';
    card.setAttribute('data-tags', tags);
    card.setAttribute('tabindex', '-1');
    card.addEventListener('keydown', function (e) {
        e.preventDefault();
    });

    const dd = document.createElement('div');
    dd.className = 'dd';

    const chip = document.createElement('div');
    chip.className = 'chip';

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = project.icon || '';
    chip.appendChild(icon);

    const inf = document.createElement('div');
    inf.className = 'inf';

    const title = document.createElement('h3');
    title.className = 'h3';
    title.textContent = project.title || '';

    const description = document.createElement('p');
    description.textContent = project.description || '';

    inf.appendChild(title);
    inf.appendChild(description);

    dd.appendChild(chip);
    dd.appendChild(inf);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = project.category || '';

    const row = document.createElement('span');
    row.className = 'row';
    row.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

    meta.appendChild(tag);
    meta.appendChild(row);

    card.appendChild(dd);
    card.appendChild(meta);

    return card;
}

function renderProjects(projects) {
    list.innerHTML = '';

    if (!Array.isArray(projects) || projects.length === 0) {
        empty.textContent = 'No projects found.';
        empty.style.display = 'block';
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < projects.length; i++) {
        fragment.appendChild(createCard(projects[i]));
    }

    list.appendChild(fragment);
    empty.textContent = 'No project matches your search.';
    applySearch();
}

async function loadProjects() {
    try {
        const response = await fetch('projects.json', { cache: 'no-cache' });

        if (!response.ok) {
            throw new Error('Failed to load projects.json');
        }

        const projects = await response.json();
        projectsData = Array.isArray(projects) ? projects : [];
        renderProjects(projectsData);
    } catch (error) {
        projectsData = [];
        list.innerHTML = '';
        empty.textContent = 'Could not load projects.';
        empty.style.display = 'block';
        console.error(error);
    }
}

Pilot.mount({
    commands: [
        { names: ['open', 'go'], args: 1, run: openProject },
        { names: ['tag', 'tags'], args: 1, run: searchByTag },
        { names: ['add'], args: 1, run: openUpload },
    ],
    suggest: suggestCommands,
});

syncPilotIcon();

pilotInput.addEventListener('input', syncPilotIcon);
pilotInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setTimeout(syncPilotIcon, 0);
    }
});
pilotInput.addEventListener('blur', function () {
    setTimeout(syncPilotIcon, 0);
});

search.addEventListener('input', applySearch);

loadProjects();
