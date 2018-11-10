let scroll=2;
let last_scrolled = 2;
let timer;
let timer_cleared = 0;
let jroll_container_list = document.querySelector("#roll_container_list");
let jroll_list = document.getElementsByClassName("roll");
let jroll_content_div_list = document.getElementsByClassName("roll_content");
let jroll_nav_list = document.getElementsByClassName("roll_nav_items");
let jul = document.getElementById("roll_nav");
let roll_controls = document.getElementById("roll_controls");
let jroll_nav = document.getElementById("roll_nav");
let elements_count = jroll_list.length;
let scrolling = 0;
let images_list = [
    {
        "id":0,
        "color":"rgb(150, 15, 15)",
        "img":"img/first/assassins.png",
    },{
        "id":1,
        "color":"rgb(142, 229, 63)",
        "img":"img/first/crew.png",
    },{
        "id":2,
        "color":"rgb(150, 15, 15)",
        "img":"img/first/division.png",
    },{
        "id":3,
        "color":"rgb(150, 15, 15)",
        "img":"img/first/farcry.png",
    },{
        "id":4,
        "color":"rgb(224, 151, 18)",
        "img":"img/first/ghost.png",
    },{
        "id":5,
        "color":"rgb(248, 79, 32)",
        "img":"img/first/honor.png",
    },{
        "id":6,
        "color":"rgb(209, 86, 229)",
        "img":"img/first/justdance.png",
    },{
        "id":7,
        "color":"rgb(177, 81, 43)",
        "img":"img/first/rainbow.png",
    },{
        "id":8,
        "color":"rgb(243, 157, 38)",
        "img":"img/first/starlink.png",
    }
];
function beginScroll(){
    timer = setInterval(function(){scrollCircle("r",1);},8000);
}
function ul_click(e){
    e.stopPropagation();
    let dir = e.target.parentElement.dataset.dir || null;
    let move = e.target.parentElement.dataset.move || null;
    if(dir===null || move===null) return;
    scrollCircle(dir,move);
    if(!timer_cleared){
        clearInterval(timer);
        timer_cleared = 1;
    }
}
function scrollCircle(dir,move){
    let factor = 1;
    if(dir==="l"){
        scroll -= move;
        factor = 1;
    } else if(dir==="r"){
        scroll = parseInt(scroll) + parseInt(move);
        factor = -1;
    }
    if(scroll>=elements_count) scroll=scroll - elements_count;
    else if(scroll<=-1) scroll = parseInt(scroll) + parseInt(elements_count);
    if(scroll === last_scrolled){
        return ;
    }
    if(scrolling){
        return ;
    }
    scrolling = 1;
    jroll_content_div_list[last_scrolled].classList.remove("roll_content_active");
    jroll_container_list.style.transform = "translate(-"+ scroll*100.0 +"vw)";
    jroll_content_div_list[scroll].classList.add("roll_content_active");
    jroll_nav.classList.add("roll_nav_active");
    let screen_now = window.innerWidth;
    if(screen_now >1000){
        jroll_nav.style.transform = "translate("+ move * factor *17 +"vw)";
    } else {
        jroll_nav.style.transform = "translate("+ move * factor *34 +"vw)";
    }
    jroll_nav_list[4].children[1].style.display ="none";
    if(dir==="l"){
        jroll_nav_list[1].classList.remove("hidden");
        if(move==2){
            jroll_nav_list[0].classList.remove("hidden");
        }
    } else if(dir==="r"){
        jroll_nav_list[7].classList.remove("hidden");
        if(move==2){
            jroll_nav_list[8].classList.remove("hidden");
        }
    }
    setTimeout(function(){
        if(dir==="l"){
            jroll_nav_list[1].classList.add("hidden");
            if(move==2){
                jroll_nav_list[0].classList.add("hidden");
            }
        } else if(dir==="r"){
            jroll_nav_list[7].classList.add("hidden");
            if(move==2){
                jroll_nav_list[8].classList.add("hidden");
            }
        }
        jroll_nav.classList.remove("roll_nav_active");
        jroll_nav.style.transform = "translate(0vw)";
        jroll_nav_list[4].dataset.id= scroll;
        jroll_nav_list[4].children[0].setAttribute("src",images_list[scroll].img);
        jroll_nav_list[4].children[1].style.display ="block";
        jroll_nav_list[4].children[1].style.backgroundColor = images_list[scroll].color;
        for(let _m=0;_m<=8;_m++){
            if(_m===4) continue;
            let temp = 0;
            if(_m<4){
                let t = 4 - _m;
                temp = parseInt(scroll - t);
                if(temp<0) temp = parseInt(temp) + parseInt(elements_count);
            } else {
                let t = _m -4;
                temp = parseInt(scroll) + parseInt(t) ;
                if(temp>=elements_count) temp = parseInt(temp -  elements_count);
            }
            jroll_nav_list[_m].dataset.id = temp;
            jroll_nav_list[_m].children[0].setAttribute("src",images_list[temp].img);
        }
        last_scrolled = scroll;
        scrolling = 0;
    },600);
}
function controls_click(e){
    e.stopPropagation();
    let dir = e.target.parentElement.dataset.dir || null;
    let move = e.target.parentElement.dataset.move || null;
    if(dir===null || move===null) return;
    scrollCircle(dir,move);
    if(!timer_cleared){
        clearInterval(timer);
        timer_cleared = 1;
    }
}
beginScroll();
let scroll_touch_startX = 0 , scroll_touch_endX = 0 , scroll_touch_moveX=0;
function scroll_touch_start(event){
    let touch = event.touches[0];
    scroll_touch_startX = touch.clientX;
    scroll_touch_endX = touch.clientX;
}
function scroll_touch_move(event){
    let touch = event.touches[0];
    scroll_touch_endX = touch.clientX;
}
function scroll_touch_end(event){
    scroll_touch_moveX = scroll_touch_startX - scroll_touch_endX;
    if(Math.abs(touch_px_to_vw(scroll_touch_moveX))>=5){
        if(scroll_touch_moveX > 0){
            scrollCircle("r",1);
        } else if(scroll_touch_moveX < 0){
            scrollCircle("l",1);
        }
    }
}
jul.addEventListener('touchstart',scroll_touch_start,false);
jul.addEventListener('touchmove',scroll_touch_move,false);
jul.addEventListener('touchend',scroll_touch_end,false);
jul.addEventListener("click",ul_click);
roll_controls.addEventListener("click",controls_click);

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
    if(!mouse_inside_down) return false;
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
    if(!mouse_inside_down) return false;
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
jtouch_inside_container.addEventListener('mouseleave',mouse_inside_end,false);

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
    if(!mouse_trending_down) return false;
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
    if(!mouse_trending_down) return false;
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
jtouch_trending_container.addEventListener('mouseleave',mouse_trending_end,false);

