const express = require('express');
const http = require('http');

// express로 서버 생성. server에 서버 객체 담았음
const app = express();
const server = http.createServer(app);
const fs = require('fs');

// socket.io 모듈을 불러온다..
const io = require('socket.io')(server);


// express 객체가 src폴더에 접근할 수 있도록 설정하는 역할
app.use(express.static('src'));


/* express의 get메소드
    첫번째 파라미터 : 사용자가 접근할 url
    두번째 파라미터 : 첫번째가 ㅇㅋ되면 실행할 function
     ㄴ> req는 클라이언트가 요청한 사항의 정보 (요청 object)
     ㄴ> res는 서버가 클라이언트로 전송하는 정보 (응답 object)
=======================================================
index.html을 브라우저에 보이기 위해서 fs 모듈 사용
fs.readFile이 해당 역할. (파일 전체를 비동기로 읽어옴)
ㄴ> 파일명, 옵션(인코딩 문자열), 콜백함수 순서
=======================================================
res.writeHead() 부분  // http의 메소드임
ㄴ> 응답스트림에 의해 헤더와 상태코드를 작성함.
=======================================================
write() 부분
ㄴ> 응답 바디를 작성함.
=======================================================
end() 부분
ㄴ> 요청전송을 종료하는 역할.
*/
app.get('/', function(req, res) {
    fs.readFile('./src/index.html', (err, data)=> {
        if(err) throw err;
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        }).write(data).end();
    });
});

/*
connection : 소켓이 연결되면 호촐할 이벤트
ㄴ> 1) 그리고 이후 함수 실행
ㄴ>      on 메서드 : 이벤트 바인딩
ㄴ>      emit 메서드 : 이벤트 호출
ㄴ> 2) 콜백함수에는 파라미터로 socket. 이건 접속된 소켓의 객체
        ㄴ>  콜백함수 내부에 이벤트 리스너를 작성함.
 */
io.sockets.on('connection', function(socket) {

    // index.js 에서 newUserConnect 이벤트 발생 시켰을 때 여기서 받음
    // name이 같이 넘어온다.
    socket.on('newUserConnect', function(name) {
        socket.name=name;

        // updateMessage 이벤트 발생시킴
        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : name + '님이 접속했습니다.'
        });
    });

    socket.on('disconnect', function() {
        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : socket.name + '님이 퇴장했습니다.'
        });
    });

    socket.on('sendMessage', function(data) {
        data.name=socket.name;
        io.sockets.emit('updateMessage', data);
    });
});

// listen 메소드로 port설정. 
// 8080에 서버가 실행되면 아래 function이 실행됨.
server.listen(8080, function() {
    console.log('서버 실행중...');
});

