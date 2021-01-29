$(document).ready(function () {
    $("#list_box").html("");
    showList();
});

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

function addList() {
    let name = $('#name').val();
    let goal = $('#goal').val();
    let now = $('#now').val();
    let how = $('#how').val();

    let username = randomName(6);

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
            data: {name_give: name, goal_give: goal, now_give: now, how_give: how, username_give: username},
            success: function (response) {
                if (response["result"] == "success") {
                    alert(response["msg"]);
                    window.location.reload();
                }
            }
        })
    }
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
                    let username = lists[i]['username'];

                    let tempHtml = `<li class="list_wrap clearfix">
                                        <div class="list_top">
                                            <h3 id="${username}-name" class="list_name">${name}</h3>
                                            <p id="${username}-goal" class="list_goal">${goal}</p>
                                            <textarea id="${username}-how-text" class="list_how_text" cols="30" rows="10"></textarea>
                                            <p id="${username}-how" class="list_how">${how}</p>
                                           
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
                                                <div id="${username}-btn-div" class="btn_div">
                                                    <button onclick="editList('${name}')" id="${username}-edit" class="edit_list">수정</button>
                                                    <button onclick="deleteList('${name}')" id="${username}-del" class="del_list">삭제</button>
                                                </div>
                                                <div id="${username}-edit-div" class="edit_div">
                                                    <button onclick="editComplete('${name}')" id="${username}-com" class="com_list">완료</button>
                                                    <button onclick="editCancel('${name}')" id="${username}-can" class="can_list">취소</button>
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
function editList(username) {
    showEdit(username);
    let how = $(`#${username}-how`).text();
    $(`#${username}-how-text`).val(how);
}

function showEdit(username){
    $(`#${username}-how-text`).show();
    $(`#${username}-edit`).show();

    $(`#${username}-how`).hide();
    $(`#${username}-btn-div`).hide();
}

function editComplete(username){
    let how = $(`#${username}-how-text`).val();

    $.ajax({
        type: 'POST',
        url: '/list/edit',
        data: { how_give: how, username_give: username},
        success: function (response) {
            if (response['result'] === 'success') {

                window.location.reload();
            }
        }
    })
}
function editCancel(username){
    $(`#${username}-how-text`).hide();
    $(`#${username}-edit-div`).hide();

    $(`#${username}-how`).show();
    $(`#${username}-btn-div`).show();
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