let scroll=0;
let last_scrolled = 0;
let timer;

let jroll_container_list = document.querySelector("#roll_container_list");
let jroll_list = document.getElementsByClassName("roll");
let jroll_content_div_list = document.getElementsByClassName("roll_content");
let jroll_nav_list = document.getElementsByClassName("roll_nav_items");
let jroll_nav_strip = document.getElementsByClassName("roll_nav_strip");
let jul = document.getElementById("roll_nav");
let roll_controls = document.getElementById("roll_controls");

let elements_count = jroll_list.length;

function beginScroll(){
    timer = setInterval(function(){scrollCircle(scroll_add);},4000);
}
function resetScroll(){
    clearInterval(timer);
    beginScroll();
}
function ul_click(e){
    let obj = e.target.parentElement.dataset.id || -1;
    if(obj===-1) {
        e.preventDefault();
        return false;
    }
    scroll = e.target.parentElement.dataset.id;
    scrollCircle(scroll_none);
}
function scrollCircle(scroll_opt){
    scroll = scroll_opt(scroll);
    if(scroll>=elements_count) scroll=0;
    else if(scroll<=-1) scroll = elements_count -1;
    if(scroll === last_scrolled) return ;
    if(scroll_opt === scroll_none)resetScroll();
    jroll_content_div_list[last_scrolled].classList.remove("roll_content_active");
    jroll_nav_list[last_scrolled].classList.remove("roll_nav_active");
    jroll_nav_strip[last_scrolled].classList.remove("roll_nav_strip_active");
    jroll_container_list.style.transform = "translate(-"+ window.innerWidth*scroll +"px)";
    jroll_content_div_list[scroll].classList.add("roll_content_active");
    jroll_nav_list[scroll].classList.add("roll_nav_active");
    jroll_nav_strip[scroll].classList.add("roll_nav_strip_active");
    last_scrolled = scroll;
}
function scroll_add(_scroll){
    return _scroll+1;
}
function scroll_min(_scroll){
    return _scroll-1;
}
function scroll_none(_scroll){
    return _scroll;
}
function controls_click(e){
    if(e.target.dataset.opt ==="left"){
        scrollCircle(scroll_min);
    }else if(e.target.dataset.opt ==="right"){
        scrollCircle(scroll_add);
    }
}

beginScroll();
jul.addEventListener("click",ul_click);
roll_controls.addEventListener("click",controls_click);