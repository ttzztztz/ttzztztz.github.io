let jtouch_inside = document.getElementById("inside_ul");
let jtouch_inside_first = document.querySelector("li[data-opt='inside'][data-rank='0']");
let jtouch_inside_last = document.querySelector("li[data-opt='inside'][data-rank='3']");

const touch_inside_translate=[50,0,-50,-100];
let touch_now_hit = 1;
let touch_startX=0,touch_moveX=0,touch_endX=0,touch_transform=0;
function decidePicture(_touch_transform){
    let hit = touch_now_hit;
    if(Math.abs(_touch_transform) > 5){
        if(_touch_transform >0) {
            if (_touch_transform >= 125) hit -= 3;
            else if (_touch_transform >= 60) hit -= 2;
            else if (_touch_transform >= 5) hit -= 1;
        }
        if(_touch_transform < 0){
            if (_touch_transform <= -125) hit = parseInt(hit) + 3;
            else if (_touch_transform <= -60) hit =parseInt(hit) + 2;
            else if (_touch_transform <= -5) hit = parseInt(hit) + 1;
        }
        if(hit>=touch_inside_translate.length) hit = hit - touch_inside_translate.length;
        if(hit< 0) hit = parseInt(hit) + parseInt(touch_inside_translate.length);
        touch_now_hit = hit;
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
    touch_endX = touch.pageX;
    jtouch_inside.classList.remove("inside_transition");
}
function touch_move(event){
    let touch = event.touches[0];
    touch_endX = touch.pageX;
    jtouch_inside.style.transform = "translateX("+ (parseInt(touch_transform) + touch_px_to_vw( parseInt((touch_startX - touch_endX) * -1.0)))+"vw)";
}
function touch_end(event){
    touch_moveX = touch_startX - touch_endX;
    let add = touch_px_to_vw(touch_moveX * -1.0) ;
    decidePicture(add);
}
jtouch_inside.addEventListener('touchstart',touch_start,false);
jtouch_inside.addEventListener('touchmove',touch_move,false);
jtouch_inside.addEventListener('touchend',touch_end,false);