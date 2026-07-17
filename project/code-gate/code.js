let i1 = document.getElementById('i1');
let h1 = document.getElementById('h1');
let b1 = document.getElementById('b1');


let ls = '1234567890wcvefthxjkzm';
let q= '';

for (let i = 0; i < 5; i++) {
    q += ls[rand(0,ls.length-1)];
}



h1.innerText = q;

let w = 0;

function f1() {
    if (i1.value.length === 5) {
        if (i1.value.toLowerCase() === q.toLowerCase()) {
            console.log(i1.value, "yes");
            b1.style.backgroundColor = "#3AD353";
            i1.style.borderColor = "#3AD353";

        } else {
            console.log(i1.value, "no");
            b1.style.backgroundColor = "#D29922";
            i1.style.borderColor = "#D29922";
            w++;
            if (w === 3) {
                b1.style.backgroundColor = "#ff0000";
                i1.style.borderColor = "#ff0000";
                window.alert("Wrong Code.");

            }
        }
    }

}







function rand(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}