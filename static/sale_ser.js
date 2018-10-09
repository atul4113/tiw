 
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

$('#date').datepicker({
	dateFormat: "yy-mm-dd"
});
$("#place_of_supply").change(function(){
	$.get("/states/", function(states){
		$("#place_of_supply_name").val(states[$("#place_of_supply").val()].name);
	});
	$.get("/session/",function(user){
			if(user.state == $("#place_of_supply").val()){
				curr_item.CGST = parseFloat((tax_t/2.0).toFixed(2));
				curr_item.SGST = parseFloat((tax_t/2.0).toFixed(2));
				curr_item.IGST = 0;
			}
			else{
				curr_item.CGST = 0;
				curr_item.SGST = 0;
				curr_item.IGST = parseFloat((tax_t).toFixed(2));
			}
		});
});

$("#state").val($("#us").val());

$("#place_of_supply").val($("#us").val());

$("#state").change(function(){
	$.get("/states/", function(states){
		$("#state_name").val(states[$("#state").val()].name);
	});
	$("#place_of_supply").val($("#state").val()).trigger("change")
});

$.get("/states/", function(states){
		$("#state_name").val(states[$("#state2").val()].name);
		Customer.state = $("#state2").val();
	});


$("#sale_size").change(function(){
	console.log($(this).val());
	if ($(this).val()=="<50K") {
		if ($("#reg").val()=="Unregistered") {
			$(".cust").removeAttr("required");
		}
	} else{
		$(".cust").attr("required",true);
	}
});

$("#tds1_rate").change(function(){
	$("#tds1").val((amm*$("#tds1_rate").val()/100).toFixed(2));
	$("#tds1").trigger("change");
	tds_t = tds_t+ (amm/100);
	$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
});

$("#tds2_rate").change(function(){
	$("#tds2").val((amm*$("#tds2_rate").val()/100).toFixed(2));
	$("#tds2").trigger("change");
});


var items = [];
var curr_item = {};
var Customer = {}
var tax_t = 0;
var tds_t = 0;
var tds2 = 0;
var amm = 0;
var occ = 0;
var tax_m = 0;

// $.get("/session/",function(user){
// 	$("#place_of_supply").val(user.state);
// });

		$("#customer_name").autocomplete({
        source:function(request, response) {
            $.getJSON("/auto_customer",{
                q: request.term, // in flask, "q" will be the argument to look for using request.args
            }, function(data) {
                var mug=[];
                var sug = data.suggestions;
                for (i = 0; i < sug.length ; i++){
                    var t = {};
                    t.label = sug[i].label+","+sug[i].value;
                    t.value = sug[i].label;
                    mug.push(t);
                }
                console.log(mug);
                response(mug); // suggestions from jsonify
            });
        },
        // appendTo: "#container",
        minLength: 1,
        select: function(event, ui) {
            // console.log(ui.item.value); // not in your question, but might help later
            Customer_id= ui.item.label.split(",")[1];
            $.get("/fetch_customer/"+Customer_id,function(data){
            	console.log("Customer data:"+(JSON.stringify(data)));
            	Customer = data;
            	$("#customer_id").val(Customer.id);
            	$("#customer_address").val(Customer.address);
            	$("#state").val(Customer.state);
            	$("#place_of_supply").val(Customer.state);
            	$("#state_name").val(Customer.state_name);
            	if (Customer.reg == 1) {
            		$("#reg").val("Registered");
            		$("#GSTN").attr("disabled", false);
            	} else {
            		$("#reg").val("Unregistered");
            		$("#GSTN").attr("disabled", true);
            	}
            	$("#GSTN").val(Customer.GSTN);
            });
            
        }
    });



