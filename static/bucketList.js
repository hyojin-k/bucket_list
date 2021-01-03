$(document).ready(function () {
    $("#list_box").html("");
    showList();
});

function addList() {
    let name = $('#name').val();
    let goal = $('#goal').val();
    let how = $('#how').val();

    if (name === ''){
        alert('버킷리스트를 입력해주세요')
    } else if (goal === ''){
        alert('목표를 입력해주세요')
    } else if (how === ''){
        alert('상세내용을 입력해주세요')
    }

    $.ajax({
        type: "POST",
        url: "/list",
        data: {name_give: name, goal_give: goal,how_give: how},
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["msg"]);
                window.location.reload();
            }
        }
    })
}

function showList() {
    $.ajax({
        type: "GET",
        url: "/list",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let lists = response['bucketlists'];
                for(let i = 0; i<lists.length; i++){
                    let name = lists[i]['name'];
                    let goal = lists[i]['goal'];
                    let how = lists[i]['how'];

                    let tempHtml = `<li class="list_wrap">
                                        <div class="list_top">
                                            <h3 class="list_name">${name}</h3>
                                            <p class="list_goal">${goal}</p>
                                            <p class="list_how">${how}</p>
                                           
                                        </div>
                                        <div class="list_bottom clearfix">
                                             <div class="progress">
                                              <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
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




// 리스트 지우기
function deleteList(name){
     $.ajax({
        type: 'POST',
        url: '/list/delete',
        data: {name_give:name},
        success: function (response) {
            if (response['result'] == 'success') {
                alert('리스트를 삭제했습니다.')
                window.location.reload();
            }
        }
    });
}