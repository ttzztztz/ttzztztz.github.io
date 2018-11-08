let jtouch_inside = document.getElementById("inside_ul");
let jtouch_inside_first = document.querySelector("li[data-opt='inside'][data-rank='0']");
let jtouch_inside_last = document.querySelector("li[data-opt='inside'][data-rank='3']");
const touch_inside=[25,-25,-75,-125];
const touch_inside_translate=[50,0,-50,-100];
let touch_startX,touch_moveX,touch_endX,touch_transform=0;
function decidePicture(_touch_transform){
    let count = touch_inside.length , hit = 0;
    for(let i=1;i<count;i++){
        if(_touch_transform<=touch_inside[i-1] && _touch_transform>=touch_inside[i]){
            hit = i;
            break;
        }
    }
    touch_transform = touch_inside_translate[hit];
    jtouch_inside.style.transform = "translateX("+ touch_inside_translate[hit] +"vw)";
    jtouch_inside.classList.add("inside_transition");
}
function touch_px_to_vw(px){
    let avail_width = window.innerWidth;
    return px / avail_width * 100.0;
}
function touch_start(event){
    let touch = event.touches[0];
    touch_startX = touch.pageX;
    jtouch_inside.classList.remove("inside_transition");
}
function touch_move(event){
    let touch = event.touches[0];
    touch_endX = touch.pageX;
    jtouch_inside.style.transform = "translateX("+ touch_px_to_vw(touch_transform + parseInt((touch_startX - touch_endX) * -1.0))+"vw)";
}
function touch_end(event){
    touch_moveX = touch_startX - touch_endX;
    touch_transform += touch_px_to_vw((touch_startX - touch_endX) * -1.0);
    decidePicture(touch_transform);
}
jtouch_inside.addEventListener('touchstart',touch_start,false);
jtouch_inside.addEventListener('touchmove',touch_move,false);
jtouch_inside.addEventListener('touchend',touch_end,false);