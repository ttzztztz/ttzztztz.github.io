const ajax_post_example={"languages":["en-us"],"channels":["marketing"],"types":["article"],"filters":[{"field":"typeSlug","values":["news"]}],"size":6,"from":0,"sorts":[{"field":"createdAt","direction":"desc"}],"fields":["categorySlug"],"appId":"f35adcb5-1911-440c-b1c9-48fdc1701c68"};
let ajax_doing = 0;
let ajax_nav_ul = document.getElementById("news_nav_ul");
let ajax_container = document.getElementById("news_container");
let ajax_focus = 0;
let ajax_cache = {
    0:"",
    1:"",
    2:"",
    3:"",
    4:""
};
function ajax_post(url, data, fn){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            fn.call(this, xhr.responseText);
        }
    };
    xhr.send(data);
}
function setFocus(event){
    if(ajax_doing) return;
    let _focus_id = event.target.dataset.id;
    if(_focus_id == ajax_focus) return;
    let focus_last = document.querySelector(".news_nav_container_li[data-id='"+ajax_focus+"']");
    let focus_now = document.querySelector(".news_nav_container_li[data-id='"+_focus_id+"']");
    ajax_focus = _focus_id;
    focus_last.classList.remove("news_nav_container_li_active");
    focus_now.classList.add("news_nav_container_li_active");
    let postdata = ajax_post_example;
    ajax_doing = 1;
    if(ajax_cache[_focus_id]!=="") {
        if (event.target.dataset.active != "all") {
            postdata.keyword = event.target.dataset.active;
        }
        let ajax_response = ajax_post("https://search.ubisoft.com/api/v2/search", JSON.stringify(postdata), ajax_notice);
    }
    else {
        ajax_post.call(this,ajax_cache[_focus_id]);
    }
}
function ajax_notice(_response){
    try {
        let response = JSON.parse(_response);
        let len = response["took"];
        let arr = response["hits"]["hits"];
        for(let i=0;i<len;i++){

        }
        ajax_doing = 0;
    } catch(Exception) {console.log(Exception);}
}
ajax_nav_ul.addEventListener("click",setFocus);