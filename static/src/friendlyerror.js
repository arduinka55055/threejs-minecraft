window.onerror = function (msg, urlget, line, col, error) {
    var Headerhtml = "Oops... serious error here!";
    var html = "Sorry for that, error may be fixed if you will contact ";
    var element = document.createElement("div");
    var header = document.createElement("div");
    var url = document.createElement("span");
    var textnode = document.createTextNode(html);
    var textHeader = document.createTextNode(Headerhtml);
    var errorContainer = document.createElement("div");
    var errormsg = document.createTextNode(msg+" ");
    var errorfile = document.createTextNode(urlget);
    var errorpos = document.createTextNode("Position: " + line + " line " + col + " column.");
    var header2 = document.createElement("div");

    var errorCloseT = document.createTextNode("×");
    var errorClose = document.createElement("div");

    header.appendChild(textHeader);
    errorContainer.appendChild(errormsg);
    errorContainer.appendChild(document.createElement("br"));
    errorContainer.appendChild(errorfile);
    errorContainer.appendChild(document.createElement("br"));
    errorContainer.appendChild(errorpos);
    errorClose.appendChild(errorCloseT);

    element.appendChild(errorClose);
    element.appendChild(header);
    element.appendChild(textnode);
    element.appendChild(url);
    element.appendChild(header2);
    element.appendChild(errorContainer);
    url.innerHTML = "here\n";
    header2.innerHTML = "More info:";
    element.id = "error";
    header.id = "errorH";
    header2.id = "errorB";
    errorContainer.id = "errorM";
    errorClose.id = "errorC";
    document.body.appendChild(element);
    element.addEventListener("touchstart", function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/error');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`error=${msg}&file=${urlget}&line=${line}`);
        document.body.removeChild(element);

    });
}