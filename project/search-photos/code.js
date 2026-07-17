let search = document.querySelector('.search');
let x1 = document.getElementById('x1');
let x2 = document.getElementById('x2');
let h0 = document.getElementById('h0');
let b0 = document.getElementById('b0');

function f1() {
    if (search.value === 'nexo' || search.value === '1') {
        x1.style.visibility = 'visible';
        x2.src = 'img/01.png';
        h0.style.color = '#CE8BFD';
        h0.innerText = '1. Nexo';
        b0.style.background = '#CE8BFD';

    } else if (search.value === 'bloop' || search.value === '2') {
        x1.style.visibility = 'visible';
        x2.src = 'img/02.png';
        h0.style.color = '#F8FAFB';
        h0.innerText = '2. Bloop';
        b0.style.background = '#F8FAFB';


    } else if (search.value === 'moki' || search.value === '3') {
        x1.style.visibility = 'visible';
        x2.src = 'img/03.png';
        h0.style.color = '#08F6BF';
        h0.innerText = '3. Moki';
        b0.style.background = '#08F6BF';

    }else if (search.value === 'byte' || search.value === '4') {
        x1.style.visibility = 'visible';
        x2.src = 'img/04.png';
        h0.style.color = '#C48C97';
        h0.innerText = '4. Byte';
        b0.style.background = '#C48C97';

    }else if (search.value === 'five' || search.value === '5') {
        x1.style.visibility = 'visible';
        x2.src = 'img/05.png';
        h0.style.color = '#DFE6EC';
        h0.innerText = '5. Qubi';
        b0.style.background = '#DFE6EC';

    }else if (search.value === 'six' || search.value === '6') {
        x1.style.visibility = 'visible';
        x2.src = 'img/06.png';
        h0.style.color = '#FF9900';
        h0.innerText = '6. Pixo';
        b0.style.background = '#FF9900';

    }else if (search.value === 'seven' || search.value === '7') {
        x1.style.visibility = 'visible';
        x2.src = 'img/07.png';
        h0.style.color = '#65AD00';
        h0.innerText = '7. Nova';
        b0.style.background = '#65AD00';

    }else if (search.value === 'eight' || search.value === '8') {
        x1.style.visibility = 'visible';
        x2.src = 'img/08.png';
        h0.style.color = '#CD5C84';
        h0.innerText = '8. Rovi';
        b0.style.background = '#CD5C84';

    } else if (parseInt(search.value) >= 9)  {
        document.getElementById('rr').style.visibility = 'visible';
    }

}


function f2() {
    x1.style.visibility = 'hidden';
    document.getElementById('rr').style.visibility = 'hidden';
}