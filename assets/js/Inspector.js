var platform = "Android";
var sessionId = 0;
var canvas_x, canvas_y;
var deviceInfo;
var pagesource;
var elements = [], area = 0;
var query_name = null;
var query_type = null;
var t_element = 0;
var canvas_width = 0, canvas_height = 0;

$("#button_create_session").click(function () {
    CreateSession();
});

$("#button_delete_session").click(function () {
    DeleteSession();
});

$("#button_screenshot").click(function () {
    Screenshot();
});

$("#button_colorpicker").click(function () {
    $("#colorpicker").click();
});

$("#button_tap").click(function () {
    Tap();
});

$("#button_back").click(function () {
    Back();
});

$("#button_scroll_up").click(function () {
    Scroll_Y(0.2, 0.7);
});

$("#button_scroll_down").click(function () {
    Scroll_Y(0.7, 0.2);
});

$('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover'
})

function InitCanvas(scale) {
    canvas_width = $("#device_controler").width();
    canvas_height = canvas_width * parseFloat(scale);
    //console.log(canvas_width, canvas_height)
    $("#preview").attr("width", canvas_width);
    $("#preview").attr("height", canvas_height);
    $("#preview-pic").attr("width", canvas_width);
    $("#preview-pic").attr("height", canvas_height);
}

function CreateSession() {
    $.ajax({
        url: "http://127.0.0.1:4723/wd/hub/session",
        type: "POST",
        dataType: "json",
        data: {
            desiredCapabilities:
                {
                    newCommandTimeout: 600000,
                    platformName: "Android",
                    platformVersion: "6.0.1",
                    deviceName: "Android Device",
                    //automationName: 'uiautomator2',
                    appPackage: "com.android.settings",
                    appActivity: "com.android.settings.Settings"
                }
        },
        async: false,
        success: (function (data) {
            sessionId = data.sessionId;
            $.ajax({
                url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId,
                type: "GET",
                dataType: "json",
                async: false,
                success: (function (data) {
                    deviceInfo = data.value;
                    $("#session").text(sessionId);
                    Screenshot();
                }),
                error: (function (data) {
                    alert("Error!");
                })
            });

        }),
        error: (function (data) {
            alert("Error!");
        })
    });
};

function DeleteSession() {
    if (sessionId != 0) {
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId,
            type: "DELETE",
            async: false,
            success: (function () {
                $("#session").text("session");
                sessionId = 0;
                Draw("./assets/textures/phone.png");
                $("#element-list").empty();
            }),
            error: (function () {
                alert("Error!");
            })
        });
    }
};

