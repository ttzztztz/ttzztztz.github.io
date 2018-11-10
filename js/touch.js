let jtouch_inside = document.getElementById("inside_ul");
let jtouch_inside_container = document.getElementById("inside_container");
const touch_inside_num = 4;
let touch_inside_last_moveX = 0 , touch_inside_most_left_child = 0 , touch_inside_most_right_child = 3;
let touch_inside_init_left = 0 , touch_inside_init_right = 150;
let touch_inside_left_opt = 0,touch_inside_right_opt = 0;
let touch_inside_now_hit = 1;
let touch_inside_elements=[0,1,2,3];
let touch_inside_startX=0,touch_inside_moveX=0,touch_inside_endX=0,touch_inside_transform=0;
function touch_px_to_vw(px){
    let avail_width = window.innerWidth;
    return px / avail_width * 100.0;
}
function touch_inside_start(event){
    let touch = event.touches[0];
    touch_inside_startX = touch.clientX;
    touch_inside_endX = touch.clientX;
    touch_inside_last_moveX = 0;
    jtouch_inside.classList.remove("inside_transition");
}
function touch_inside_move_from_right_to_left(){
    touch_inside_most_right_child = touch_inside_most_left_child;
    touch_inside_most_left_child = parseInt(touch_inside_most_left_child) + 1;
    if(touch_inside_most_left_child >= touch_inside_num) touch_inside_most_left_child = touch_inside_most_left_child - touch_inside_num;
    touch_inside_init_left =  parseInt(touch_inside_init_left)+ 50;
    touch_inside_init_right =  parseInt(touch_inside_init_right)+ 50;
    let move_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_inside_most_right_child+"']");
    move_element.style.left = touch_inside_init_right+"vw";
    touch_inside_last_moveX = touch_inside_moveX;
    touch_inside_left_opt ++;
    let _temp = [0,1,2,3];
    for(let _i=0;_i<touch_inside_num-1;_i++){
        _temp[_i] = touch_inside_elements[_i + 1];
    }
    _temp[touch_inside_num - 1] = touch_inside_most_right_child;
    touch_inside_elements = _temp;
}
function touch_inside_move_from_left_to_right(){
    touch_inside_most_left_child = touch_inside_most_right_child;
    touch_inside_most_right_child = touch_inside_most_right_child - 1;
    if(touch_inside_most_right_child<0) touch_inside_most_right_child = touch_inside_num + parseInt(touch_inside_most_right_child);
    touch_inside_init_left = touch_inside_init_left - 50;
    touch_inside_init_right = touch_inside_init_right - 50;
    let move_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_inside_most_left_child+"']");
    move_element.style.left = touch_inside_init_left+"vw";
    touch_inside_last_moveX = touch_inside_moveX;
    touch_inside_right_opt ++;
    let _temp = [0,1,2,3];
    for(let _i=1;_i<touch_inside_num;_i++){
        _temp[_i] = touch_inside_elements[_i - 1];
    }
    _temp[0] = touch_inside_most_left_child;
    touch_inside_elements = _temp;
}
function touch_inside_move(event) {
    let touch = event.touches[0];
    touch_inside_endX = touch.clientX;
    touch_inside_moveX = touch_inside_startX - touch_inside_endX;
    if(touch_px_to_vw(touch_inside_moveX - touch_inside_last_moveX) >= 50){
        // <---o
        touch_inside_move_from_right_to_left();
    } else if(touch_px_to_vw(touch_inside_moveX - touch_inside_last_moveX) <= -50){
        // o--->
        touch_inside_move_from_left_to_right();
    }
    jtouch_inside.style.transform = "translate3d(" + (parseInt(touch_inside_transform) + touch_px_to_vw(touch_inside_moveX * -1.0)) + "vw,0px,0px)";
}
function touch_inside_end(event){
    touch_inside_moveX = touch_inside_startX - touch_inside_endX;
    if(Math.abs(touch_px_to_vw(touch_inside_moveX)) <= 8){
        jtouch_inside.style.transform = "translateX("+ touch_inside_transform +"vw)";
        jtouch_inside.classList.add("inside_transition");
        return;
    }
    let transform_base = 50 * (touch_inside_left_opt - touch_inside_right_opt) - 50;
    let arr_diff_min = 99999 , arr_diff_index = 0;
    for(let i=0; i < touch_inside_num;i++){
        let result = Math.abs( (50 * i) - touch_px_to_vw(touch_inside_moveX) );
        if(result < arr_diff_min){
            arr_diff_index = i;
            arr_diff_min = result;
        }
    }
    touch_inside_transform = (transform_base + 50 * arr_diff_index)*-1;
    jtouch_inside.style.transform = "translateX("+ touch_inside_transform +"vw)";
    jtouch_inside.classList.add("inside_transition");
    if(touch_inside_now_hit != touch_inside_elements[arr_diff_index]){
        let old_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_inside_now_hit+"']");
        let new_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_inside_elements[arr_diff_index]+"']");
        old_element.children[0].classList.remove("inside_item_active");
        new_element.children[0].classList.add("inside_item_active");
        touch_inside_now_hit = touch_inside_elements[arr_diff_index];
    }
    if(arr_diff_index==3){
        touch_inside_move_from_right_to_left();
    } else if(arr_diff_index ==0){
        touch_inside_move_from_left_to_right();
    }
}
jtouch_inside_container.addEventListener('touchstart',touch_inside_start,false);
jtouch_inside_container.addEventListener('touchmove',touch_inside_move,false);
jtouch_inside_container.addEventListener('touchend',touch_inside_end,false);