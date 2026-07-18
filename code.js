const cards = document.getElementsByClassName('card');

let search = document.getElementById('search');
let empty = document.getElementById('empty');

let activeIndex = -1;
let navOn = false;
let lastMouseX = null;
let lastMouseY = null;

function getVisibleCards() {
    let list = [];

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].style.display !== 'none') {
            list.push(cards[i]);
        }
    }

    return list;
}

function clearActive() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('is-active');
    }

    activeIndex = -1;
}

function turnOffNav() {
    if (!navOn) {
        return;
    }

    navOn = false;
    clearActive();
}

function setActive(index) {
    let visible = getVisibleCards();

    clearActive();

    if (visible.length === 0) {
        navOn = false;
        return;
    }

    if (index < 0) {
        index = visible.length - 1;
    } else if (index >= visible.length) {
        index = 0;
    }

    activeIndex = index;
    navOn = true;
    visible[activeIndex].classList.add('is-active');
    visible[activeIndex].scrollIntoView({ block: 'nearest', behavior: 'auto' });
}

function openActive() {
    let visible = getVisibleCards();

    if (!navOn || activeIndex < 0 || activeIndex >= visible.length) {
        return;
    }

    window.location.href = visible[activeIndex].href;
}

search.addEventListener('input', function () {
    let q = search.value.trim().toLowerCase();
    let visible = 0;

    for (let i = 0; i < cards.length; i++) {
        let text = cards[i].innerText.toLowerCase() + ' ' + (cards[i].getAttribute('data-tags') || '');

        if (text.includes(q)) {
            cards[i].style.display = '';
            visible++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    empty.style.display = visible === 0 ? 'block' : 'none';
    turnOffNav();
});

document.addEventListener('mousemove', function (e) {
    if (lastMouseX === null || lastMouseY === null) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        return;
    }

    let moved = e.clientX !== lastMouseX || e.clientY !== lastMouseY;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // scrollIntoView can fire mousemove with the same cursor position
    if (!moved) {
        return;
    }

    turnOffNav();
});

document.addEventListener('mousedown', turnOffNav);
document.addEventListener('touchstart', turnOffNav, { passive: true });
document.addEventListener('wheel', turnOffNav, { passive: true });

document.addEventListener('keydown', function (e) {
    if (e.code === 'Slash' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        let tag = e.target.tagName;

        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        e.preventDefault();
        turnOffNav();
        search.focus();
        search.select();
        return;
    }

    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
        return;
    }

    let visible = getVisibleCards();

    if (visible.length === 0) {
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();

        if (!navOn) {
            setActive(0);
        } else {
            setActive(activeIndex + 1);
        }

        return;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();

        if (!navOn) {
            setActive(visible.length - 1);
        } else {
            setActive(activeIndex - 1);
        }

        return;
    }

    if (e.key === 'Enter') {
        if (!navOn) {
            return;
        }

        e.preventDefault();
        openActive();
    }
});
