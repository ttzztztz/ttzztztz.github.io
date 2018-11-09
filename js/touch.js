let jtouch_inside = document.getElementById("inside_ul");
let jtouch_inside_container = document.getElementById("inside_container");
const touch_inside_num = 4;
let touch_last_moveX = 0 , touch_most_left_child = 0 , touch_most_right_child = 3;
let touch_init_left = 0 , touch_init_right = 150;
let touch_left_opt = 0,touch_right_opt = 0;
let touch_now_hit = 1;
let touch_elements=[0,1,2,3];
let touch_startX=0,touch_moveX=0,touch_endX=0,touch_transform=0;
function touch_px_to_vw(px){
    let avail_width = window.innerWidth;
    return px / avail_width * 100.0;
}
function touch_start(event){
    let touch = event.touches[0];
    touch_startX = touch.clientX;
    touch_endX = touch.clientX;
    touch_last_moveX = 0;
    jtouch_inside.classList.remove("inside_transition");
}
function touch_move_from_right_to_left(){
    touch_most_right_child = touch_most_left_child;
    touch_most_left_child = parseInt(touch_most_left_child) + 1;
    if(touch_most_left_child >= touch_inside_num) touch_most_left_child = touch_most_left_child - touch_inside_num;
    touch_init_left =  parseInt(touch_init_left)+ 50;
    touch_init_right =  parseInt(touch_init_right)+ 50;
    let move_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_most_right_child+"']");
    move_element.style.left = touch_init_right+"vw";
    touch_last_moveX = touch_moveX;
    touch_left_opt ++;
    let _temp = [0,1,2,3];
    for(let _i=0;_i<touch_inside_num-1;_i++){
        _temp[_i] = touch_elements[_i + 1];
    }
    _temp[touch_inside_num - 1] = touch_most_right_child;
    touch_elements = _temp;
}
function touch_move_from_left_to_right(){
    touch_most_left_child = touch_most_right_child;
    touch_most_right_child = touch_most_right_child - 1;
    if(touch_most_right_child<0) touch_most_right_child = touch_inside_num + parseInt(touch_most_right_child);
    touch_init_left = touch_init_left - 50;
    touch_init_right = touch_init_right - 50;
    let move_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_most_left_child+"']");
    move_element.style.left = touch_init_left+"vw";
    touch_last_moveX = touch_moveX;
    touch_right_opt ++;

    let _temp = [0,1,2,3];
    for(let _i=1;_i<touch_inside_num;_i++){
        _temp[_i] = touch_elements[_i - 1];
    }
    _temp[0] = touch_most_left_child;
    touch_elements = _temp;
}
function touch_move(event) {
    let touch = event.touches[0];
    touch_endX = touch.clientX;
    touch_moveX = touch_startX - touch_endX;
    if(touch_px_to_vw(touch_moveX - touch_last_moveX) >= 50){
        // <---o
        touch_move_from_right_to_left();
    } else if(touch_px_to_vw(touch_moveX - touch_last_moveX) <= -50){
        // o--->
        touch_move_from_left_to_right();
    }
    jtouch_inside.style.transform = "translate3d(" + (parseInt(touch_transform) + touch_px_to_vw(touch_moveX * -1.0)) + "vw,0px,0px)";
}
function touch_end(event){
    touch_moveX = touch_startX - touch_endX;
    if(Math.abs(touch_px_to_vw(touch_moveX)) <= 8){
        jtouch_inside.style.transform = "translateX("+ touch_transform +"vw)";
        jtouch_inside.classList.add("inside_transition");
        return;
    }
    let transform_base = 50 * (touch_left_opt - touch_right_opt) - 50;
    let arr_diff_min = 99999 , arr_diff_index = 0;
    for(let i=0; i < touch_inside_num;i++){
        let result = Math.abs( (50 * i) - touch_px_to_vw(touch_moveX) );
        if(result < arr_diff_min){
            arr_diff_index = i;
            arr_diff_min = result;
        }
    }
    //touch_init_left = 0;touch_init_right = 150;
    //touch_most_left_child = 0; touch_most_right_child = 3;
    //touch_transform = 0;
    touch_transform = (transform_base + 50 * arr_diff_index)*-1;
    jtouch_inside.style.transform = "translateX("+ touch_transform +"vw)";
    jtouch_inside.classList.add("inside_transition");

    if(touch_now_hit != touch_elements[arr_diff_index]){
        let old_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_now_hit+"']");
        let new_element = document.querySelector("li[data-opt='inside'][data-rank='"+touch_elements[arr_diff_index]+"']");
        old_element.children[0].classList.remove("inside_item_active");
        new_element.children[0].classList.add("inside_item_active");
        touch_now_hit = touch_elements[arr_diff_index];
    }
    if(arr_diff_index==3){
        touch_move_from_right_to_left();
    } else if(arr_diff_index ==0){
        touch_move_from_left_to_right();
    }
    /**setTimeout(function(){
        jtouch_inside.classList.remove("inside_transition");
        jtouch_inside.style.transform ="";
        for(let a =0;a<touch_inside_num;a++){
            let _dom = document.querySelector("li[data-opt='inside'][data-rank='"+a+"']");
            _dom.style.left = 50 * a+"vw";
        }
    },800);**/
}
jtouch_inside_container.addEventListener('touchstart',touch_start,false);
jtouch_inside_container.addEventListener('touchmove',touch_move,false);
jtouch_inside_container.addEventListener('touchend',touch_end,false);