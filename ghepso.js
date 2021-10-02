audioExactly = new Audio('./mp3/a.mp3');
audioPass = new Audio('./mp3/b.mp3');
audioWin = new Audio('./mp3/c.mp3')

const loadHtml = () => {
    const url = "https://6152ead9c465200017d1a870.mockapi.io/ghepSo";
    var levelElement = document.querySelector('#selectLevel');
    var minTimeElement = document.querySelector('.minTime');

    // tạo option level
    for (let i = 0; i < 10; i++) {
        let option = `<option value="${i + 1}">Level ${i + 1}</option>`
        levelElement.innerHTML += option
    }
    //select level
    const onChangeSelect = (e) => {
        let level = e.target.value;
        selectLevel(level);
        handlePlaying(url, minTimeElement, level,levelElement);
        Scores();
        getMinTime(url, minTimeElement, level)
    }


    // load lần đầu
    selectLevel(1);
    handlePlaying(url, minTimeElement, 1,levelElement);
    Scores();
    getMinTime(url, minTimeElement, 1);

    levelElement.addEventListener('change', onChangeSelect);
}
// function tạo trò chơi theo level
const selectLevel = (level) => {
    var contentElement = document.querySelector('.content .row');
    var arrValue = [];
    var test2 = 0;
    
    const randomValue = (arrValue) => {
        let value = Math.floor(Math.random() * level * 12 / 2);
        test2 = 0;
        for (let i = 0; i < arrValue.length; i++) {
            if (value == arrValue[i] && test2 == 0) {
                test2++;
            } else if (value == arrValue[i] && test2 == 1) {
                test2 = 0;
                return randomValue(arrValue);
            }
        }
        return value;
    }

    contentElement.innerHTML = '';
    //tạo item và random value theo cặp
    for (let i = 0; i < level * 12; i++) {
        let value = randomValue(arrValue);
        arrValue.push(value);
        let card = `<div class="item col-1"><div class="card" index="${i}"  value ="${value}">${value}</div></div>`
        contentElement.innerHTML += card;
    }
    // ẩn value sau 2s
    setTimeout(() => {
        contentElement.querySelectorAll('.item div').forEach((element) => {
            element.parentElement.style.transform = 'rotateX(360deg)';
            element.innerHTML = '?'
        })
    }, 2000);
}
// xử lý sự kiên khi chơi
const handlePlaying = (url, minTimeElement, level,levelElement) => {
    var itemElements = document.querySelectorAll('.item div');
    var dem = 0;
    var value;
    var index;
    var firstElement;
    // xử lý sự kiện khi click vào item 
    const handleSelectItem = (e) => {
        var attr = e.target.attributes;
        var ngat;
        
        if (value == attr.value.nodeValue && index != attr.index.nodeValue) {
            // khi hai element có cùng value
            let newE = e.target;
            let newF = firstElement;

            // hiệu ứng khi click
            clearTimeout(ngat);
            newE.parentElement.style.transform = 'rotateX(0deg)';
            newE.innerHTML = attr.value.nodeValue;

            newF.parentElement.style.transform = 'rotateX(0deg)';
            newF.innerHTML = attr.value.nodeValue;
            
            
            //ẩn đi element khi click vào hai element có cùng value
            setTimeout(() => {
                // âm thanh
                audioExactly.play();

                newE.parentElement.style.width = '0px';
                newE.parentElement.style.margin = '0px';
                newE.parentElement.style.padding = '0px';
                newF.parentElement.style.width = '0px';
                newF.parentElement.style.margin = '0px';
                newF.parentElement.style.padding = '0px';
            }, 1000);

            dem++;
            // qua màn
            if (dem == level * 12 / 2) {
                let text = document.querySelectorAll('.scores span');
                let name = document.querySelector('.player input').value;
                name = name ? name : 'Ẩn Danh';

                let h = text[0].innerHTML
                let m = text[1].innerHTML
                let s = text[2].innerHTML
                let time = s * 1 + m * 60 + h * 60 * 60;
                let data = {
                    name: name,
                    time: time,
                    level: level,
                }
                pulPlayer(url, data);
                winGame(url,minTimeElement, level,levelElement);
                clearInterval(lap);
                if (level==10) audioWin.play()
                else audioPass.play();
            }

        } else {
            // khi click vào item
            e.target.parentElement.style.transform = 'rotateX(0deg)';
            e.target.innerHTML = attr.value.nodeValue;
            ngat = setTimeout(() => {
                e.target.parentElement.style.transform = 'rotateX(360deg)';
                e.target.innerHTML = '?'
            }, 1500);
            // lưu lại element gần nhất để so ánh với lần sau
            firstElement = e.target;
            value = attr.value.nodeValue;
            index = attr.index.nodeValue;

        }
    }

    itemElements.forEach(element => {
        element.addEventListener('click', handleSelectItem)
    });

}

