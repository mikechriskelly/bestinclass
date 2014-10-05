//callback handler for form submit
$('form').submit(function(e)
{
	var form = $(this);
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
	
    $.ajax(
    {
        url : formURL,
        type: "POST",
        data : postData,
        success:function(data, textStatus, jqXHR) 
        {
            //data: return data from server
			//$(form).html(data);
			$(form).hide();
			var formName = form.attr('id');
			$("#" + formName + "-message").removeClass("hidden");
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            //if fails
			alert("Error sending. Please try again.");
        }
    });
	e.preventDefault(); //STOP default action
    //e.unbind(); //unbind. to stop multiple form submit.
});