
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

function queryStringToJSON(queryString) {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }
  var pairs = queryString.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return result;
}

$(document).ready(function () {
    

	$("#confirm_password").change(function(){
		var password = $("#password").val();
		var confirm_password = $("#confirm_password").val();
		if (password!=confirm_password) {
			document.getElementById("confirm_password").setCustomValidity("password do not match.");
		} else{
			document.getElementById("confirm_password").setCustomValidity("");
		}

	});

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
			var y = queryStringToJSON(x)
			console.log(JSON.stringify(y));
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/add_new_user/",
				data: x,
				success: function(result){

					console.log(result)
					$("#submit").button("reset");
					if (result == 1) {
						msg = "You've been successfully registered, <a href='/login/'>click here</a> to login.";
						post_redirect("/splash/",msg);
					}
					if (result == 0) {	
						$("#err").removeClass("hid");
						$("#err").html("This email has already been registered.");
					}
					if (result == -1) {
						$("#err").removeClass("hid");
						$("#err").html("This GSTN has already been registered.");	
					}
				}
			});
		});
});