// ==UserScript==
// @name         BiliBili直播间本地解析(Miro)·茶叶改
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  基于Miro_355的b站解析脚本(https://www.bilibili.com/video/BV1AP411x7YW/)
// @author       Miro(https://vrchat.com/home/user/usr_20b8e0e4-9e16-406a-a61d-8a627ec1a2e3)、-茶叶子-(https://vrchat.com/home/user/usr_411b8ebe-a9a9-4987-a4c8-5e17c898a311)
// @match        https://live.bilibili.com/*
// @downloadURL  https://raw.githubusercontent.com/teatube/BiliAnalysis/main/BiliRoomAnalysis.user.js
// @updateURL    https://raw.githubusercontent.com/teatube/BiliAnalysis/main/BiliRoomAnalysis.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    var buttonsContainer;

    function createButton(text, clickHandler, isExpanded) {
        var button = document.createElement("button");
        button.textContent = text;
        // button.style.width = "120px";
        button.style.align = "center";
        button.style.color = "#FFFFFF";
        button.style.background = "#00AEEC";
        button.style.border = "1px solid #F1F2F3";
        button.style.borderRadius = "6px";
        button.style.fontSize = '14px';
        button.style.padding = "8px";
        button.style.marginLeft = '8px';

        button.addEventListener("click", function () {
            clickHandler();
            if (isExpanded) {
                button.textContent = "展开解析";
            } else {
                button.textContent = "收回解析";
            }
            isExpanded = !isExpanded;
        });
        return button;
    }

    function toggleButtonsVisibility() {
        if (buttonsContainer.style.display === "none") {
            buttonsContainer.style.display = "block";
        } else {
            buttonsContainer.style.display = "none";
        }
    }

function addButtonContainer(json) {
    var likeComment = document.getElementsByClassName('flex-block')[0];
    if (!likeComment){
        likeComment = document.getElementsByClassName('left-entry')[0];
    }

    buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "none"; // 初始状态为已折叠

    var toggleButton = createButton("展开解析", toggleButtonsVisibility, false);
    likeComment.appendChild(toggleButton);
    function toggleButtonsVisibility() {
        if (buttonsContainer.style.display === "none") {
            buttonsContainer.style.display = "block";
            toggleButton.textContent = "收回解析"; // 更新按钮文字
        } else {
            buttonsContainer.style.display = "none";
            toggleButton.textContent = "展开解析"; // 更新按钮文字
        }
    }

    var hlsStream = json.data.playurl_info.playurl.stream.find(function (stream) {
        return stream.protocol_name === 'http_hls';
    });
    var formatCount = {}; // 用于记录每个 format_name 的计数

    if (hlsStream) {
            for (var formatIndex = 0; formatIndex < hlsStream.format.length; formatIndex++) {
                var formatName = hlsStream.format[formatIndex].format_name;


                for (var codecIndex = 0; codecIndex < hlsStream.format[formatIndex].codec.length; codecIndex++) {
                    var baseurl = hlsStream.format[formatIndex].codec[codecIndex].base_url;
                    var urlInfoArray = hlsStream.format[formatIndex].codec[codecIndex].url_info;

                    for (var urlIndex = 0; urlIndex < urlInfoArray.length; urlIndex++) {
                        (function(host, extra) {
                            var roomurl = host + baseurl + extra;
                            if (!formatCount[formatName]) {
                                formatCount[formatName] = 1;
                            } else {
                                formatCount[formatName]++;
                            }
                            var buttonLabel = formatName + "解析" +formatCount[formatName];

                            var button = createButton(buttonLabel, function () {
                                navigator.clipboard.writeText(roomurl).catch(e => console.error(e));
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
                            });

                            buttonsContainer.appendChild(button);
                        })(urlInfoArray[urlIndex].host, urlInfoArray[urlIndex].extra);
                    }
                }
            }
    } else {
        // 在界面上显示未找到 http_hls 流的提示
        var errorMessage = document.createElement("div");
        errorMessage.textContent = "未找到 http_hls 流。";
        buttonsContainer.appendChild(errorMessage);
    }

    likeComment.appendChild(buttonsContainer);
}

    function fetchAndAddButtons() {
        var url = window.location.href;
        var Roomid = /(?<=com\/).*?(?=\?|$)/;
        var Roomid1 = url.match(Roomid);
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=' + Roomid1 + '&protocol=0,1&format=0,1,2&codec=0,1&qn=10000&platform=web&ptype=8&dolby=5&panorama=1', true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = JSON.parse(httpRequest.responseText);
                addButtonContainer(json);
            }
        };
    }

    setTimeout(fetchAndAddButtons, 5000);
})();
