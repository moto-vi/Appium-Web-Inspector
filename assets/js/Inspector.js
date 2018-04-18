var platform = "Android";
var sessionId = 0;
var canvas_x, canvas_y;
var deviceInfo;
var pagesource;
var elements = [], area = 0;
var query_name = null;
var query_type = null;
var element_key = 0;
var canvas_width = 0, canvas_height = 0;

$("#button_create_session").click(function () {
    CreateSession();
});

$("#button_delete_session").click(function () {
    DeleteSession();
});

$("#button_redraw").click(function () {
    Screenshot();
});

$("#button_colorpicker").click(function () {
    $("#colorpicker").click();
});

$("#button_click").click(function () {
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

$("#button_scroll_up_lightly").click(function () {
    Scroll_Y(0.4, 0.6);
});

$("#button_scroll_down_lightly").click(function () {
    Scroll_Y(0.6, 0.4);
});

$("#button_wait_for").click(function () {
    if ($(".list-group-item.active").text()) {
        var parent = AddBlock('wait_for');
        var child = AddBlock('status');
        var grandchild = AddBlock('element');
        child.getInput('element').connection.connect(grandchild.outputConnection);
        parent.getInput('condition').connection.connect(child.outputConnection);
        AttachBlock(parent);
    }
});

$("#button_enter").click(function () {
    Enter();
});

$('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover'
});

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
    var bool = true;
    var platformName = $("select").val();
    var platformVersion = "7.0";
    var deviceName = "Android Device";
    var appPackage = "com.android.settings";
    var appActivity = "com.android.settings.Settings";
    var automationName = "uiautomator2";
    if ($("#device_name").val() && $("#os_version").val()) {
        deviceName = $("#device_name").val();
        platformVersion = $("#os_version").val();
    }
    else {
        alert("Please enter your device name and os version")
        bool = false;
        if (!$("#device_name").val())
            $("#device_name").select();
        else
            $("#os_version").select();
    }
    if (platformName == "Android") {
        if ($("#package_name").val())
            appPackage = $("#package_name").val();
        if ($("#app_activity").val())
            appActivity = $("#app_activity").val();
    }
    if (bool) {
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session",
            type: "POST",
            dataType: "json",
            data: {
                desiredCapabilities:
                    {
                        newCommandTimeout: 600000,
                        platformName: platformName,
                        platformVersion: platformVersion,
                        deviceName: deviceName,
                        //automationName: 'uiautomator2',
                        appPackage: appPackage,
                        appActivity: appActivity
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
    }
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
    setTimeout(function () {
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
                    currentNode(false);
                }),
                error: (function (data) {
                    alert("Error!");
                })
            });
        }
    }, 1000);//Delay
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
        SetNodes();
        DrawRect($(elements[0]).attr('bounds'));
    }
};

function SetNodes() {
    $("#element-list").children('div').remove();
    $.each(elements, function (i, e) {
        $("#element-list").append(AddElement2List(e, i));
    });
    currentNode(true);
}

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
    var content = $(node).attr("content-desc");
    var title = "[class]&nbsp;" + el_class + ":" + instance;
    var attrs = "";
    if (text != "")
        title = "[text]&nbsp;" + text;
    else if (content != "")
        title = "[content-desc]&nbsp;" + content;
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
    currentNode(true);
}

function currentNode(bool) {
    if (bool) {
        console.log($(".list-group-item.active").text());
        $("#current_node").text($(".list-group-item.active").text());
        $("#current_node").css("display", "inline");
    }
    else {
        $("#current_node").css("display", "none");
    }
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
            case "content-desc":
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
            if (typeof data.value != "undefined") {
                element_key = data.value[0].ELEMENT;
            }
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}

