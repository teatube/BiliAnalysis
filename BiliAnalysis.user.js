// ==UserScript==
// @name         BiliBili本地解析(Miro)·茶叶改·Z改
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  基于Miro_355的b站解析脚本(https://www.bilibili.com/video/BV1AP411x7YW/)
// @author       Miro(https://vrchat.com/home/user/usr_20b8e0e4-9e16-406a-a61d-8a627ec1a2e3), -茶叶子-(https://vrchat.com/home/user/usr_411b8ebe-a9a9-4987-a4c8-5e17c898a311), MrZ_26(https://vrchat.com/home/user/usr_90460f0c-be4c-4f13-a828-577f40ab70e1)
// @downloadURL  https://raw.githubusercontent.com/teatube/BiliAnalysis/main/BiliAnalysis.user.js
// @updateURL    https://raw.githubusercontent.com/teatube/BiliAnalysis/main/BiliAnalysis.user.js
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/festival/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==


(function () {
    'use strict';

    // 解析按钮组件属性
    var button = document.createElement("button");
    button.textContent = "本地解析";
    button.style.width = "80px";
    button.style.align = "center";
    button.style.color = "#FFFFFF";
    button.style.background = "#00AEEC";
    button.style.border = "1px solid #F1F2F3";
    button.style.borderRadius = "6px";
    button.style.fontSize = '14px';
    button.style.marginLeft = '8px';
    button.style.padding = "6px";
    button.addEventListener("click", clickButton);

    // 尝试放置按钮5次
    function attemptAddButton() {
        var targetPlace = document.getElementsByClassName('left-entry')[0];
        if (!targetPlace) targetPlace = document.getElementsByClassName('nav-link-ul')[0];
        targetPlace.appendChild(button);
    }
    for(var i=1;i<=5;i++) setTimeout(attemptAddButton, 1000*i);

    // 解析操作
    function clickButton() {
        button.textContent = "解析中...";
        button.style.background = "#ECAE00";
        button.removeEventListener("click", clickButton);

        var url = window.location.href;
        var bvid = new URLSearchParams(window.location.search).get('bvid');
        if (!bvid) {
            var matchBv = url.match(/(?<=video\/).*?(?=\/|$)/);
            if (matchBv) bvid = matchBv[0];
        }
        if (!bvid) return console.error("BV号未找到");

        var P1 = url.match(/(?<=p=).*?(?=&vd)/);
        if (P1 == null) P1 = 1;

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://api.bilibili.com/x/player/pagelist?bvid=' + bvid, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = JSON.parse(httpRequest.responseText);
                var cid = json.data[P1 - 1].cid;
                console.log(json.data[P1 - 1].cid);
                var httpRequest1 = new XMLHttpRequest();
                httpRequest1.open('GET', 'https://api.bilibili.com/x/player/playurl?bvid=' + bvid + '&cid=' + cid + '&qn=116&type=&otype=json&platform=html5&high_quality=1', true);
                httpRequest1.withCredentials = true;
                httpRequest1.send();
                httpRequest1.onreadystatechange = function () {
                    if (httpRequest1.readyState == 4 && httpRequest1.status == 200) {
                        var json = JSON.parse(httpRequest1.responseText);
                        navigator.clipboard.writeText(json.data.durl[0].url).catch(e => console.error(e));
                        console.log(json.data.durl[0].url);
                    }
                    button.textContent = "解析成功";
                    button.style.background = "#00ECAE";
                    setTimeout(function () {
                        button.textContent = "本地解析";
                        button.style.background = "#00AEEC";
                        button.addEventListener("click", clickButton);
                    }, 2600);
                };
            }
        };
    }
})();
