const cards = document.getElementsByClassName('card');
const titles = document.getElementsByClassName('h3');

let mv = document.getElementById('mv');
mv.innerText = String(cards.length).padStart(2, '0');

let md = document.getElementById('md');
md.innerText = titles[titles.length - 1].innerText;


let search = document.getElementById('search');
let empty = document.getElementById('empty');

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
});
