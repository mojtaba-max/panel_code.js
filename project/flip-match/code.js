const arr = [
    "img/01.png", "img/01.png",
    "img/02.png", "img/02.png",
    "img/03.png", "img/03.png",
    "img/04.png", "img/04.png",
    "img/05.png", "img/05.png",
    "img/06.png", "img/06.png",
];


arr.sort(() => Math.random() - 0.5);

const image = document.getElementsByClassName("back");

for (let i = 0; i < image.length; i++) {
    image[i].src = arr[i];

}


let card1 = null;
let card2 = null;

let stop = false;
let win = 0;


function run(x) {

    if (stop === true || x === card1) {
        return;
    }

    x.classList.add("flip");

    if (card1 === null) {
        card1 = x;

    } else if (card2 === null) {
        card2 = x;
        stop = true;

        let pic1 = card1.querySelector(".back");
        let pic2 = card2.querySelector(".back");

        if (pic1.src === pic2.src) {

            card1.disabled = true;
            card2.disabled = true;

            win += 1;
            card1 = null;
            card2 = null;
            stop = false;



            if (win === 6) {
                setTimeout(function () {
                    document.getElementById("win").style.display = "flex";
                }, 700);
            }

        } else {
            setTimeout(function () {
                card1.classList.remove("flip");
                card2.classList.remove("flip");
                card1 = null;
                card2 = null;
                stop = false;
            },1000)
        }

    }


}