function Screenshot() {
    if (sessionId != 0) {
        $("#element-list").empty();
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/screenshot",
            type: "GET",
            dataType: "json",
            async: false,
            success: (function (data) {
                InitCanvas(canvas_height / canvas_width);
                Draw("data:image/png;base64," + data.value);
                GetPageSource();
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
};

function Draw(url) {
    $("#preview-pic").attr("src", url);
    $("#preview").drawImage(
        {
            source: $("#preview-pic")[0],
            width: canvas_width,
            height: canvas_height,
            fromCenter: false
        }
    );
};

function GetCanvasPos(e) {
    if (sessionId != 0) {
        var can = $("#preview");
        cursor_x = e.clientX + document.body.scrollLeft;
        canvas_x = parseInt((cursor_x - parseInt(can.offset().left)) * parseInt(deviceInfo.deviceScreenSize.split("x")[0]) / can.width());
        cursor_y = e.clientY + document.body.scrollTop;
        canvas_y = parseInt((cursor_y - parseInt(can.offset().top)) * parseInt(deviceInfo.deviceScreenSize.split("x")[1]) / can.height());
        $("#cursor_pos").text("(" + canvas_x + "," + canvas_y + ")");
        $("#cursor_pos_percent").text("(" + parseInt((cursor_x - parseInt(can.offset().left)) * 100 / can.width()) + "%," + parseInt((cursor_y - parseInt(can.offset().top)) * 100 / can.height()) + "%)");
        //console.log(canvas_x, canvas_y);
    }
};

function GetPageSource() {
    $.ajax({
        url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/source",
        type: "GET",
        dataType: "json",
        async: false,
        success: (function (data) {
            var str = data.value.replace(/\\\"/g, "\"");
            pagesource = $($.parseXML(str));
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}

function GetElements(e) {
    if (sessionId != 0) {
        $("#element-list").empty();
        elements = [], area = 0;
        GetNodes(pagesource);
        $.each(elements, function (i, e) {
            $("#element-list").append(AddElement2List(e, i));
        });
        DrawRect($(elements[0]).attr('bounds'));
    }
};

function GetNodes(node) {
    node.children().each(function () {
        var chosen = false;
        bounds = $(this).attr('bounds');
        if (typeof bounds != "undefined") {
            var bound = bounds.match(/\d+/g);
            if (canvas_x > bound[0] && canvas_x < bound[2] && canvas_y > bound[1] && canvas_y < bound[3]) {
                t_area = (bound[2] - bound[0]) * (bound[3] - bound[1])
                if (area == 0) {
                    area = t_area;
                    elements.push(this);
                }
                else if (area < t_area)
                    elements.push(this);
                else if (area == t_area) {
                    if ($(this).attr("text") != "")
                        elements.unshift(this);
                    else {
                        tmp_e = elements[0];
                        elements.shift();
                        elements.unshift(this);
                        elements.unshift(tmp_e);
                    }
                }
                else {
                    area = t_area;
                    elements.unshift(this);
                }
            }
        }
        if ($(this).children.length > 0)
            GetNodes($(this));
    });
}

function AddElement2List(node, index) {
    var el_class = $(node).attr("class");
    var re_class = el_class.replace(/\./g, "_");
    var instance = $(node).attr("instance");
    var resourceid = $(node).attr("resource-id");
    var text = $(node).attr("text");
    var title = "[class]&nbsp;" + el_class + ":" + instance;
    var attrs = "";
    if (text != "")
        title = "[text]&nbsp;" + text;
    else if (resourceid != "")
        title = "[resource-id]&nbsp;" + resourceid;
    $.each(node.attributes, function (i, attrib) {
        attrs += attrib.name + ": " + attrib.value + "</br>";
    });
    if (index == 0) {
        var query = title.match(/\[(.*)\]\&nbsp\;(.*)/);
        query_type = query[1];
        query_name = query[2];
        return "<div class=\"panel panel-default\" index=\"0\"><div class=\"list-group-item active\"><a data-toggle=\"collapse\" onclick=\"ActiveTarget(event)\" data-parent=\"#element-list\" href=\"#collapse_" + re_class + "_" + instance + "\" style=\"color:black;font-weight:bold;\">" + title + "</a></div><div id=\"collapse_" + re_class + "_" + instance + "\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">" + attrs + "</div></div></div>";
    }
    else
        return "<div class=\"panel panel-default\" index=\"" + index + "\"><div class=\"list-group-item\"><a data-toggle=\"collapse\" onclick=\"ActiveTarget(event)\" data-parent=\"#element-list\" href=\"#collapse_" + re_class + "_" + instance + "\" style=\"color:black;font-weight:bold;\">" + title + "</a></div><div id=\"collapse_" + re_class + "_" + instance + "\" class=\"panel-collapse collapse\"><div class=\"panel-body\">" + attrs + "</div></div></div>";
}

function ActiveTarget(event) {
    $("#element-list").find(".list-group-item.active").attr("class", "list-group-item");
    $(event.target).parent(".list-group-item").attr("class", "list-group-item active");
    var index = parseInt($(".list-group-item.active").parent().attr("index"));
    var query = $(event.target).text().match(/\[(.*)\]\s(.*)/);
    query_type = query[1];
    query_name = query[2];
    DrawRect($(elements[index]).attr("bounds"));
}

function FindElement() {
    locator = null;
    selector = null;
    if (platform == "Android") {
        switch (query_type) {
            case "resource-id":
                locator = "id";
                selector = query_name;
                break;
            case "text":
                locator = "-android uiautomator";
                selector = "new UiSelector().description(\"" + query_name + "\");new UiSelector().text(\"" + query_name + "\");"
                break;
            case "class":
                locator = "-android uiautomator";
                var value = query_name.match(/(.*)\:(.*)/);
                selector = "new UiSelector().className(\"" + value[1] + "\").instance(" + value[2] + ");";
                break;
        }
    }
    return $.ajax({
        url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/elements",
        type: "POST",
        dataType: "json",
        data: {
            using: locator,
            value: selector
        },
        async: false,
        success: (function (data) {
            t_element = data.value[0].ELEMENT;
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}

function Tap() {
    if (FindElement().status == 200) {
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/element/" + t_element + "/click",
            type: "POST",
            dataType: "json",
            async: false,
            success: (function (data) {
                Screenshot();
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function DrawRect(bounds) {
    if (typeof bounds != "undefined") {
        var color = document.getElementById("colorpicker").value;
        var can = document.getElementById("preview");
        var ctx = can.getContext("2d");
        var bound = bounds.match(/\d+/g);
        var x1 = can.width * bound[0] / parseInt(deviceInfo.deviceScreenSize.split("x")[0]);
        var y1 = can.height * bound[1] / parseInt(deviceInfo.deviceScreenSize.split("x")[1]);
        var x2 = can.width * bound[2] / parseInt(deviceInfo.deviceScreenSize.split("x")[0]);
        var y2 = can.height * bound[3] / parseInt(deviceInfo.deviceScreenSize.split("x")[1]);
        can.width = can.width;
        ctx.drawImage(document.getElementById("preview-pic"), 0, 0, can.width, can.height);
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function Back() {
    if (sessionId != 0) {
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/back",
            type: "POST",
            dataType: "json",
            async: false,
            success: (function (data) {
                Screenshot();
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function Scroll_Y(start, offset) {
    if (sessionId != 0) {
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/touch/perform",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                actions: [
                    {
                        action: "press",
                        options: {
                            x: 0.5,
                            y: start
                        }
                    },
                    {
                        action: "wait",
                        options: {
                            ms: 800
                        }
                    },
                    {
                        action: "moveTo",
                        options: {
                            x: 0.5,
                            y: offset
                        }
                    },
                    {
                        action: "release"
                    }
                ]
            },
            success: (function (data) {
                Screenshot();
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}