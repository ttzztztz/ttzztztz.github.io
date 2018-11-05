let scroll=0;
let timer;
let jroll_container_list = document.querySelector("#roll_container_list");
let jroll_list = document.getElementsByClassName("roll");
let jroll_content_div_list = document.getElementsByClassName("roll_content");
let jroll_nav_list = document.getElementsByClassName("roll_nav_items");
let elements_count = jroll_list.length;
function beginScroll(){
    timer = setInterval(function(){
        jroll_content_div_list[scroll===0? elements_count-1 : scroll-1].classList.remove("roll_content_active");
        jroll_nav_list[scroll===0? elements_count-1 : scroll-1].classList.remove("roll_nav_active");

        jroll_container_list.style.transform = "translate(-"+ window.innerWidth*scroll +"px)";
        jroll_content_div_list[scroll].classList.add("roll_content_active");
        jroll_nav_list[scroll].classList.add("roll_nav_active");

        scroll ++;
        if(scroll>=elements_count) scroll=0;
    },4000);
}
beginScroll();