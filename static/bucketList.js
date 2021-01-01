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

                    let tempHtml = `<li class="list_wrap clearfix">
                                        <div class="list_left">
                                            <h3 class="list_name">${name}</h3>
                                            <p class="list_goal">${goal}</p>
                                            <p class="list_how">${how}</p>
                                            <button onclick="editList()" id="edit_btn" class="edit_list">수정</button>
                                            <button onclick="deleteList()" id="del_btn" class="del_list">삭제</button>
                                        </div>
                                        <div class="list_right">
                    
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


