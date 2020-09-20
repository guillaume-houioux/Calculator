var blank = false;
function init()  
{
    var buttons = document.querySelectorAll("button");
    for(var i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("click", cl());
    }
}
function cl()
{
    return function() 
    {
        var op = this.id;

        if(op == "=")
        {
            $("lastOp").innerText = $("result").value + "=";
            try 
            {
                $("result").value = Number(eval($("result").value).toFixed(10));
            }
            catch(SyntaxError)
            {
                $("result").value = "Invalid operation";
            }
            blank = true;            
        }
        else 
        {
            if(blank)
            {
                $("result").value = "";
                blank = false;
            }
            $("result").value += op;
        }
    }
}
(function() 
{
    var fired = 0;
    var timer = null;
	function onReady(ev) 
	{
		if (timer) 
		{
            clearTimeout(timer);
        }
		if (fired) 
		{
            return false;
        }
		if (document.readyState == "complete") 
		{
            fired = 1;
            window.removeEventListener("load", onReady, false);
            document.removeEventListener("DOMContentLoaded", onReady, false);
            document.removeEventListener("readystatechange", onReady, false);
            init();
		} 
		else 
		{
            timer = setTimeout(onReady, 1);
        }
    }
    window.addEventListener("load", onReady, false);
    document.addEventListener("DOMContentLoaded", onReady, false);
    document.addEventListener("readystatechange", onReady, false);
    timer = setTimeout(onReady, 10);
	if (document.readyState == "complete") 
	{
        onReady();
    }
} ());