(function($) {
	$.fn.citySelect = function(settings) {
		if(this.length<1) {
			return;
		};

		settings = $.extend({
			url:"../shopInformation.js",
			prov:null,
			city:null,
			dist:null,
		},settings);

		var box_obj = this;
		var prov_obj = box_obj.find(".prov");
		var city_obj = box_obj.find(".city");
		var dist_obj = box_obj.find(".dist");
		var prov_val = settings.prov;
		var city_val = settings.city;
		var dist_val = settings.dist;
		var city_json;

		var cityStart = function() {
			var temp_html = "";
			temp_html += "<option>-请选择-</option>";
			var prov_id = prov_obj.get(0).selectedIndex - 1;
			console.log(prov_id);
			if(prov_id < 0 || "undefined" == city_json.citylist[prov_id].c){
				dist_obj.css("visibility","hidden");
				return;
			};

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
				};
				return;
			};

			$.each(city_json.citylist[prov_id].c[city_id].a,function(i,dist){
				temp_html += "<div><h2>" + dist.s[0].name + "</h2><h3>" + dist.s[0].address + "</h3><h4>" + dist.s[0].tel + "</h4></div>";
			});
			dist_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
		};

		var init=function() {
			var temp_html = "",
					option_html = "<option>-请选择-</option>";
			temp_html += option_html;
			$.each(city_json.citylist,function(i,prov) {
				temp_html += "<option value='" + prov.p + "'>" + prov.p + "</option>";
			});
			prov_obj.html(temp_html);
			city_obj.html(option_html);
			$('.prov').find('option:eq(0)').attr("selected",true);
			$('.city').find('option:eq(0)').attr("selected",true);
			setTimeout(function() {
				if(settings.prov != null){
					prov_obj.val(settings.prov);
					cityStart();
					setTimeout(function() {
						if(settings.city != null){
							city_obj.val(settings.city);
							distStart();
							setTimeout(function() {
								if(settings.dist != null){
									dist_obj.val(settings.dist);
								};
							},1);
						};
					},1);
				};
			},1);

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