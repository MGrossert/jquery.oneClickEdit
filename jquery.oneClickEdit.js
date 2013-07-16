(function ( $ ) {
	// default config
	var default_config = {
			options: false
		,	success: false
		,	max: 0
		,	space: 10
		,	'class': 'jq-oneClickEdit'
		}
	,	body = $("body")
	;
	
	$.fn.oneClickEdit = function(_i) {
		// process input
		var me = $(this)
		,	c = $.extend({}, default_config);
		
		switch (true) {
		default:
		break; case ($.isArray(_i)):	// options array
			c.options = _i;
		break; case ($.isFunction(_i)): 	// success function
			c.success = _i;
		break; case (typeof(_i)=="object"):	// config array
			$.extend(c, _i);
		};
		
		// function
		me.addClass(c['class']);
		if (!c.options) {
			// Text
			me.bind("click", function() {
				var val = me.text()
				,	obj = $(document.createElement("input"))
					.addClass(c['class']+'-input')
					.val(val)
					.css({
						width: me.css('width')
					,	fontSize: me.css('fontSize')
					,	fontFamily: me.css('fontFamily')
					,	fontWeight: me.css('fontWeight')
					,	letterSpacing: me.css('letterSpacing')
					})
					.attr({
						maxlength: (c.max>0)?c.max:null
					})
					.bind("keypress keyup", function(e) {
						obj.width(me.html(me.text(this.value).html().replace(/ /g, "&nbsp;")).width() + c.space);
					})
					.bind("blur", function() {
						if (c.success && $.isFunction(c.success)) {
							if (c.success($o.val()) != false) {
								val = obj.val();
							}
						} else {
							val = obj.val();
						};
						me.text(val).show();
						obj.remove();
						obj = false;
					});
				
				// insert only at the end!
				obj.insertAfter(me.hide()).focus();
				return false;
			});
		} else {
			// Select
			me.bind("click", function() {
				var opt = ($.isFunction(c.options))?c.options():c.options
				,	forceClose = false
				,	close = function(e) {
						if(typeof(e)=='undefined' || obj.find(e.target).length == 0) {
							sel.slideUp(function(){
								me.show();
								obj.remove();
							});
							$(document).unbind("click", close);
						}
					}
				,	dsp = me.clone()
						.removeClass(c['class'])
						.addClass(c['class']+'-display')
				,	fnc = function(_o, _d) {
						if (typeof(_o) != "object") {
							console.log("wrong options type! type: " + typeof(_o));
							return false;
						};
						if (!$.isNumeric(_d)) _d = 0;
						var grp = $(document.createElement("span"))
							.addClass(c['class']+'-'+((_d==0)?'group':'subgroup deep-'+_d))
							.hide()
						,	elms = $("");
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
											ret = (c.success(val, key));};
										if (ret!=false) {
											dsp.text(val);
											me.text(val);
										};
										close();
									})
									.appendTo(grp)
								);
							break; case 'object':
								elms = elms.add(
									elm = $(document.createElement("span"))
									.addClass(c['class']+'-wrapper')
									.append(
										$(document.createElement("span"))
										.addClass(c['class']+'-text')
										.text(key)
										.bind('click', function(e){
											if (sub.css('display')=='none') {
												elms.stop().not(elm).slideUp();
												sub.stop().slideDown();
											} else {
												elms.stop().not(elm).slideDown();
												sub.stop().slideUp(function(){
													$('.'+c['class']+'-wrapper, .'+c['class']+'-element', elm).stop().show();
													$('.'+c['class']+'-subgroup', elm).stop().hide();
												});
											}
										})
									)
									.append(sub = fnc(val, _d+1))
									.appendTo(grp)
								);
							}
						});
						return grp;
					}
				,	sel = fnc(opt)
				,	obj = $(document.createElement("span"))
					.addClass(c['class']+'-select')
					.append(dsp)
					.append(sel)
					.insertAfter(me.hide());
				$(document).bind("click", close);
				sel.slideDown();
				return false;
			});
		}
		
	}
}( jQuery ));