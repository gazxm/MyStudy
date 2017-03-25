(function($) {
	$.fn.citySelect = function(settings) {
		if(this.length<1) {
			return;
		}

		settings = $.extend({
			url:"shopInformation.js",
			prov:null,
			city:null,
			dist:null,
			flag:null,
		},settings);

		var box_obj = this;
		var prov_obj = box_obj.find(".prov");
		var city_obj = box_obj.find(".city");
		var dist_obj = box_obj.find(".dist");
		var prov_val = settings.prov;
		var city_val = settings.city;
		var dist_val = settings.dist;
		var flag_val = settings.flag;
		var city_json;

		var cityStart = function() {
			var temp_html = "";
			temp_html += "<option>-请选择-</option>";
			var prov_id = prov_obj.get(0).selectedIndex - 1;
			if(prov_id < 0 || "undefined" == city_json.citylist[prov_id].c){
				dist_obj.css("visibility","hidden");
				return;
			}

			$.each(city_json.citylist[prov_id].c,function(i,city){
				temp_html += "<option value='" + city.n + "'>" + city.n + "</option>";
			});
			city_obj.html(temp_html);

			distStart();
		};

		var distStart = function() {
			var temp_html = "";
			var prov_id = prov_obj.get(0).selectedIndex - 1;
			var city_id = city_obj.get(0).selectedIndex - 1;
			dist_obj.empty().attr("disabled",true);
			if(prov_id < 0 || city_id < 0 || "undefined" == city_json.citylist[prov_id].c[city_id].a){
				if(settings.nodata == "none") {
					dist_obj.css("display","none");
				}else if(settings.nodata == "hidden") {
					dist_obj.css("visibility","hidden");
				}
				return;
			}

			$.each(city_json.citylist[prov_id].c[city_id].a,function(i,dist){
				temp_html += "<div class='h2'>门店地址：" + dist.s[0].address + "</div>";
			});
			dist_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
		};

		var init=function() {
			var temp_html = "",
					option_html = "<option>-请选择-</option>";
					flag = true;
			temp_html += option_html;
			$.each(city_json.citylist,function(i,prov) {
				temp_html += "<option value='" + prov.p + "'>" + prov.p + "</option>";
				if(prov.p == settings.prov) {
					$.each(prov.c,function(i,city) {
						if(city.n == settings.city) {
							flag = false;
						}
					});
				}
			});
			if(flag_val === 2) {
				if((settings.prov === null && settings.city === null) || flag) {
					$(".error").html("未能根据你的手机号匹配到<br>门店信息,请手动查询！");
					window.flag_default = true;
				} else {
					setTimeout(function() {
							prov_obj.val(settings.prov);
							cityStart();
							setTimeout(function() {
								city_obj.val(settings.city);
								distStart();
							},1);
					},1);
				}
			}
			prov_obj.html(temp_html);
			city_obj.html(option_html);
			$('.prov').find('option:eq(0)').attr("selected",true);
			$('.city').find('option:eq(0)').attr("selected",true);

			prov_obj.bind("change",function() {
				cityStart();
			});

			city_obj.bind("change",function() {
				distStart();
			});
		};

		if(typeof(settings.url) === "string") {
			$.getJSON(settings.url,function(json) {
				city_json = json;
				init();
			});
		}
	};
})(jQuery);