let more_element = document.getElementById("more_games");
let more_container1 = document.getElementById("more_container1") , more_container2 = document.getElementById("more_container2");
let touch_more_startX=0,touch_more_endX=0,touch_more_transform=0;
let mouse_more_on = 0;
function touch_more_start(event){
    more_container1.classList.remove("more_games_container_active");
    more_container2.classList.remove("more_games_container_active");
    let touch = event.touches[0];
    touch_more_startX = touch.clientX;
    touch_more_endX = touch.clientX;
}
function touch_more_move(event){
    let touch = event.touches[0];
    touch_more_endX = touch.clientX;
    more_container1.style.transform = "translateX("+(parseInt(touch_more_transform) + touch_more_endX - touch_more_startX)+"px)";
    more_container2.style.transform = "translateX("+(parseInt(touch_more_transform) + touch_more_endX - touch_more_startX)+"px)";
}
function touch_more_end(event){
    let temp = parseInt(touch_more_transform) + touch_more_endX - touch_more_startX;
    more_container1.classList.add("more_games_container_active");
    more_container2.classList.add("more_games_container_active");
    let flag = 0;
    if(temp >0){
        touch_more_transform = 0;
        flag = 1;
    } else if(temp <=-11520){
        touch_more_transform = -11520;
        flag= 1;
    } else {
        touch_more_transform = parseInt(touch_more_transform) + touch_more_endX - touch_more_startX;
    }
    if(flag){
        more_container1.style.transform = "translateX("+touch_more_transform+"px)";
        more_container2.style.transform = "translateX("+touch_more_transform+"px)";
    }
}
function mouse_more_start(event){
    event.preventDefault();
    more_container1.classList.remove("more_games_container_active");
    more_container2.classList.remove("more_games_container_active");
    mouse_more_on = 1;
    touch_more_startX = event.clientX;
    touch_more_endX = event.clientX;
}
function mouse_more_move(event){
    event.preventDefault();
    if(!mouse_more_on) return false;
    touch_more_endX = event.clientX;
    more_container1.style.transform = "translateX("+(parseInt(touch_more_transform) + touch_more_endX - touch_more_startX)+"px)";
    more_container2.style.transform = "translateX("+(parseInt(touch_more_transform) + touch_more_endX - touch_more_startX)+"px)";
}
function mouse_more_end(event){
    event.preventDefault();
    if(!mouse_more_on) return false;
    more_container1.classList.add("more_games_container_active");
    more_container2.classList.add("more_games_container_active");
    touch_more_end(event);
    mouse_more_on = 0;
}
more_element.addEventListener('touchstart',touch_more_start,false);
more_element.addEventListener('touchmove',touch_more_move,false);
more_element.addEventListener('touchend',touch_more_end,false);
more_element.addEventListener('mousedown',mouse_more_start,false);
more_element.addEventListener('mousemove',mouse_more_move,false);
more_element.addEventListener('mouseup',mouse_more_end,false);
more_element.addEventListener('mouseleave',mouse_more_end,false);