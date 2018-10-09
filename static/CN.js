 
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
var amm_itm = 0;
var amm_amm = 0;
var occ = 0;
var taxx = 0;
var tax_m = 0;
var interstate = false;
var saleItm = [];

$("#fetch").click(function(){
    $.get("/fetch_sale/"+$("#inv_no").val(),function(sale){
        console.log(sale);
        $("#customer_name").val(sale.customer_name);
        $("#customer_id").val(sale.customer_id);
        $("#customer_address").val(sale.customer_address);
        $("#state").val(sale.state);
        $("#place_of_supply").val(sale.place_of_supply);
        $("#reg").val(sale.reg);
        $("#GSTN").val(sale.GSTN);
		saleItm = sale.items;
        interstate = (($("#us").val()!=$("#place_of_supply").val()));
        if(interstate){
            console.log(88);
            $(".inter").removeClass("hid");
            $(".intra").addClass("hid");
        } else{
            console.log(89);
            $(".intra").removeClass("hid");
            $(".inter").addClass("hid");
        }

    } );
});

showTax = function(){
	if($("#amm_itm").val()=="Amount"){
		if(interstate){
			console.log(taxx);
			$("#igst").val(1+taxx-1);
			$("#cgst #sgst").val(0);
		}else{
			$("#igst").val(0);
			$("#cgst").val((1+taxx-1)/2);
			$("#sgst").val((1+taxx-1)/2);
		}
    }
    else{
		if(interstate){
			console.log(tax_t);
			$("#igst").val(1+tax_t-1);
			$("#cgst #sgst").val(0);
		}else{
			$("#igst").val(0);
			$("#cgst").val((1+tax_t-1)/2.0);
			$("#sgst").val((1+tax_t-1)/2.0);
		}
    }
}

$("#amm_itm").change(function(){
    if($(this).val()=="Item"){
        $(".itm").removeClass("hid");
        $(".amount").addClass("hid");
        $("#amount_payable").val((amm+tax_t+occ).toFixed(2));
    } else{
        $(".itm").addClass("hid");
        $(".amount").removeClass("hid");
        $("#amount_payable").val(amm_amm+taxx+occ);
    }
	showTax();
});

$("#amount").change(function(){
    amm_amm = parseFloat($(this).val());
    if($("#calc").is(":checked")){
        t = parseFloat($("#taxxr").val());
		taxx = parseFloat(t*amm_amm)/100;
    } else{
        taxx = 0;
    }
    $("#amount_payable").val(amm_amm+taxx+occ);
	showTax();
});