// bộ đếm thời gian
var lap;
const Scores = () => {
    var h = 0;
    var m = 0;
    var s = 0;
    var text = document.querySelectorAll('.scores span');

    const Start = () => {
        s++;
        if (s < 10) {
            text[2].innerHTML = "0" + s;
        } else {
            if (s < 60) {
                text[2].innerHTML = s;
            } else {
                s = 00;
                m++;
                if (m < 10) {
                    text[1].innerHTML = "0" + m;
                } else {
                    if (m < 60) {
                        text[1].innerHTML = m;
                    } else {
                        m = 00;
                        h++;
                        if (h < 10) {
                            text[0].innerHTML = "0" + h;
                        } else {
                            text[0].innerHTML = h;
                        }
                    }
                }
            }
        }
    }


    clearInterval(lap);
    lap = setInterval(Start, 1000)


}

// lấy kết quả tốt nhất của trò chơi
const getMinTime = (url, minTimeElement, level) => {
    fetch(url)
        .then((response) => {

            return response.json()

        })
        .then(function (data) {
            let arrTimeLevel = data.filter((element) => element.level == level);
            let min = arrTimeLevel[0].time
            
            let userTimeMin;

            arrTimeLevel.forEach((element) => {
                min = min > element.time ? element.time : min;
            })
            arrTimeMin = arrTimeLevel.filter(element => element.time == min);
            minTimeElement.innerHTML = `<h5 class="text-center">Nhanh nhất</h5>`
            arrTimeMin.forEach(element => {
                let s = element.time;
                let m = Math.floor(s / 60);
                s = m > 0 ? s - m * 60 : s;
                s = s < 10 ? '0'+s :s; 
                let h = Math.floor(m / 60);
                h = h < 10 ? '0' + h : h;
                m = h > 0 ? m - h * 60 : m;
                m = m < 10 ? '0' + m : m;

                userTimeMin = `<div class="userTimeMin">${element.name} (${h}:${m}:${s})</div>`;
                minTimeElement.innerHTML += userTimeMin;
            })
        })


}
// lưu lại kết quả khi chơi xong 1level
const pulPlayer = (url, dt) => {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dt),
    })
    .then(response => response.json())
    .then(data => {
        console.log('success', data)
    })
}
// xử lý khi chơi xong 1 level
const winGame = (url,minTimeElement, level,levelElement) => {
    var contentElement = document.querySelector('.content .row');
    const nextLevel = () => {
        level=level*1;
        levelElement.value=level+1
        selectLevel(level+1);
        handlePlaying(url, level+1);
        Scores();
        getMinTime(url, minTimeElement, level+1)
    
    }    

    var alert = `<div class="alert">
                    <h4 class="">Game là dễ</h4>
                    <button  class="btn btn-warning"> Tiếp theo </button>
                </div>`;

    var alertOver = `<div class="alert">
                    <h4 class="">Game là dễ! Bạn là TRÙM!</h4>
                </div>`;

    if(level*1>=10){
        contentElement.innerHTML = alertOver;
    }else{
        contentElement.innerHTML = alert;
        contentElement.querySelector('button').addEventListener('click',nextLevel)
    }
}


