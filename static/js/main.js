$(function () {
    var areaPeople;
    LoadAllLocations();
    $(".area").mouseover(function (e) {
        $('path').attr('class', function (index, classNames) {
            return classNames.replace('default', '');
        });
        ShowInfo(e);
    }).mouseout(
        function () {
            $(".follow").html('').removeClass()
        });

    function ShowInfo(e) {
        $(".showArea").text($(e.currentTarget).attr("data-area"));
        // console.log($(e.currentTarget).context.id)
        areaPeople.find(function (item, index, array) {
            if (item.LID == $(e.currentTarget).context.id) {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
            }
        });

        //cursor show area 
        $("#follow").addClass("follow");
        window.onmousemove = function (ev) {
            var ev = ev || window.event;
            var oLeft = ev.clientX + 40;
            var oTop = ev.clientY + 30;
            $(".follow").css({
                'display': 'block',
                'left': oLeft + 'px',
                'top': oTop + 'px'
            }).text($(e.currentTarget).attr("data-area"));
        }
    }

    function LoadAllLocations() {
        fetch('http://127.0.0.1:5000/gym').then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })).then(res => {
                areaPeople = res.data.locationPeopleNums
                // console.log(areaPeople[0].LID)
                InitView();
            }));
    }

    function InitView() {
        areaPeople.find(function (item, index, array) {
            if (item.LID == "BTSC") {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
            }
        });
    }
})