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
    jroll_nav.style.transform = "translate("+ move * factor *17 +"vw)";
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
jul.addEventListener("click",ul_click);
roll_controls.addEventListener("click",controls_click);