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
                                                <button onclick="editList()" id="edit_btn" class="edit_list">수정</button>
                                                <button onclick="deleteList('${name}')" id="del_btn" class="del_list">삭제</button>
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
        url: 'list/percent',
        data: {'name_give': name},
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


// progress bar
// function percent(type) {
//     let elem = document.getElementById('bar');
//     let width = elem.innerText;
//
//     if (type === 'down') {
//         width = parseInt(width) - 10;
//     } else if (type === 'up') {
//         width = parseInt(width) + 10;
//     }
//
//     elem.style.width = width + '%';
//     elem.innerHTML = width + '%';
// }


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