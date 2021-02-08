'use strict';

// socket.io 실행 후 해당 객체를 리턴 받아 socket 변수에 저장
var socket = io();

// 담겨진 변수로 connect 이벤트에 바인딩
// connect는 소켓이 연결되면 호출됨
socket.on('connect', function() {
    var name = prompt('닉네임 입력');

    // newUserConnect 이벤트 발생 & name 보냄
    // app.js 에서 받을 예정.
    socket.emit('newUserConnect', name);
});

var chatWindow = document.getElementById('chatWindow');
socket.on('updateMessage', function(data) {
    if(data.name === 'SERVER') {    // 서버에서 작성되어 전달되어오는 텍스트
        var info = document.getElementById('info');
        info.innerHTML = data.message;  // 서버에서 전달되면 innerHTML에 메시지만 삽입

        setTimeout(()=> {
            info.innerText ="";
        }, 1000);               // 1초뒤에 지워지라고
    }else { // 사용자가 작성하여 전달되어오는 텍스트
        var chatMessageEI = drawChatMessage(data);
        chatWindow.appendChild(chatMessageEI);
    }
});

function drawChatMessage(data){
    var wrap = document.createElement('p');
    var message = document.createElement('span');
    var name = document.createElement('span');
    var middle = ' : ';

    name.innerText = data.name;
    message.innerText = data.message;

    name.classList.add('output__user__name');
    message.classList.add('output__user__message');

    wrap.classList.add('output__user');
    wrap.dataset.id = socket.id;

    wrap.appendChild(name);
    wrap.append(middle);
    wrap.appendChild(message);

    return wrap;
}


var sendButton = document.getElementById('chatMessageSendBtn');
var chatInput = document.getElementById('chatInput');
sendButton.addEventListener('click', function() {
    var message = chatInput.value;

    if(!message) return false;

    socket.emit('sendMessage', {
        message
    });

    chatInput.value ="";
});r