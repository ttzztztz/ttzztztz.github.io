let scroll=0;
let last_scrolled = 0;
let timer;

let jroll_container_list = document.querySelector("#roll_container_list");
let jroll_list = document.getElementsByClassName("roll");
let jroll_content_div_list = document.getElementsByClassName("roll_content");
let jroll_nav_list = document.getElementsByClassName("roll_nav_items");
let jul = document.getElementById("roll_nav");
let roll_controls = document.getElementById("roll_controls");

let elements_count = jroll_list.length;

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
        "img":"img/first/justdance.jpg",
    },{
        "id":7,
        "color":"rgb(177, 81, 43)",
        "img":"img/first/rainbow.jpg",
    },{
        "id":8,
        "color":"rgb(243, 157, 38)",
        "img":"img/first/starlink.jpg",
    }
];
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
    //jroll_nav_list[last_scrolled].classList.remove("roll_nav_active");
    jroll_container_list.style.transform = "translate(-"+ window.innerWidth*scroll +"px)";
    jroll_content_div_list[scroll].classList.add("roll_content_active");
    //jroll_nav_list[scroll].classList.add("roll_nav_active");

    //center: element
    for(let _m=0;_m<=9;_m++){
        if(_m===4) continue;
        if(_m<4){
            let temp = (scroll - _m <0)? scroll- _m + elements_count : scroll- _m;
        } else {

        }
        jroll_nav_list[_m].dataset.id= scroll;
        jroll_nav_list[_m].children[0].setAttribute("src",images_list[factors].img);
        jroll_nav_list[_m].children[1].style.backgroundColor = images_list[factors].color;
    }
    jroll_nav_list[4].dataset.id= scroll;
    jroll_nav_list[4].children[0].setAttribute("src",images_list[scroll].img);
    jroll_nav_list[4].children[1].style.backgroundColor = images_list[scroll].color;
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