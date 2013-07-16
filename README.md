jquery.oneClickEdit
===================

jquery.oneClickEdit tranfsorms text in input or selection areas.

just say
	`$(".class").oneClickEdit(function(value){ 
		do_something(); 
	});`
for an inline-text or use the options below.


**global options**
-	success *(default: false)*  
	+	This function is required to postprocess the changes. The first parameter contain the value and the second the key in a selection.
-	class *(default: 'jq-oneClickEdit')*  
	+	Set the name of the classes.
	
**text options**
-	max *(default: 0)*  
	+	Specifies the maximum number of characters allowed in the <input> element.
-	space *(default: 10)*  
	+	The number of pixel added to the width.
	
**select options**
-	options *(default: false)*  
	+	Can hold a array or object with your selection options. 
	+	Can hold a function, which generate an array or object, also.
