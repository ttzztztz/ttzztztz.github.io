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
let ajax_dom_count = 0;
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
    let _active = event.target.dataset.active;
    ajax_begin(_focus_id,_active);
}
function ajax_begin(_focus_id,_active){
    if(_focus_id === undefined || _focus_id == ajax_focus) return;
    let focus_last = document.querySelector(".news_nav_container_li[data-id='"+ajax_focus+"']");
    let focus_now = document.querySelector(".news_nav_container_li[data-id='"+_focus_id+"']");
    if(ajax_focus!= -1)
        focus_last.classList.remove("news_nav_container_li_active");
    focus_now.classList.add("news_nav_container_li_active");
    ajax_focus = _focus_id;
    let postdata = ajax_post_example;
    ajax_doing = 1;
    if(ajax_cache[_focus_id]=="") {
        if (_active != "all") {
            postdata.keyword = _active;
        } else {
            postdata = ajax_post_all;
        }
        ajax_post("https://search.ubisoft.com/api/v2/search", JSON.stringify(postdata), ajax_notice);
    }
    else {
        ajax_notice.call(this,ajax_cache[_focus_id]);
    }
}
function delete_tags(str){
    return str.replace(/<[^>]+>/g,"");
}
function ajax_notice(_response){
    try {
        let response = JSON.parse(_response);
        let arr = response["hits"]["hits"];
        let dom_count = ajax_dom_count;
        for(let i in arr){
            let title = arr[i]["_source"].title;
            let thumb = arr[i]["_source"].thumbnail;
            let createdAt = arr[i]["_source"].createdAt;
            let link = arr[i]["_source"].link;
            let dt = new Date(createdAt);
            createdAt = ajax_month[dt.getMonth()] + " " + dt.getDay() + "," + dt.getFullYear();
            let content = delete_tags(arr[i]["_source"].content).substr(0, 800);
            if(i>=dom_count) {
                let item_div = document.createElement("div");
                item_div.classList.add("news_item");
                let item_left = document.createElement("div");
                item_left.classList.add("news_item_left");
                let item_img = document.createElement("img");
                item_img.dataset.ajax="1";
                item_img.dataset.ajax_id = i;
                item_img.classList.add("news_item_img");
                item_img.src = thumb;
                let item_right = document.createElement("div");
                item_right.classList.add("news_item_right");
                let item_a = document.createElement("a");
                item_a.dataset.ajax="1";
                item_a.dataset.ajax_id = i;
                item_a.target = "_blank";
                item_a.href = link;
                let item_title = document.createElement("h3");
                item_title.dataset.ajax="1";
                item_title.dataset.ajax_id = i;
                item_title.innerHTML = title;
                let item_author = document.createElement("h4");
                item_author.dataset.ajax="1";
                item_author.dataset.ajax_id = i;
                item_author.innerHTML = createdAt;
                let item_content = document.createElement("h5");
                item_content.dataset.ajax="1";
                item_content.dataset.ajax_id = i;
                item_content.innerHTML = content;
                let item_shadow = document.createElement("div");
                item_shadow.classList.add("news_item_shadow");
                item_left.appendChild(item_img);
                item_div.appendChild(item_left);
                item_a.appendChild(item_title);
                item_right.appendChild(item_a);
                item_right.appendChild(item_shadow);
                item_right.appendChild(item_author);
                item_right.appendChild(item_content);
                item_div.appendChild(item_right);
                ajax_container.appendChild(item_div);
                ajax_dom_count++;
            } else {
                let item_title = document.querySelector("h3[data-ajax='1'][data-ajax_id='"+i+"']");
                let item_author = document.querySelector("h4[data-ajax='1'][data-ajax_id='"+i+"']");
                let item_content = document.querySelector("h5[data-ajax='1'][data-ajax_id='"+i+"']");
                let item_a = document.querySelector("a[data-ajax='1'][data-ajax_id='"+i+"']");
                let item_img = document.querySelector("img[data-ajax='1'][data-ajax_id='"+i+"']");
                item_title.innerHTML = title;
                item_author.innerHTML = createdAt;
                item_content.innerHTML = content;
                item_a.href= link;
                item_img.src = thumb;
            }

        }
        ajax_doing = 0;
    } catch(Exception) {console.log(Exception);}
}
ajax_nav_ul.addEventListener("click",setFocus);
ajax_begin(0,"all");