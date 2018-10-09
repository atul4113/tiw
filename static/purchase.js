
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

$("#tds1_rate").change(function(){
	$("#tds1").val(parseFloat(amm*$("#tds1_rate").val()/100).toFixed(2));
	$("#tds1").trigger("change");
	tds_t = (amm*$("#tds1_rate").val()/100);
	// $("#amount_payable").val((amm+tax_t-tds_t-tds2+occ).toFixed(2));
});

$("#tds2_rate").change(function(){
	$("#tds2").val(parseFloat(amm*$("#tds2_rate").val()/100).toFixed(2));
	$("#tds2").trigger("change");
});

var items = [];
var curr_item = {};
var vendor = {}
var tax_t = 0;
var tds_t = 0;
var tds2 = 0;
var amm = 0;
var occ = 0;
var tax_m = 0;

$.get("/session/",function(user){
	$("#place_of_supply").val(user.state);
});

		$("#vendor_name").autocomplete({
        source:function(request, response) {
            $.getJSON("/auto_vendor",{
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
            vendor_id= ui.item.label.split(",")[1];
            $.get("/fetch_vendor/"+vendor_id,function(data){
            	console.log("vendor data:"+(JSON.stringify(data)));
            	vendor = data;
            	$("#vendor_id").val(vendor.id);
            	$("#vendor_address").val(vendor.address);
            	$("#state").val(vendor.state);
            	$("#state_name").val(vendor.state_name);
            	if (vendor.reg == 1) {
            		$("#reg").val("Registered");
            	} else if(vendor.reg==2){
            		$("#reg").val("Registered composition");
            	}
            	else {
            		$("#reg").val("Unregistered");
            	}
            	$("#GSTN").val(vendor.GSTN);
            	if (vendor.reg == 0) {
            		$("#reverse_charge").removeAttr("disabled");
            	}
            	else{
            		$("#reverse_charge").attr("disabled",true);
            		$("#reverse_charge").prop("checked",false);
            	}
            });
            
        }
    });

$("#advance").autocomplete({
        source:function(request, response) {
            $.getJSON("/vendor_advance/"+vendor.id,{
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
            $.getJSON("/vendor_item/"+vendor._id,{
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

		$("#paid").change(function(){
			if (this.checked) {
	        	$("#payment_method").removeAttr("disabled");
	        }else{
	            $("#payment_method").attr("disabled",true);
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

		$("#add_item").click(function(){
			if ($("#item_name").val()!=curr_item.name) {
				alert("Choose item from dropdown only");
				return null;
			}
			if ($("#quantity").val()=="") {
				alert("Quantity can not be blank");
				return null;
			}
			if ($("#rate").val()=="") {
				alert("Rate can not be blank");
				return null;
			}
			if ($("#discount").val()=="") {
				$("#discount").val("0");
			}
			if ($("#reg").val()=="Registered composition") {
				curr_item.tax = 0;
			}
			if ($("#reg").val()=="Unregistered" && !$("#reverse_charge").prop("checked")) {
				curr_item.tax = 0;
			}
			console.log($("#reverse_charge").prop("checked"));
			amount = parseFloat(($("#rate").val()*$("#quantity").val()*((100-$("#discount").val())/100.0)).toFixed(2));
			amm= amount + amm;
			tax = parseFloat((amount*curr_item.tax/100).toFixed(2));
			if (curr_item.tax>tax_m) {
				tax_m = curr_item.tax;
			}
			tax_t = tax_t +tax;
			curr_item.amount = parseFloat((amount).toFixed(2));
			$.get("/session/",function(user){
				if(user.state == $("#place_of_supply").val()){
					curr_item.CGST = parseFloat((tax/2.0).toFixed(2));
					curr_item.SGST = parseFloat((tax/2.0).toFixed(2));
					curr_item.IGST = 0;
				}
				else{
					curr_item.CGST = 0;
					curr_item.SGST = 0;
					curr_item.IGST = parseFloat((tax).toFixed(2));
				}
				curr_item.quantity = parseFloat(parseFloat($("#quantity").val()).toFixed(2));
				curr_item.rate = parseFloat(parseFloat($("#rate").val()).toFixed(2));
				curr_item.discount = parseFloat(parseFloat($("#discount").val()).toFixed(2));
				items.push(curr_item);
				console.log(items);
				$("#item_list").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.id+'</td><td class="col-xs-2">'+curr_item.HSN+'</td><td  class="col-xs-2">'+curr_item.quantity+'</td><td  class="col-xs-2">'+curr_item.rate+'</td><td  class="col-xs-2">'+curr_item.tax+'%</td></tr>');
				$("#item_list_").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.discount+'</td><td class="col-xs-2">'+curr_item.amount+'</td><td  class="col-xs-2">'+curr_item.CGST+'</td><td  class="col-xs-2">'+curr_item.SGST+'</td><td  class="col-xs-2">'+curr_item.IGST+'</td></tr>');

			});
			$("#amount_payable").val((amm+tax_t-tds_t-tds2+occ).toFixed(2));
		});

		$("#tds2").change(function(){
			tds2 = 1.0*($(this).val());
			// $("#amount_payable").val((amm+tax_t-tds_t-tds2+occ).toFixed(2));
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
			$("#amount_payable").val((amm+tax_t-tds_t-tds2+occ).toFixed(2));
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
			console.log(data);
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/purchase/",
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
						if($("#reg").val()=="Registered"){
							$("#err").html("Purchase added successfully! You can continue adding more.");
						}else{
							$("#err").html("Purchase added successfully! You can continue adding more.<a href ='/print/purchase/"+result+"'>Click here</a> To print the invoice.");
						}
						$("#item_list").html('<tr class="row"> <th class="col-xs-2">Item Name</th> <th class="col-xs-2">Item code</th><th class="col-xs-2">HSN</th><th  class="col-xs-2">Quantity</th><th  class="col-xs-2">Rate</th><th  class="col-xs-2">Tax</th></tr>');
						$("#item_list_").html('<tr class="row"> <th class="col-xs-2">Item Name</th><th class="col-xs-2">discount</th> <th class="col-xs-2">Amount</th><th class="col-xs-2">CGST</th><th class="col-xs-2">'+$("#stut").text()+'</th><th  class="col-xs-2">IGST</th></tr>');
						$("#form")[0].reset()
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});