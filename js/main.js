$(function () {
    loadAllLocations();
    $(".area").hover(function (e) {
        ShowInfo(e);
    }).mouseout(
        function () {
            $(".follow").html('').removeClass()
        });

    function ShowInfo(e) {
        $(".showArea").text($(e.currentTarget).attr("data-area"));
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

    function loadAllLocations(){
		$.ajax({
			url: "http://booking.tpsc.sporetrofit.com/Home/loadAllLocations",
            type: "POST",
            headers: {'Access-Control-Allow-Origin': '*'},
			success: function(data, textStatus, jqXHR){
				lastRefreshTime = new Date();
				if(!data.allLocations){
					
					return;
				}
				data.allLocations.forEach(function(location){
                    var LID = location.LID;
                    console.log(location);
				});
				//updateLocationPeopleNum();
			},
			error: function(jqXHR, textStatus, errorThrown){				
			}
		});
	}

})