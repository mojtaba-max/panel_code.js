const dic = [
    {
        name: "america",
        pic: "pic/America.png",
    },
    {
        name: "brazil",
        pic: "pic/Brazil.png",
    },
    {
        name: "canada",
        pic: "pic/Canada.png",
    },
    {
        name: "china",
        pic: "pic/China.png",
    },
    {
        name: "france",
        pic: "pic/France.png",
    },
    {
        name: "italy",
        pic: "pic/Italy.png",
    },
    {
        name: "japan",
        pic: "pic/Japan.png",
    },
    {
        name: "pakistan",
        pic: "pic/Pakistan.png",
    },
    {
        name: "russia",
        pic: "pic/Russia.png",
    },
    {
        name: "turkiye",
        pic: "pic/Turkiye.png",
    },


]

let pic_box = document.getElementById("pic_box");
let heder = document.getElementById("heder");
let box = document.getElementById("box");
let r = rand(0, dic.length-1);

pic_box.style.backgroundImage = `url(${dic[r].pic})`;
let car_name = dic[r].name;

let crc = [];

let wrong = 5;
let ok = false;

for (let i = 0; i < car_name.length; i++) {
    crc.push("-");
}

draw_tiles();

function run(th) {
    let x = th.key.toLowerCase();

    if (x.length !== 1 || x < "a" || x > "z") {
        return;
    }

    ok = false;

    for (let i = 0; i < car_name.length; i++) {

        if (x === car_name[i]) {
            crc[i] = x;
            ok = true;
        }
    }

    if (ok === false) {
        wrong -= 1;
        box.classList.add("shake");
        setTimeout(function () {
            box.classList.remove("shake");
        }, 300);
    }

    let state = "";

    if (wrong <= 0) {
        state = "lose";
        crc = car_name.split("");
        pic_box.style.filter = "none";

    } else if (crc.join("") === car_name) {
        state = "win";
        pic_box.style.filter = "none";
    }

    draw_tiles(state);

}


document.addEventListener("keydown", run);


function draw_tiles(state) {
    heder.innerHTML = "";

    for (let i = 0; i < crc.length; i++) {
        let tile = document.createElement("span");
        tile.className = "tile " + state;

        if (crc[i] !== "-") {
            tile.innerText = crc[i];
        }

        heder.appendChild(tile);
    }
}




function rand(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}