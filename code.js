let mv = document.getElementById("mv");
const a = document.getElementsByClassName('card');
mv.innerText = a.length;

let md = document.getElementById("md");
const b = document.getElementsByClassName('h3');
md.innerText = b[b.length-1].innerText;