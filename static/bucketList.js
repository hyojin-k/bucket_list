$(document).ready(function () {
    $("#list_box").html("");
    showList();
});

function addList() {
    let name = $('#name').val();
    let goal = $('#goal').val();
    let now = $('#now').val();
    let how = $('#how').val();

    if (name === '') {
        alert('버킷리스트를 입력해주세요')
    } else if (goal === '') {
        alert('목표를 입력해주세요')
    } else if (now === '') {
        alert('현재 달성률을 입력해주세요')
    } else if (how === '') {
        alert('상세내용을 입력해주세요')
    } else {

        $.ajax({
            type: "POST",
            url: "/list",
            data: {name_give: name, goal_give: goal, now_give: now, how_give: how},
            success: function (response) {
                if (response["result"] == "success") {
                    alert(response["msg"]);
                    window.location.reload();
                }
            }
        })
    }
}

function randomName(length){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let charactersLength = characters.length;

    for(let i= 0; i<length; i++){
        let number = Math.random() * charactersLength;
        let index = Math.floor(number);
        result += charactoers.charAt(index);
    }
    return result;
}

function showList() {
    $.ajax({
        type: "GET",
        url: "/list",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let lists = response['bucketlists'];
                for (let i = 0; i < lists.length; i++) {
                    let name = lists[i]['name'];
                    let goal = lists[i]['goal'];
                    let now = lists[i]['now'];
                    let how = lists[i]['how'];

                    let tempHtml = `<li class="list_wrap clearfix">
                                        <div class="list_top">
                                            <h3 class="list_name">${name}</h3>
                                            <p class="list_goal">${goal}</p>
                                            <textarea class="list_how_text" cols="30" rows="10"></textarea>
                                            <p class="list_how">${how}</p>
                                           
                                        </div>
                                        <div class="list_bottom clearfix">
                                            <div class="progress_wrap">
                                                <button onclick="down('${name}')" class="down">-</button>
                                                <div class="progress">
                                                    <div id="bar" class="progress_bar" style="width: ${now}%;">${now}%</div>
                                                </div>
                                                <button onclick="up('${name}')" class="up">+</button>
                                            </div>
                                            <div class="btn_wrap">
                                                <div class="btn_div">
                                                    <button onclick="editList('${name}')" id="edit_btn" class="edit_list">수정</button>
                                                    <button onclick="deleteList('${name}')" id="del_btn" class="del_list">삭제</button>
                                                </div>
                                                <div class="edit_div">
                                                    <button onclick="editComplete('${name}')" id="com_btn" class="com_list">완료</button>
                                                    <button onclick="editCancel('${name}')" id="can_btn" class="can_list">취소</button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`

                    $('#list_box').append(tempHtml);
                }
            } else {
                alert("리뷰를 받아오지 못했습니다");
            }
        }
    })
}

//progress bar
function down(name) {
    $.ajax({
        type: 'POST',
        url: '/list/percent_down',
        data: {name_give: name},
        success: function (response) {
            if (response['result'] === 'success') {
                let elem = document.getElementById('bar');
                let width = elem.innerText;
                width = parseInt(width) - 10;
                elem.style.width = width + '%';
                elem.innerHTML = width + '%';
                window.location.reload();
            }
        }
    })
}

function up(name) {
    $.ajax({
        type: 'POST',
        url: '/list/percent_up',
        data: {name_give: name},
        success: function (response) {
            if (response['result'] === 'success') {
                let elem = document.getElementById('bar');
                let width = elem.innerText;
                width = parseInt(width) + 10;
                elem.style.width = width + '%';
                elem.innerHTML = width + '%';
                window.location.reload();
            }
        }
    })
}

// 리스트 수정
function editList(name) {
    showEdit(name);
    let how = $(`.list_how`).text();
    $(`.list_how_text`).val(how);
}

function showEdit(name){
    $('.list_how_text').show();
    $('.edit_div').show();

    $('.list_how').hide();
    $('.btn_div').hide();
}

function editComplete(name){
    let how = $('.list_how_text').val();

    $.ajax({
        type: 'POST',
        url: '/list/edit',
        data: {name_give: name, how_give: how},
        success: function (response) {
            if (response['result'] === 'success') {

                window.location.reload();
            }
        }
    })
}
function editCancel(name){
    $('.list_how_text').hide();
    $('.edit_div').hide();

    $('.list_how').show();
    $('.btn_div').show();
}

// 리스트 지우기
function deleteList(name) {
    $.ajax({
        type: 'POST',
        url: '/list/delete',
        data: {name_give: name},
        success: function (response) {
            if (response['result'] == 'success') {
                alert('리스트를 삭제했습니다.')
                window.location.reload();
            }
        }
    });
}