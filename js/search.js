let jsearch_box = document.getElementById("pc_nav_search_box");
let jsearch_div = document.getElementById("pc_nav_search");
let jsearch_input = document.getElementById("pc_nav_search_input");
let jsearch_icon = document.getElementById("search_icon");
let jsearch_container = document.getElementById("pc_nav_search_btn_container");
let search_status = 0;
let jmobile_nav_panel = document.getElementById("mobile_nav_panel");
let jmobile_nav_close = document.getElementById("mobile_nav_close");
let jmobile_menu_btn = document.getElementById("mobile_nav_menu_container");
const search_default_icon = "img/search.png";
const search_focus_icon = "img/search_focus.png";
function search_btn_click(){
    if(!search_status){
        search_status = 1;
        jsearch_div.classList.add("search_button_active");
        jsearch_box.classList.add("pc_nav_search_box_active");
        jsearch_icon.src = search_focus_icon;
        jsearch_input.focus();
    } else {
        search_status = 0;
        jsearch_div.classList.remove("search_button_active");
        jsearch_box.classList.remove("pc_nav_search_box_active");
        jsearch_icon.src = search_default_icon;
    }
}
function mobile_menu_btn_click(){
    jmobile_nav_panel.classList.add("mobile_nav_panel_active");
}
function mobile_menu_btn_close(){
    jmobile_nav_panel.classList.remove("mobile_nav_panel_active");
}
jsearch_container.addEventListener("click",search_btn_click);
jmobile_menu_btn.addEventListener("click",mobile_menu_btn_click);
jmobile_nav_close.addEventListener("click",mobile_menu_btn_close);