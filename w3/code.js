let tp = 152;
let lft = 235;

let m1 = document.getElementById('m1');

let bd= document.getElementById('bd');
let ba= document.getElementById('ba');
let br= document.getElementById('br');
let bl= document.getElementById('bl');

function f_d() {
    tp += 1;
    m1.style.top = tp + 'px';
    m1.style.background = '#39d353';
    m1.style.boxShadow = '0 0 10px #39d353';
    if (tp >= 300) {
        clearInterval(sd)
        m1.style.background = '#d29922';
        m1.style.boxShadow = '0 0 10px #d29922';
    }
}
function f_a() {
    tp -= 1;
    m1.style.background = '#39d353';
    m1.style.boxShadow = '0 0 10px #39d353';
    m1.style.top = tp + 'px';
    if (tp <= 0) {
        clearInterval(sa)
        m1.style.background = '#d29922';
        m1.style.boxShadow = '0 0 10px #d29922';
    }
}
function f_r() {
    lft += 1;
    m1.style.background = '#39d353';
    m1.style.boxShadow = '0 0 10px #39d353';
    m1.style.left = lft + 'px';
    if (lft >= 450) {
        clearInterval(sr)
        m1.style.background = '#d29922';
        m1.style.boxShadow = '0 0 10px #d29922';
    }
}
function f_l() {
    lft -= 1;
    m1.style.background = '#39d353';
    m1.style.boxShadow = '0 0 10px #39d353';
    m1.style.left = lft + 'px';
    if (lft <= 0) {
        clearInterval(sl)
        m1.style.background = '#d29922';
        m1.style.boxShadow = '0 0 10px #d29922';
    }
}
function ff() {
    tp = 152;
    lft = 235;
    ba.disabled = false;
    bd.disabled = false;
    br.disabled = false;
    bl.disabled = false;
    m1.style.background = '#fff';
    m1.style.boxShadow = '0 0 10px #fff';
    m1.style.left = lft + 'px';
    m1.style.top = tp + 'px';
}


let sd;
let sa;
let sr;
let sl;

function s_d(){
    bd.disabled = true;
    sd = setInterval(f_d, 4);
    clearInterval(sa)
    clearInterval(sr)
    clearInterval(sl)
    ba.disabled = false;
    br.disabled = false;
    bl.disabled = false;
}
function s_a(){
    ba.disabled = true;
    sa = setInterval(f_a, 4);
    clearInterval(sd)
    clearInterval(sr)
    clearInterval(sl)
    bd.disabled = false;
    br.disabled = false;
    bl.disabled = false;
}
function s_r(){
    br.disabled = true;
    sr = setInterval(f_r, 4);
    clearInterval(sd)
    clearInterval(sa)
    clearInterval(sl)
    ba.disabled = false;
    bd.disabled = false;
    bl.disabled = false;
}
function s_l(){
    bl.disabled = true;
    sl = setInterval(f_l, 4);
    clearInterval(sd)
    clearInterval(sa)
    clearInterval(sr)
    ba.disabled = false;
    bd.disabled = false;
    br.disabled = false;
}
function s_0() {
    clearInterval(sd)
    clearInterval(sa)
    clearInterval(sr)
    clearInterval(sl)
    ba.disabled = false;
    bd.disabled = false;
    br.disabled = false;
    bl.disabled = false;
    m1.style.background = '#fff';
    m1.style.boxShadow = '0 0 10px #fff';

}