$("#taxxr").change(function(){
    t = parseFloat($("#taxxr").val());
	taxx = parseFloat(t*amm_amm)/100;
    $("#amount_payable").val(amm_amm+taxx+occ);
	showTax();
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

$('#calc').change(function(){

	        if (this.checked) {
	        	$("#taxxr").removeAttr("disabled");
	        }else{
	            $("#taxxr").attr("disabled",true);
	            $("#taxxr").val("");
                taxx = 0;
	        }
   		});






		$("#item_name").autocomplete({
        source:function(request, response) {
            
                var mug=[];
                var sug = saleItm;
                for (i = 0; i < sug.length ; i++){
                    var t = {};
                    t.label = sug[i].name+","+sug[i].id;
                    t.value = sug[i].name;
                    mug.push(t);
                }
                console.log(mug);
                response(mug); // suggestions from jsonify
        },
        // appendTo: "#container",
        minLength: 0,
        select: function(event, ui) {
            // console.log(ui.item.value); // not in your question, but might help later
            item_id= ui.item.label.split(",")[1];
            // item = $.get("/fetch_item/"+item_id,function(data){
            // 	console.log("item data:"+(JSON.stringify(data)));
            // 	item = data;
            // 	curr_item = item;
            // });
			saleItm.forEach(function(itm) {
				if (itm.id == item_id){
					curr_item = itm;
					$("#quantity").attr("max",itm.quantity);
				}
			}, this);
            
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
	            $("#payment_method").val("");
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

   		$("#consignee_reg").change(function(){
   			if ($(this).val()=="Registered") {
   				$("#consignee_GSTN").removeAttr("disabled");
   			} else{
   				$("#consignee_GSTN").attr("disabled",true);
   				$("#consignee_GSTN").val("");
   			}
   		});

   		$('#cn').change(function(){

	        if (this.checked) {
	        	$(".con").removeAttr("disabled");
	        }else{
	            $(".con").attr("disabled",true);
	            $(".con").val("");
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
			if ($("#quantity").val()>$("#quantity").attr("max")) {
				alert("Quantity can not larger than sale quantity\nSale Quantity: "+$("#quantity").attr("max"));
				return null;
			}
			if ($("#rate").val()=="") {
				alert("Rate can not be blank");
				return null;
			}
			if ($("#discount").val()=="") {
				$("#discount").val("0");
			}
            if(!$("#calc").is(":checked")){
                curr_item.tax = 0;
            }
            // console.log(!$("#calc").is(":checked"));
			amount = parseFloat(($("#rate").val()*$("#quantity").val()*((100-$("#discount").val())/100.0)).toFixed(2));

			amm= amount + amm;
			tax = (amount*curr_item.tax/100);
			if (curr_item.tax>tax_m) {
				tax_m = curr_item.tax;
			}
			tax_t = tax_t +tax;
			curr_item.amount = amount;
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
				curr_item.quantity = $("#quantity").val();
				curr_item.rate = $("#rate").val();
				curr_item.discount = $("#discount").val();
				items.push(curr_item);
				console.log(items);
				$("#item_list").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.id+'</td><td class="col-xs-2">'+curr_item.HSN+'</td><td  class="col-xs-2">'+curr_item.quantity+curr_item.unit+'</td><td  class="col-xs-2">'+curr_item.rate+'</td><td  class="col-xs-2">'+curr_item.tax+'%</td></tr>');
				$("#item_list_").append('<tr class="row"> <td class="col-xs-2">'+curr_item.name+'</td> <td class="col-xs-2">'+curr_item.discount+'</td><td class="col-xs-2">'+curr_item.amount+'</td><td  class="col-xs-2">'+curr_item.CGST+'</td><td  class="col-xs-2">'+curr_item.SGST+'</td><td  class="col-xs-2">'+curr_item.IGST+'</td></tr>');

			$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
			showTax();
			});
			
		});

		$("#tds2").change(function(){
			tds2 = 1.0*($(this).val());
			$("#amount_payable").val((amm+tax_t+occ).toFixed(2));
            if($("#amm_itm").val()=="Amount"){
                $("#amount_payable").val(amm_amm+taxx+occ);
            }
			showTax();
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
            console.log($("#amm_itm").val());
            if($("#amm_itm").val()=="Amount"){
                $("#amount_payable").val(amm_amm+taxx+occ);
            }
			showTax();
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
            if($("#amm_itm").val()=="Amount"){
                data.amount = $("#amount").val();
                data.tax = taxx;
            } else{
                data.items = items;
                data.tax = tax_t;
                data.amount = amm;
            }
			x = {};
			x.c = JSON.stringify(data);
			console.dir(data);
			$(".disabled").each(function(i,obj){
				$(this).attr("disabled", true);
			});
			$.ajax({
				type: "POST",
				url: "/CN/",
				data: x,
				success: function(result){
					console.log(result);
					$("#submit").button("reset");
					// result = 0;
					if (result == 0) {
						$("#err").removeClass("hid alert-success").addClass("alert-danger");
						$("#err").html("This message should not be seen you will be cursed now!");
						$('html,body').scrollTop(0);
					}

					else {
						$("#err").removeClass("hid alert-danger").addClass("alert-success");
						$("#err").html("Buddy its Alpha version, if you're testing, Seems to me it worked. if you're not testing, just go away, this aint no game! (-_-)");
						$("#item_list").html('<tr class="row"> <th class="col-xs-2">Item Name</th> <th class="col-xs-2">Item code</th><th class="col-xs-2">HSN</th><th  class="col-xs-2">Quantity</th><th  class="col-xs-2">Rate</th><th  class="col-xs-2">Tax</th></tr>');
						$("#item_list_").html('<tr class="row"> <th class="col-xs-2">Item Name</th><th class="col-xs-2">discount</th> <th class="col-xs-2">Amount</th><th class="col-xs-2">CGST</th><th class="col-xs-2">'+$("#stut").text()+'</th><th  class="col-xs-2">IGST</th></tr>');
						$("#form")[0].reset()
						$('html,body').scrollTop(0);
					}
				}
			});
		});
});