function Tap() {
    if (FindElement().status == 200) {
        // $.ajax({
        //     url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/element/" + element_key + "/click",
        //     type: "POST",
        //     dataType: "json",
        //     async: false,
        //     success: (function (data) {
        //         Screenshot();
        //         var parent = AddBlock('click');
        //         var child = AddBlock('element');
        //         parent.getInput('element').connection.connect(child.outputConnection);
        //         AttachBlock(parent);
        //     }),
        //     error: (function (data) {
        //         alert("Error!");
        //     })
        // });
        $.ajax({
            url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/touch/click",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                element: element_key
            },
            success: (function (data) {
                Screenshot();
                var parent = AddBlock('click');
                var child = AddBlock('element');
                parent.getInput('element').connection.connect(child.outputConnection);
                AttachBlock(parent);
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
        // var index = parseInt($(".list-group-item.active").parent().attr("index"));
        // var bound = $(elements[index]).attr("bounds").match(/\d+/g);
        // var x = (bound[2] - bound[0]) / 2 + Number(bound[0]);
        // var y = (bound[3] - bound[1]) / 2 + Number(bound[1]);
        // $.ajax({
        //     url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/touch/perform",
        //     type: "POST",
        //     dataType: "json",
        //     async: false,
        //     data: {
        //         actions: [
        //             {
        //                 action: "press",
        //                 options: {
        //                     x: x,
        //                     y: y
        //                 }
        //             },
        //             {
        //                 action: "release"
        //             }
        //         ]
        //     },
        //     success: (function (data) {
        //         Screenshot();
        //         var parent = AddBlock('click');
        //         var child = AddBlock('element');
        //         parent.getInput('element').connection.connect(child.outputConnection);
        //         AttachBlock(parent);
        //     }),
        //     error: (function (data) {
        //         alert("Error!");
        //     })
        // });
    }
}

function AttachBlock(block) {
    var list = workspace.getTopBlocks();
    if (list.length > 1)
        list[0].lastConnectionInStack_().connect(block.previousConnection);
}

function AddBlock(type) {
    var block = workspace.newBlock(type);
    block.initSvg();
    block.render();
    if (type == 'element') {
        var text = $(".list-group-item.active").text();
        var type = /\[(.*)\]/.exec(text)[1];
        var value = /\]\s(.*)/.exec(text)[1];
        console.log(type + ":" + value)
        switch (type) {
            case "class":
                type = "class";
                break;
            case "resource-id":
                type = "id"
                break;
            default:
                type = "text"
                break;
        }
        block.setFieldValue(type, 'type');
        block.setFieldValue(value, 'value');
        if (type == "text")
            block.setFieldValue(value, 'name');
    }
    return block;
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
                var parent = AddBlock('back');
                AttachBlock(parent);
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
                var e = AddBlock("scroll");
                e.setFieldValue("quickly", "weight");
                if (start < offset)
                    e.setFieldValue("up", "scroll");
                else
                    e.setFieldValue("down", "scroll");
                AttachBlock(e);
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function ShowBlockly(event) {
    $("#blocklyModule").css("display", "inline");
    $("#element-list").css("display", "none");
    $("li.active").attr("class", "noactive");
    if (typeof event != "undefined")
        $(event.target).parent().attr("class", "active");
    Blockly.mainWorkspace.render();
}

function ShowNodes(event) {
    $("#blocklyModule").css("display", "none");
    $("#element-list").css("display", "inline");
    $("li.active").attr("class", "noactive");
    if (typeof event != "undefined")
        $(event.target).parent().attr("class", "active");
    SetNodes();
}

function SetSelect(event) {
    var v = event.target.value;
    if (v == 'Android') {
        $("#Android").css("display", "inline");
        $("#iOS").css("display", "none");
    }
    else {
        $("#Android").css("display", "none");
        $("#iOS").css("display", "inline");
    }
}

function importer() {
    $("#import_blockly").click();
}

function importDom() {
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var text = fileLoadedEvent.target.result;
        console.log(text);
        var dom = Blockly.Xml.textToDom(text);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);
    };
    var file = $("#import_blockly").prop('files')[0];
    fileReader.readAsText(file, "UTF-8");
    $("#script_name").val(file.name.replace(/\.xml$/, ""));
}

function downloadFile(event, fileName, content) {
    if (fileName != ".py" && fileName != ".xml") {
        var aLink = event.target;
        var blob = new Blob([content]);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
    }
    else {
        alert("Please enter the script name");
        $("#script_name").select();
    }
}

function clearWorkspace() {
    if (confirm("Are you sure to clear the blockly workspace?"))
        Blockly.mainWorkspace.clear();
}

function Enter() {
    var text = prompt("Enter", "");
    $.ajax({
        url: "http://127.0.0.1:4723/wd/hub/session/" + sessionId + "/element/" + element_key + "/value",
        type: "POST",
        dataType: "json",
        async: false,
        data: {
            value: text
        },
        success: (function (data) {
            Screenshot();
            var parent = AddBlock('enter');
            parent.setFieldValue(text, 'text');
            var child = AddBlock('element');
            parent.getInput('element').connection.connect(child.outputConnection);
            AttachBlock(parent);
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}