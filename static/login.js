
var post_redirect = function(url,data){
	var form = document.createElement("form");
	form.method = 'post';
	form.action = url;
	var input = document.createElement('input');
	input.type = "text";
	input.name = "data";
	input.value = data;
	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
}

$(document).ready(function () {

		$("#form").submit(function(e){
			e.preventDefault();
			$("#submit").button("loading");
			$("#err").addClass("hid");
			$("#err").html("");
			$(".disabled").each(function(i,obj){
				$(this).removeAttr("disabled");
			});
			var x = $(this).serialize();
			console.log(x);
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/login/",
				data: x,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					if (result == 1) {
						window.location = "/";
					}
					if (result == 0) {	
						$("#err").removeClass("hid");
						$("#err").html("Email or password incorrect.")
					}
					if (result == -1) {
						$("#err").removeClass("hid");
						$("#err").html("Email or password incorrect.")	
					}
				}
			});
		});
});