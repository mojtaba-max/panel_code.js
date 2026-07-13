let a = 5;

document.getElementById('b2').style.display = 'none';


function s() {
    a += 1;
    document.getElementById('d1').style.width = a + 'px';

    document.getElementById('b1').style.display = 'none';
    document.getElementById('b2').style.display = 'inline';

    document.getElementById('d1').style.backgroundColor = 'rgb(0, 141, 255)';

    document.getElementById('p1').innerText = a/5;

    console.log('Run '+a);
    if (a >= 500) {
        clearInterval(se)
        document.getElementById('d1').style.backgroundColor = 'rgb(86,165,95)';
        document.getElementById('p1').style.color = 'rgb(86,165,95)';
        document.getElementById('b1').style.display = 'inline';
        document.getElementById('b2').style.display = 'none';
        console.log("End");
    }

}

function re(){
    a = 5;
    document.getElementById('d1').style.width = a + 'px';
    document.getElementById('d1').style.backgroundColor = 'rgb(0, 141, 255)';
    document.getElementById('p1').innerText = "00";
    document.getElementById('p1').style.color = 'rgb(25,25,25)';
    document.getElementById('d1').style.backgroundColor = 'rgb(255,0,0)';
    console.log('Rest');
}

let se;

function set(){
    se = setInterval(s, 30)
}

function cl(){

    document.getElementById('b1').style.display = 'inline';
    document.getElementById('b2').style.display = 'none';
    document.getElementById('d1').style.backgroundColor = 'rgba(0,141,255,0.4)';

    clearInterval(se)
}