$("#advance").autocomplete({
        source:function(request, response) {
            $.getJSON("/Customer_advance/"+Customer.id,{
                q: request.term, // in flask, "q" will be the argument to look for using request.args
            }, function(data) {
                response(data);
            });
        },
        // appendTo: "#container",
        minLength: 0
    });




	





		$("#item_name").autocomplete({
        source:function(request, response) {
            $.getJSON("/auto_item/",{
                q: request.term, // in flask, "q" will be the argument to look for using request.args
            }, function(data) {
                var mug=[];
                var sug = data.suggestions;
                for (i = 0; i < sug.length ; i++){
                    var t = {};
                    t.label = sug[i].label+","+sug[i].value;
                    t.value = sug[i].label;
                    mug.push(t);
                }
                console.log(mug);
                response(mug); // suggestions from jsonify
            });
        },
        // appendTo: "#container",
        minLength: 0,
        select: function(event, ui) {
            // console.log(ui.item.value); // not in your question, but might help later
            item_id= ui.item.label.split(",")[1];
            item = $.get("/fetch_item/"+item_id,function(data){
            	console.log("item data:"+(JSON.stringify(data)));
            	item = data;
            	curr_item = item;
            });
            
        }
    });


		$('#td').change(function(){

	        if (this.checked) {
	        	$(".tdd").removeAttr("disabled");
	        }else{
	            $(".tdd").attr("disabled",true);
	            $(".tdd").val("");
	        }
   		});

   		$('#oc').change(function(){

	        if (this.checked) {
	        	$(".occ").removeAttr("disabled");
	        }else{
	            $(".occ").attr("disabled",true);
	            $(".occ").val("");
	        }
   		});

   		$("#reg").change(function(){
   			if ($(this).val()=="Registered") {
   				$("#GSTN").removeAttr("disabled");
   				$(".cust").attr("required",true);
   			} else{
   				$("#GSTN").attr("disabled",true);
   				if ($("#sale_size").val()=="<50K") {
   					$(".cust").removeAttr("required");
   					}
   				$("#GSTN").val("");
   			}
   		});


		$("#add_item").click(function(){
			if ($("#item_name").val()!=curr_item.name) {
				alert("Choose item from dropdown only");
				return null;
			}
			if ($("#rate").val()=="") {
				alert("Rate can not be blank");
				return null;
			}
			if ($("#discount").val()=="") {
				$("#discount").val("0");
			}
			amount = parseFloat(($("#rate").val()*((100-$("#discount").val())/100.0)).toFixed(2));

			amm= amount + amm;
			tax = (amount*curr_item.tax/100);
			if (curr_item.tax>tax_m) {
				tax_m = curr_item.tax;
			}
			tax_t = tax_t +tax;
			curr_item.amount = amount;
			$.get("/session/",function(user){
				if(user.state == $("#place_of_supply").val() ){
					curr_item.CGST = parseFloat((tax/2.0).toFixed(2));
					curr_item.SGST = parseFloat((tax/2.0).toFixed(2));
					curr_item.IGST = 0;
				}
				else{
					curr_item.CGST = 0;
					curr_item.SGST = 0;
					curr_item.IGST = parseFloat((tax).toFixed(2));
				}
				curr_item.rate = $("#rate").val();
				curr_item.discount = $("#discount").val();
				items.push(curr_item);
				console.log(items);
				$("#item_list").append('<tr class="row"> <td class="col-xs-4">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.id+'</td><td class="col-xs-2">'+curr_item.HSN+'</td><td  class="col-xs-2">'+curr_item.rate+'</td><td  class="col-xs-2">'+curr_item.tax+'%</td></tr>');
				$("#item_list_").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.discount+'</td><td class="col-xs-2">'+curr_item.amount+'</td><td  class="col-xs-2">'+curr_item.CGST+'</td><td  class="col-xs-2">'+curr_item.SGST+'</td><td  class="col-xs-2">'+curr_item.IGST+'</td></tr>');

			$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
			});
			
		});

		$("#tds2").change(function(){
			tds2 = 1.0*($(this).val());
			$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
		});

		$(".occ").change(function(){
			var x = 0;
			$(".occ").each(function(i,obj){
				if ($(this).val()!="") {
					x = x + (1.0*$(this).val());
					console.log(x);
				}
			});
			x = x + tax_m*x/100;
			occ = x;
			console.log(occ);
			$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
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
			var data = queryStringToJSON(x);
			data.items = items;
			x = {};
			x.c = JSON.stringify(data);
			console.log(x);
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/sale/",
				data: x,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					
					if (result == 0) {	
						$("#err").removeClass("hid alert-success").addClass("alert-danger");
						$("#err").html("Item with this HSN already exist.");
						$('html,body').scrollTop(0);
					}

					else {
						$("#err").removeClass("hid alert-danger").addClass("alert-success");
						$("#err").html("Sale added successfully! You can continue adding more. <a href ='/print/sale/"+result+"'>Click here</a> To print the invoice.");
						$("#item_list").html('<tr class="row"> <th class="col-xs-4">Item Name</th> <th class="col-xs-2">Item code</th><th class="col-xs-2">HSN</th><th  class="col-xs-2">Rate</th><th  class="col-xs-2">Tax</th></tr>');
						$("#item_list_").html('<tr class="row"> <th class="col-xs-2">Item Name</th><th class="col-xs-2">discount</th> <th class="col-xs-2">Amount</th><th class="col-xs-2">CGST</th><th class="col-xs-2">'+$("#stut").text()+'</th><th  class="col-xs-2">IGST</th></tr>');
						$("#form")[0].reset()
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});