(function ( $ ) {
	// default config
	var default_config = {
			options: false
		,	success: false
		,	max: 0
		,	space: 10
		,	'class': 'jq-onClickEdit'
		}
	,	body = $("body")
	;
	
	$.fn.oneClickEdit = function(_i) {
		// process input
		var $t = $(this)
		,	c = $.extend({}, default_config)
		,	o = false;
		switch (true) {
		default:
		break; case ($.isArray(_i)):	// options array
			c.options = _i;
		break; case ($.isFunction(_i)): 	// success function
			c.success = _i;
		break; case (typeof(_i)=="object"):	// config array
			$.extend(c, _i);
		}
		
		// function
		$t.addClass(c['class']);
		if (!c.options) {
			// Text
			$t.bind("click", function() {
				var val = $t.text();
				o = $(document.createElement("input"))
				.addClass(c['class']+'-input')
				.val(val)
				.css({
					fontSize: $t.css('fontSize')
				,	fontFamily: $t.css('fontFamily')
				,	fontWeight: $t.css('fontWeight')
				,	letterSpacing: $t.css('letterSpacing')
				})
				.attr({
					maxlength: (c.max>0)?c.max:null
				})
				.bind("keypress keyup", function(e) {
					o.width($t.html($t.text(o.val()).html().replace(/ /g, "&nbsp;")).width() + c.space);
				})
				.bind("blur", function() {
					if (c.success && $.isFunction(c.success)) {
						if (c.success(o.val()) != false) {
							val = o.val();
						}
					} else {
						val = o.val();
					}
					$t.text(val).show();
					o.remove();
					o = false;
				});
				
				// insert only at the end!
				o.insertAfter($t.hide()).keyup().focus();
				return false;
			});
		} else {
			// Select
			$t.bind("click", function() {
				var opt = ($.isFunction(c.options))?c.options():c.options;
				var	dsp = $t.clone()
						.removeClass(c['class'])
						.addClass(c['class']+'-display')
				,	fnc = function(_o, _d) {
						if (!$.isNumeric(_d)) _d = 0;
						var grp = $(document.createElement("span"))
							.addClass(c['class']+'-'+((_d==0)?'group':'subgroup deep-'+_d))
							.hide()
						,	elms = $("")
						;
						$.each(_o, function(key, val) {
							var elm, sub;
							switch(typeof(val)) {
							default: 
								elms = elms.add(
									elm = $(document.createElement("span"))
									.addClass(c['class']+'-element')
									.attr('ref', key)
									.text(val)
									.bind('click', function(e){
										var ret = true;
										if (c.success && $.isFunction(c.success)) {
											ret = (c.success(key, val));
										}
										if (ret!=false) {
											dsp.text(val);
											$t.text(val);
										}
										sel.slideUp(function(){
											$t.show();
											o.remove();
										});
									})
									.appendTo(grp)
								);
							break; case 'object':
								elms = elms.add(
									elm = $(document.createElement("span"))
									.addClass(c['class']+'-wrapper')
									.append(
										$(document.createElement("span"))
										.addClass(c['class']+'-element')
										.text(key)
										.bind('click', function(e){
											if (sub.css('display')=='none') {
												console.log("hide other");
												console.log(elms);
												elms.stop().not(elm).slideUp();
											} else {
												console.log("show other");
												elms.stop().not(elm).slideDown();
											}
											sub.stop().slideToggle();
											
										})
									)
									.append(sub = fnc(val, _d+1))
									.appendTo(grp)
								);
							}
						});
						return grp;
					}
				,	sel = fnc(opt);
				o = $(document.createElement("span"))
					.addClass(c['class']+'-select')
					.append(dsp)
					.append(sel)
					.insertAfter($t.hide());
				sel.slideDown();
				return false;
			});
		}
		
	};
}( jQuery ));