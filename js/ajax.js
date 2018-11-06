const ajax_post_example={"languages":["en-us"],"channels":["marketing"],"types":["article"],"filters":[{"field":"typeSlug","values":["news"]}],"size":6,"from":0,"sorts":[{"field":"createdAt","direction":"desc"}],"fields":["categorySlug"],"appId":"f35adcb5-1911-440c-b1c9-48fdc1701c68"};
const ajax_post_all = {"languages":["en-us"],"channels":["marketing"],"types":["article"],"filters":[{"field":"typeSlug","values":["news"]}],"size":6,"from":0,"sorts":[{"field":"createdAt","direction":"desc"}],"appId":"f35adcb5-1911-440c-b1c9-48fdc1701c68"};
const ajax_month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let ajax_doing = 0;
let ajax_nav_ul = document.getElementById("news_nav_ul");
let ajax_container = document.getElementById("news_container");

let ajax_all = document.querySelector("li.news_nav_container_li_active[data-id='0']");
let ajax_focus = -1;
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
    if(_focus_id === undefined || _focus_id == ajax_focus) return;
    let focus_last = document.querySelector(".news_nav_container_li[data-id='"+ajax_focus+"']");
    let focus_now = document.querySelector(".news_nav_container_li[data-id='"+_focus_id+"']");
    ajax_focus = _focus_id;
    focus_last.classList.remove("news_nav_container_li_active");
    focus_now.classList.add("news_nav_container_li_active");
    let postdata = ajax_post_example;
    ajax_doing = 1;
    if(ajax_cache[_focus_id]=="") {
        if (event.target.dataset.active != "all") {
            postdata.keyword = event.target.dataset.active;
        } else {
            postdata = ajax_post_all;
        }
        ajax_post("https://search.ubisoft.com/api/v2/search", JSON.stringify(postdata), ajax_notice);
    }
    else {
        ajax_notice.call(this,ajax_cache[_focus_id]);
    }
}
function ajax_begin(){
    
}
function ajax_notice(_response){
    try {
        let response = JSON.parse(_response);
        let arr = response["hits"]["hits"];
        for (let m = 0 , len = ajax_container.childNodes.length; m< len; m++) {
            let node = ajax_container.childNodes[0];
            ajax_container.removeChild(node);
        }
        for(let i in arr){
            let title = arr[i]["_source"].title;
            let thumb = arr[i]["_source"].thumbnail;
            let createdAt = arr[i]["_source"].createdAt;
            let dt = new Date(createdAt);
            createdAt = ajax_month[dt.getMonth()]+" "+dt.getDay()+","+dt.getFullYear();
            let content = arr[i]["_source"].content;
            let item_div = document.createElement("div");
            item_div.classList.add("news_item");
            let item_left = document.createElement("div");
            item_left.classList.add("news_item_left");
            let item_img = document.createElement("img");
            item_img.classList.add("news_item_img");
            item_img.src = thumb;
            let item_right = document.createElement("div");
            item_right.classList.add("news_item_right");
            let item_title = document.createElement("h3");
            item_title.innerHTML = title;
            let item_author = document.createElement("h4");
            item_author.innerHTML = createdAt;
            let item_content = document.createElement("h5");
            item_content.innerHTML = content;
            item_left.appendChild(item_img);
            item_div.appendChild(item_left);
            item_right.appendChild(item_title);
            item_right.appendChild(item_author);
            item_right.appendChild(item_content);
            item_div.appendChild(item_right);
            ajax_container.appendChild(item_div);
        }
        ajax_doing = 0;
    } catch(Exception) {console.log(Exception);}
}
ajax_nav_ul.addEventListener("click",setFocus);
