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
    setTimeout(function () {
        var likeComment = document.getElementsByClassName('left-entry')[0];
        if (!likeComment) likeComment = document.getElementsByClassName('nav-link-ul')[0];
        if (!likeComment) likeComment = document.getElementsByClassName('nav-link-ul')[0];
        if (!likeComment) console.error("组件放置失败");
        likeComment.appendChild(button);
    }, 5000);

    function clickButton() {
        var url = window.location.href;
        var urlParams = new URLSearchParams(window.location.search);
        var bvid = urlParams.get('bvid');
        if (!bvid) {
            var matchBv = url.match(/(?<=video\/).*?(?=\/|$)/);
            if (!matchBv) {
                console.error("BV号未找到");
                return;
            }
            bvid = matchBv[0];
        }
        var P = /(?<=p=).*?(?=&vd)/;
        var P1 = url.match(P);
        if (P1 == null) {
            P1 = 1;
        }
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
                };
            }
        };
        GM_notification({
            title: "解析成功",
            image: "https://i0.hdslb.com/bfs/archive/86848c76a76fe46d84d6ef1ab735d9398ed3ee8e.png",
            text: "解析成功",
            highlight: true,
            silent: false,
            timeout: 10000,
            onclick: function () {},
            ondone() {}
        });
    }
})();
