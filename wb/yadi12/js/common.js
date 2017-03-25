$(function() {
	$(".rule").click(function() {
		$(".popup-rule").show();
		$(".rule").hide();
	});

	$(".overlay, .close, .know").click(function() {
		$(".popup").hide();
		$(".popup-rule").hide();
		$(".rule").show();
	});
});