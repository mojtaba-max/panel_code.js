let box = document.getElementById('box');
let viewport = document.getElementById('viewport');
const pic = document.getElementsByClassName('pic');

let btm = document.getElementById('btm');
let box_dot = document.getElementById('box-dot');
const dot = document.getElementsByClassName('dot');

let sec = 5000;
let timer = setInterval(go_po, sec);

for (let i = 0; i < pic.length; i++) {
    const elm = document.createElement('span');
    elm.classList.add('dot');

    elm.onclick = function () {
        num = i;
        run(num);
    };

    pic[i].onclick = function () {
        if (num > i) {
            go_po(-1);
        } else if (num < i) {
            go_po(1);
        }
    };

    box_dot.appendChild(elm);
}

let num = 0;
run(num);

function run(num) {
    let pic_w = pic[0].offsetWidth;
    let pic_gap = parseInt(getComputedStyle(pic[0]).marginRight) || 0;
    let center = (viewport.offsetWidth / 2) - (pic_w / 2);
    box.style.transform = `translateX(${center - num * (pic_w + pic_gap)}px)`;

    for (let i = 0; i < pic.length; i++) {
        if (i === num) {
            pic[i].classList.add('on-pic');
            dot[i].classList.add('on-dot');
        } else {
            pic[i].classList.remove('on-pic');
            dot[i].classList.remove('on-dot');
        }
    }
}


function go_po(x = 1) {
    num += x;

    if (num >= pic.length) {
        if (timer !== 'stop') {
            num = 0;
        } else {
            num = pic.length - 1;
        }
    } else if (num < 0) {
        if (timer !== 'stop') {
            num = pic.length - 1;
        } else {
            num = 0;
        }
    }

    run(num);

    if (timer !== 'stop') {
        clearInterval(timer);
        timer = setInterval(go_po, sec);
    }
}


function set_timer() {

    if (timer !== "stop") {
        clearInterval(timer);
        btm.classList.add("is-paused");
        btm.setAttribute("aria-label", "Play");
        timer = "stop";

    } else {
        timer = setInterval(go_po, sec);
        btm.classList.remove("is-paused");
        btm.setAttribute("aria-label", "Pause");


    }

}

document.onkeydown = function (e) {
    if (e.key === 'ArrowLeft') {
        go_po(-1);
    } else if (e.key === 'ArrowRight') {
        go_po(1);
    } else if (e.key === ' ') {
        e.preventDefault();
        set_timer();
    }
};

let touch_start_x = 0;

viewport.ontouchstart = function (e) {
    touch_start_x = e.touches[0].clientX;
};

viewport.ontouchend = function (e) {
    let touch_end_x = e.changedTouches[0].clientX;
    let diff = touch_start_x - touch_end_x;

    if (diff > 50) {
        go_po(1);
    } else if (diff < -50) {
        go_po(-1);
    }
};

let wheel_lock = false;

viewport.onwheel = function (e) {
    if (wheel_lock) {
        return;
    }

    if (e.deltaX > 10) {
        go_po(1);
    } else if (e.deltaX < -10) {
        go_po(-1);
    } else {
        return;
    }

    wheel_lock = true;
    setTimeout(function () {
        wheel_lock = false;
    }, 600);
};

window.addEventListener('resize', function () {
    run(num);
});
