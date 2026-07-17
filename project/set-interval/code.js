const div = document.getElementsByClassName("d1")

let a=0;
let c = 0;


let bb1 = document.getElementById('b1');
let bb2 = document.getElementById('b2');
let bb3 = document.getElementById('b3');

function cl(n) {console.log(n)}



function f1() {
    div[a].style.backgroundColor = "#39d353";

    a++;
    bb1.style.display = "none";
    bb2.style.display = "inline";

    cl(a +" Run")
    if (a === div.length){
        clearInterval(se)
        clearInterval(ge)
        bb2.style.display = "none";
        bb3.style.display = "inline";

    }

}


function f2() {
    c += 1;
    document.getElementById('p1').innerText = c + 's';
}

function act(n) {
    cl(n+ " -act")
    if (a !== 20) {
        div[n].style.backgroundColor = "#0e4429";
        div[n].style.cursor = "revert";
    } else if (a === 20) {
        div[n].style.backgroundColor = "#d29922";

    }


}


let se;
let ge;

function set() {
    se = setInterval(f1, 300)
    ge = setInterval(f2, 1000)
}


function clr() {
    clearInterval(se)
    clearInterval(ge)
    bb1.style.display = "inline";
    bb2.style.display = "none";
    cl("Stop")

}

function rst() {
    for (let i = 0; i < div.length; i++) {
        div[i].style.background = "#21262d";
        div[i].style.cursor = "pointer";
    }

    cl("Rest")

    a = 0;
    c = 0;
    document.getElementById('p1').innerText = c + 's';
    bb3.style.display = "none";
    bb2.style.display = "none";
    bb1.style.display = "inline";
}