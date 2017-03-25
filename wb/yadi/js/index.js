$(function() {
	var dpr = lib.flexible.dpr,
			width = 0,
			i = 1;
  	new Spinner({color:'#fff',width:3*dpr,radius:11*dpr,length:8*dpr}).spin(document.getElementById('preview'));

  	var animation = function() {
  		if(i == 100) {
  			clearInterval(animationInterval);
  			$(".loading-content").addClass("opacity");
  			$(".index-content").show();
  			setTimeout(function() {
  				$(".loading-content").hide();
  			}, 2000);
  		}
  		width += 0.06;
  		$(".loading-animation").animate({"width": width+"rem"},35);
  		$(".loading-number").html(i + "%");
  		i++;
  	};

  	var animationInterval = setInterval(animation, 50);

	$(".rule").click(function() {
		$(".popup-rule").show();
		$(".rule").hide();
	});

	$(".overlay, .close, .know").click(function() {
		$(".popup").hide();
		$(".popup-rule").hide();
		$(".rule").show();
	});

	$('button').click(function() {
		var name = $("input[type='name']").val().replace(/(^\s*)|(\s*$)/g,"").replace(/\s+/g,""),
			  phone = $("input[type='tel']").val().replace(/(^\s*)|(\s*$)/g,""),
			  reward = '',
			  peopleNumber = 0;
		if(name === '') {
			$(".error").html("请输入您的姓名!");
			$(".popup").show();
  		return false;
		}
		if(!(/^[\u4e00-\u9fa5 ]{2,8}$/).test(name)) {
			$(".error").html("请正确输入您的姓名!");
			$(".popup").show();
	    return false;
		}
		if(phone === '') {
			$(".error").html("请输入您的手机号码!");
			$(".popup").show();
  		return false;
		}
		if(!(/^1[34578]\d{9}$/.test(phone))) {
			$(".error").html("请正确输入手机号码!");
			$(".popup").show();
      return false;
  	}
  	$.ajax({
      type: "POST",
      url: "identity.php",
      data: {username: name, phone: phone},
      dataType: "json",
      beforeSend: function() {
  			$(".popup-spin").show();
      },
      complete: function() {
				$(".popup-spin").hide();
      },
      success: function(data) {
      	if(data.status === 0) {
					$(".index-content").addClass("out");
			  	$(".luckdraw-content").show();
			  	setTimeout(function() {
			  		$(".luckdraw-content").addClass("in");
			  		$(".index-content").hide();
			  	}, 600);
			  	switch(data.data.prize) {
			  		case 1000 :
			  			reward = "二";
			  			peopleNumber = 2000;
			  			break;
			  		case 158 :
			  			reward = "三";
			  			peopleNumber = 36300;
			  			break;
			  		case 88 :
			  			reward = "四";
			  			peopleNumber = 48000;
			  			break;
			  		case 58 :
			  			reward = "五";
			  			peopleNumber = 9600;
			  			break;
			  	}
			  	$(".reward").html("恭喜" + phone + "<br>获得" + reward + "等奖");
			  	$(".people-number").html(peopleNumber);
			  	$(".red-number").html(data.data.prize);
			  	$("#shop-information").citySelect({
						prov : data.data.origin.region,
						city : data.data.origin.city,
						flag : 2
					});
      	} else {
      		$(".error").html("该手机号已经领过奖了！");
					$(".popup").show();
      		return false;
      	}
	    },
	    error: function() {
	    	$(".error").html("服务器繁忙，请稍候重试！");
				$(".popup").show();
      	return false;
	    }
    });
	});

	$("i").click(function() {
		$(this).addClass("scale");
		setTimeout(function() {
			$(".luckdraw-content").removeClass("in");
			$(".luckdraw-content").addClass("out");
    		$(".lookreward-content").show();
		}, 500);
  	setTimeout(function() {
  		$(".lookreward-content").addClass("in");
  		$(".luckdraw-content").hide();
  	}, 1100);
  	setTimeout(function() {
  		if(window.flag_default) {
  			$(".popup").show();
  		}
  	}, 1900);
	});

	$("#shop-information").citySelect({flag: 1});
});