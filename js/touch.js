let jtouch_inside = document.getElementById("inside_ul");
let jtouch_inside_container = document.getElementById("inside_container");
const touch_inside_num = 4;
let touch_inside_last_moveX = 0 , touch_inside_most_left_child = 0 , touch_inside_most_right_child = 3;
let touch_inside_init_left = 0 , touch_inside_init_right = 150;
let touch_inside_left_opt = 0,touch_inside_right_opt = 0;
let touch_inside_now_hit = 1;
let touch_inside_elements=[
    {
        "id":0,
        "rank":0
    },
    {
        "id":1,
        "rank":1
    },
    {
        "id":2,
        "rank":2
    },
    {
        "id":3,
        "rank":3
    },
];
let touch_inside_startX=0,touch_inside_moveX=0,touch_inside_endX=0,touch_inside_transform=0;
function touch_px_to_vw(px){
    let avail_width = window.innerWidth;
    return px / avail_width * 100.0;
}
function touch_vw_to_px(vw){
    let avail_width = window.innerWidth;
    return vw * avail_width / 100.0;
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
    for(let _i in touch_inside_elements){
        if(touch_inside_elements[_i].rank == 0) touch_inside_elements[_i].rank = touch_inside_num - 1;
        else touch_inside_elements[_i].rank = parseInt(touch_inside_elements[_i].rank)-1;
    }
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
    for(let _i in touch_inside_elements){
        if(touch_inside_elements[_i].rank == touch_inside_num - 1) touch_inside_elements[_i].rank = 0;
        else touch_inside_elements[_i].rank = parseInt(touch_inside_elements[_i].rank)+1;
    }
}
function touch_inside_end(event){
    touch_inside_moveX = touch_inside_startX - touch_inside_endX;
    let move_factor = touch_px_to_vw(touch_inside_moveX) ;
    if(Math.abs(move_factor) < 10){
        jtouch_inside.style.transform = "translateX("+ touch_inside_transform +"vw)";
        jtouch_inside.classList.add("inside_transition");
    } else {
        let transform_base = 50 * (touch_inside_left_opt - touch_inside_right_opt) - 50;
        let arr_diff_min = 99999, arr_diff_index = 0;
        if(move_factor >=10 && move_factor<= 50){
            touch_inside_moveX = touch_vw_to_px(50);
        } else if(move_factor <=-10 && move_factor>=-50){
            touch_inside_moveX = touch_vw_to_px(-50);
        }
        for (let i = 0; i < touch_inside_num; i++){
            let result = Math.abs( (50 * i) - Math.abs(touch_px_to_vw(touch_inside_moveX)) );
            if (result < arr_diff_min){
                arr_diff_index = i;
                arr_diff_min = result;
            }
        }
        if(move_factor>0){
            arr_diff_index = parseInt(touch_inside_now_hit) + arr_diff_index;
        } else if(move_factor < 0) {
            arr_diff_index = touch_inside_now_hit - arr_diff_index;
        }
        if(arr_diff_index <0) arr_diff_index = arr_diff_index + touch_inside_num;
        if(arr_diff_index >=touch_inside_num) arr_diff_index = arr_diff_index - touch_inside_num;
        touch_inside_transform = (transform_base + 50 * touch_inside_elements[arr_diff_index].rank) * -1;
        jtouch_inside.style.transform = "translateX(" + touch_inside_transform + "vw)";
        jtouch_inside.classList.add("inside_transition");
        if (touch_inside_now_hit != arr_diff_index) {
            let old_element = document.querySelector("li[data-opt='inside'][data-rank='" + touch_inside_now_hit + "']");
            let new_element = document.querySelector("li[data-opt='inside'][data-rank='" + arr_diff_index + "']");
            old_element.children[0].classList.remove("inside_item_active");
            new_element.children[0].classList.add("inside_item_active");
            touch_inside_now_hit = arr_diff_index;
        }
        if (touch_inside_elements[arr_diff_index].rank == 3) {
            touch_inside_move_from_right_to_left();
        } else if (touch_inside_elements[arr_diff_index].rank == 0) {
            touch_inside_move_from_left_to_right();
        }
    }
}
function touch_inside_start(event){
    let touch = event.touches[0];
    touch_inside_startX = touch.clientX;
    touch_inside_endX = touch.clientX;
    touch_inside_last_moveX = 0;
    jtouch_inside.classList.remove("inside_transition");
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
let mouse_inside_down = 0;
function mouse_inside_start(event){
    mouse_inside_down = 1;
    touch_inside_startX = event.clientX;
    touch_inside_endX = event.clientX;
    touch_inside_last_moveX = 0;
    jtouch_inside.classList.remove("inside_transition");
    event.preventDefault();
}
function mouse_inside_move(event) {
    if(!mouse_inside_down) return;
    touch_inside_endX = event.clientX;
    touch_inside_moveX = touch_inside_startX - touch_inside_endX;
    if(touch_px_to_vw(touch_inside_moveX - touch_inside_last_moveX) >= 50){
        // <---o
        touch_inside_move_from_right_to_left();
    } else if(touch_px_to_vw(touch_inside_moveX - touch_inside_last_moveX) <= -50){
        // o--->
        touch_inside_move_from_left_to_right();
    }
    jtouch_inside.style.transform = "translate3d(" + (parseInt(touch_inside_transform) + touch_px_to_vw(touch_inside_moveX * -1.0)) + "vw,0px,0px)";
    event.preventDefault();
}
function mouse_inside_end(event){
    mouse_inside_down = 0;
    touch_inside_end(event);
    event.preventDefault();
}
jtouch_inside_container.addEventListener('touchstart',touch_inside_start,false);
jtouch_inside_container.addEventListener('touchmove',touch_inside_move,false);
jtouch_inside_container.addEventListener('touchend',touch_inside_end,false);
jtouch_inside_container.addEventListener('mousedown',mouse_inside_start,false);
jtouch_inside_container.addEventListener('mousemove',mouse_inside_move,false);
jtouch_inside_container.addEventListener('mouseup',mouse_inside_end,false);


let jtouch_trending = document.getElementById("trending_ul");
let jtouch_trending_container = document.getElementById("trending_container");
const touch_trending_num = 5;
let touch_trending_last_moveX = 0 , touch_trending_most_left_child = 0 , touch_trending_most_right_child = 4;
let touch_trending_init_left = 0 , touch_trending_init_right = 200;
let touch_trending_left_opt = 0,touch_trending_right_opt = 0;
let touch_trending_now_hit = 1;
let touch_trending_elements=[
    {
        "id":0,
        "rank":0
    },
    {
        "id":1,
        "rank":1
    },
    {
        "id":2,
        "rank":2
    },
    {
        "id":3,
        "rank":3
    },
    {
        "id":4,
        "rank":4
    }
];
let touch_trending_startX=0,touch_trending_moveX=0,touch_trending_endX=0,touch_trending_transform=0;
function touch_trending_move_from_right_to_left(){
    touch_trending_most_right_child = touch_trending_most_left_child;
    touch_trending_most_left_child = parseInt(touch_trending_most_left_child) + 1;
    if(touch_trending_most_left_child >= touch_trending_num) touch_trending_most_left_child = touch_trending_most_left_child - touch_trending_num;
    touch_trending_init_left =  parseInt(touch_trending_init_left)+ 50;
    touch_trending_init_right =  parseInt(touch_trending_init_right)+ 50;
    let move_element = document.querySelector("li[data-opt='trending'][data-rank='"+touch_trending_most_right_child+"']");
    move_element.style.left = touch_trending_init_right+"vw";
    touch_trending_last_moveX = touch_trending_moveX;
    touch_trending_left_opt ++;
    for(let _i in touch_trending_elements){
        if(touch_trending_elements[_i].rank == 0) touch_trending_elements[_i].rank = touch_trending_num - 1;
        else touch_trending_elements[_i].rank = parseInt(touch_trending_elements[_i].rank)-1;
    }
}
function touch_trending_move_from_left_to_right(){
    touch_trending_most_left_child = touch_trending_most_right_child;
    touch_trending_most_right_child = touch_trending_most_right_child - 1;
    if(touch_trending_most_right_child<0) touch_trending_most_right_child = touch_trending_num + parseInt(touch_trending_most_right_child);
    touch_trending_init_left = touch_trending_init_left - 50;
    touch_trending_init_right = touch_trending_init_right - 50;
    let move_element = document.querySelector("li[data-opt='trending'][data-rank='"+touch_trending_most_left_child+"']");
    move_element.style.left = touch_trending_init_left+"vw";
    touch_trending_last_moveX = touch_trending_moveX;
    touch_trending_right_opt ++;
    for(let _i in touch_trending_elements){
        if(touch_trending_elements[_i].rank == touch_trending_num - 1) touch_trending_elements[_i].rank = 0;
        else touch_trending_elements[_i].rank = parseInt(touch_trending_elements[_i].rank)+1;
    }
}
function touch_trending_end(event){
    touch_trending_moveX = touch_trending_startX - touch_trending_endX;
    let move_factor = touch_px_to_vw(touch_trending_moveX) ;
    if(Math.abs(move_factor) < 10){
        jtouch_trending.style.transform = "translateX("+ touch_trending_transform +"vw)";
        jtouch_trending.classList.add("trending_transition");
    } else {
        let transform_base = 50 * (touch_trending_left_opt - touch_trending_right_opt) - 50;
        let arr_diff_min = 99999, arr_diff_index = 0;
        if(move_factor >=10 && move_factor<= 50){
            touch_trending_moveX = touch_vw_to_px(50);
        } else if(move_factor <=-10 && move_factor>=-50){
            touch_trending_moveX = touch_vw_to_px(-50);
        }
        for (let i = 0; i < touch_trending_num; i++){
            let result = Math.abs( (50 * i) - Math.abs(touch_px_to_vw(touch_trending_moveX)) );
            if (result < arr_diff_min){
                arr_diff_index = i;
                arr_diff_min = result;
            }
        }
        if(move_factor>0){
            arr_diff_index = parseInt(touch_trending_now_hit) + arr_diff_index;
        } else if(move_factor < 0) {
            arr_diff_index = touch_trending_now_hit - arr_diff_index;
        }
        if(arr_diff_index <0) arr_diff_index = arr_diff_index + touch_trending_num;
        if(arr_diff_index >=touch_trending_num) arr_diff_index = arr_diff_index - touch_trending_num;
        touch_trending_transform = (transform_base + 50 * touch_trending_elements[arr_diff_index].rank) * -1;
        jtouch_trending.style.transform = "translateX(" + touch_trending_transform + "vw)";
        jtouch_trending.classList.add("trending_transition");
        if (touch_trending_now_hit != arr_diff_index) {
            let old_element = document.querySelector("li[data-opt='trending'][data-rank='" + touch_trending_now_hit + "']");
            let new_element = document.querySelector("li[data-opt='trending'][data-rank='" + arr_diff_index + "']");
            old_element.children[0].classList.remove("trending_item_active");
            new_element.children[0].classList.add("trending_item_active");
            touch_trending_now_hit = arr_diff_index;
        }
        if (touch_trending_elements[arr_diff_index].rank == 4) {
            touch_trending_move_from_right_to_left();
        } else if (touch_trending_elements[arr_diff_index].rank == 0) {
            touch_trending_move_from_left_to_right();
        }
    }
}
function touch_trending_start(event){
    let touch = event.touches[0];
    touch_trending_startX = touch.clientX;
    touch_trending_endX = touch.clientX;
    touch_trending_last_moveX = 0;
    jtouch_trending.classList.remove("trending_transition");
}
function touch_trending_move(event) {
    let touch = event.touches[0];
    touch_trending_endX = touch.clientX;
    touch_trending_moveX = touch_trending_startX - touch_trending_endX;
    if(touch_px_to_vw(touch_trending_moveX - touch_trending_last_moveX) >= 50){
        // <---o
        touch_trending_move_from_right_to_left();
    } else if(touch_px_to_vw(touch_trending_moveX - touch_trending_last_moveX) <= -50){
        // o--->
        touch_trending_move_from_left_to_right();
    }
    jtouch_trending.style.transform = "translate3d(" + (parseInt(touch_trending_transform) + touch_px_to_vw(touch_trending_moveX * -1.0)) + "vw,0px,0px)";
}
let mouse_trending_down = 0;
function mouse_trending_start(event){
    mouse_trending_down = 1;
    touch_trending_startX = event.clientX;
    touch_trending_endX = event.clientX;
    touch_trending_last_moveX = 0;
    jtouch_trending.classList.remove("trending_transition");
    event.preventDefault();
}
function mouse_trending_move(event) {
    if(!mouse_trending_down) return;
    touch_trending_endX = event.clientX;
    touch_trending_moveX = touch_trending_startX - touch_trending_endX;
    if(touch_px_to_vw(touch_trending_moveX - touch_trending_last_moveX) >= 50){
        // <---o
        touch_trending_move_from_right_to_left();
    } else if(touch_px_to_vw(touch_trending_moveX - touch_trending_last_moveX) <= -50){
        // o--->
        touch_trending_move_from_left_to_right();
    }
    jtouch_trending.style.transform = "translate3d(" + (parseInt(touch_trending_transform) + touch_px_to_vw(touch_trending_moveX * -1.0)) + "vw,0px,0px)";
    event.preventDefault();
}
function mouse_trending_end(event){
    mouse_trending_down = 0;
    touch_trending_end(event);
    event.preventDefault();
}
jtouch_trending_container.addEventListener('touchstart',touch_trending_start,false);
jtouch_trending_container.addEventListener('touchmove',touch_trending_move,false);
jtouch_trending_container.addEventListener('touchend',touch_trending_end,false);
jtouch_trending_container.addEventListener('mousedown',mouse_trending_start,false);
jtouch_trending_container.addEventListener('mousemove',mouse_trending_move,false);
jtouch_trending_container.addEventListener('mouseup',mouse_trending_end,false);
