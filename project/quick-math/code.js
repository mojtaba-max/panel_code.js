let h1 = document.getElementById("h1");

let n = "";

function solve(val) {

    let x = val.innerText;

    if (x === "C") {

        n = "";
        h1.innerText = "";
        return;


    } else if (x === "=") {
        n = eval(n) + "";
        h1.innerText = n;
        return;

    }

    n += x;
    h1.innerText = n;
}
