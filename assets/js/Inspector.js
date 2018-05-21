var platform = "Android";
var sessionId = 0;
var canvas_x, canvas_y;
var deviceInfo;
var elnodes = [], selected = [], node_index = 0, area = 0;
var node_attrs = {};
var query_name = null;
var query_type = null;
var element_key = 0;
var canvas_width = 0, canvas_height = 0;
var platformName;
var screen_w, screen_h;
var image_base64;
var url = "http://127.0.0.1:4723/wd/hub/session/";
var blocly_platform;
var rec = true;

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
    var title = $('#current_node').text();
    var query = title.match(/\[(.*)\]\s(.*)/);
    query_type = query[1];
    query_name = query[2];
    Click();
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

$("#button_scroll_to_element").click(function () {
    Scroll_Y(0.6, 0.4);
});

$("#button_clickby").click(function () {
    $("#select_element_by").attr('style', 'display: inline-block;');
    $("#select_scroll_to").attr('style', 'display: none;');
});

$("#button_scroll_to_element").click(function () {
    $("#select_element_by").attr('style', 'display: inline-block;');
    $("#select_scroll_to").attr('style', 'display: inline-block;');
});

$("#SelectorModal").find('.btn.btn-primary').click(function () {
    query_type = $('#selector-type').val();
    query_name = GetAttr(query_type);
    if ($("#select_scroll_to").attr('style') == 'display: inline-block;') {
        Scroll_To($('#selector-dir').val());
    }
    else {
        Click();
    }
});

$("#button_wait_until").click(function () {
    if ($(".list-group-item.active").text()) {
        var parent = AddBlock('wait_until');
        if (parent) {
            var child = AddBlock('status');
            var grandchild = AddBlock('element');
            child.getInput('element').connection.connect(grandchild.outputConnection);
            parent.getInput('condition').connection.connect(child.outputConnection);
            AttachBlock(parent);
        }
    }
});

$("#button_enter").click(function () {
    Enter();
});

$("#button_app").click(function () {
    $("#app").click();
});

$("#button_wait").click(function () {
    var parent = AddBlock('wait');
    if (parent) {
        var text = prompt("How many seconds to wait (Seconds)", "");
        if (!isNaN(text))
            parent.setFieldValue(text, 'time')
        AttachBlock(parent);
    }
});

$('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover'
});

$('#rec').change(function () {
    rec = $('#rec').prop("checked");
});

function InitCanvas(scale) {
    canvas_width = $("#device_controler").width();
    canvas_height = canvas_width * parseFloat(scale);
    $("#preview").attr("width", canvas_width);
    $("#preview").attr("height", canvas_height);
    $("#preview-pic").attr("width", canvas_width);
    $("#preview-pic").attr("height", canvas_height);
}

function CreateSession() {
    platformName = $("#Platform").val();
    var bool = true;
    var platformVersion = "7.0";
    var deviceName = "Android Device";
    var appPackage = "";
    var appActivity = "";
    var automationName = "uiautomator2";
    var app = "";
    var bundleid = "";
    var udid = "";
    if ($("#device_name").val()) {
        deviceName = $("#device_name").val();
    }
    else {
        alert("Please enter your device name")
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
        if ($("#android_app").val())
            app = $("#android_app").val();
    }
    else {
        if ($("#ios_udid").val())
            udid = $("#ios_udid").val();
        if ($("#ios_app").val())
            app = $("#ios_app").val();
        if ($("#ios_bundleid").val())
            bundleid = $("#ios_bundleid").val();
    }
    platform = platformName;
    var desiredcaps = {};
    if (platform == "Android") {
        desiredcaps = {
            desiredCapabilities:
                {
                    newCommandTimeout: 600000,
                    platformName: platformName,
                    deviceName: deviceName
                }
        };
        if (app) {
            desiredcaps['desiredCapabilities']['app'] = app;
            if (appPackage && appActivity) {
                desiredcaps['desiredCapabilities']['appPackage'] = appPackage;
                desiredcaps['desiredCapabilities']['appActivity'] = appActivity;
            }
        }
        else {
            if (appPackage && appActivity) {
                desiredcaps['desiredCapabilities']['appPackage'] = appPackage;
                desiredcaps['desiredCapabilities']['appActivity'] = appActivity;
            }
            else {
                desiredcaps['desiredCapabilities']['appPackage'] = 'com.android.settings.Settings';
                desiredcaps['desiredCapabilities']['appActivity'] = 'com.android.settings';
            }
        }
        if ($("#os_version").val()) {
            desiredcaps['desiredCapabilities']['platformVersion'] = $("#os_version").val();
        }
    }
    else {
        desiredcaps = {
            desiredCapabilities:
                {
                    newCommandTimeout: 600000,
                    deviceName: deviceName,
                    udid: udid,
                    platformName: platformName,
                    platformVersion: platformVersion,
                    automationName: 'XCUITest'
                }
        }
        if (app)
            desiredcaps['desiredCapabilities']['app'] = app;
        else
            desiredcaps['desiredCapabilities']['bundleId'] = bundleid;
    }
    if (bool) {
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: desiredcaps,
            async: false,
            success: (function (data) {
                sessionId = data.sessionId;
                $.ajax({
                    url: url + sessionId,
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
            url: url + sessionId,
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
                url: url + sessionId + "/screenshot",
                type: "GET",
                dataType: "json",
                async: false,
                success: (function (data) {
                    image_base64 = data.value;
                    InitCanvas(canvas_height / canvas_width);
                    Draw("data:image/png;base64," + image_base64);
                    GetPageSource();
                    currentNode(false);
                    ShowBlockly();
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
        cursor_y = e.clientY + document.body.scrollTop;
        canvas_x = parseInt((cursor_x - parseInt(can.offset().left)) * parseInt(screen_w) / can.width());
        canvas_y = parseInt((cursor_y - parseInt(can.offset().top)) * parseInt(screen_h) / can.height());
        $("#cursor_pos").text("(" + canvas_x + "," + canvas_y + ")");
        $("#cursor_pos_percent").text("(" + parseInt((cursor_x - parseInt(can.offset().left)) * 100 / can.width()) + "%," + parseInt((cursor_y - parseInt(can.offset().top)) * 100 / can.height()) + "%)");
    }
};

function GetPageSource() {
    $.ajax({
        url: url + sessionId + "/source",
        type: "GET",
        dataType: "json",
        async: false,
        success: (function (data) {
            var str = data.value.replace(/\\\"/g, "\"");
            var pagesource = $($.parseXML(str));
            if (platformName == "Android") {
                screen_w = deviceInfo.deviceScreenSize.split("x")[0];
                screen_h = deviceInfo.deviceScreenSize.split("x")[1];
            }
            else {
                node = pagesource.find('XCUIElementTypeApplication');
                screen_w = $(node).attr('width');
                screen_h = $(node).attr('height');
            }
            node_index = 0;
            elnodes.splice(0, elnodes.length);
            GetNodes(pagesource, elnodes);
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}

function GetElements() {
    if (sessionId != 0) {
        $("#element-list").empty();
        selected = [], area = 0;
        SelectNodes();
        SetNodes();
        DrawRect(selected[0]);
    }
};

function GetBound(node) {
    if (platformName == "Android") {
        if ($(node).attr('enabled') == 'true') {
            bounds = $(node).attr('bounds');
            return bounds.match(/\d+/g);
        }
        else
            return null;
    }
    else {
        if (node.attr('visible') == "true" && typeof node.attr('x') != "undefined" && typeof node.attr('y') != "undefined" && typeof node.attr('width') != "undefined" && typeof node.attr('height') != "undefined") {
            var x1 = parseInt(node.attr('x'));
            var y1 = parseInt(node.attr('y'));
            var x2 = x1 + parseInt(node.attr('width'));
            var y2 = y1 + parseInt(node.attr('height'));
            return [x1, y1, x2, y2];
        }
        else
            return null;
    }
}

function SetFullXPath(index) {
    var xpath = $(elnodes[index]).prop("tagName");
    var parent = $(elnodes[index]).attr('parent_index');
    if (parent != '#') {
        return SetFullXPath(parent) + '/' + xpath;
    }
    else
        return '//' + xpath;
}

// function SetXPath(index) {
//     var xpath = $(elnodes[index]).prop("tagName");
//     var classes = [];
//     $.each(elnodes, function (i, e) {
//         if ($(e).prop("tagName") == xpath) {
//             classes.push(i);
//         }
//     });
//     var n = classes.indexOf(index) + 1;
//     return '(//' + xpath + ')[' + n + ']';
// }

function SetNodes() {
    $("#element-list").children('div').remove();
    $.each(selected, function (i, e) {
        $("#element-list").append(AddElement2List(e, i));
    });
    if (selected.length != 0)
        currentNode(true);
}

function GetNodes(node, nodes, parent = '#') {
    node.children().each(function () {
        $(this).attr('node_index', node_index);
        $(this).attr('parent_index', parent);
        node_index++;
        nodes.push(this);
        if ($(this).children.length > 0)
            GetNodes($(this), nodes, node_index - 1);
    });
}

function SelectNodes() {
    $.each(elnodes, function (i, e) {
        bound = GetBound(e);
        if (bound) {
            if (canvas_x > bound[0] && canvas_x < bound[2] && canvas_y > bound[1] && canvas_y < bound[3]) {
                if (typeof $(this).attr("fullxpath") == "undefined") {
                    // $(this).attr("xpath", SetXPath(i));
                    $(this).attr("xpath", SetFullXPath(i));
                }
                t_area = (bound[2] - bound[0]) * (bound[3] - bound[1])
                if (area == 0) {
                    area = t_area;
                    selected.push(this);
                }
                else if (area < t_area)
                    selected.push(this);
                else if (area == t_area) {
                    if (typeof $(this).attr("text") != "undefined" || typeof $(this).attr("content-desc") != "undefined" || typeof $(this).attr("label") != "undefined" || typeof $(this).attr("name") != "undefined")
                        selected.unshift(this);
                    else {
                        tmp_e = selected[0];
                        selected.shift();
                        selected.unshift(this);
                        selected.unshift(tmp_e);
                    }
                }
                else {
                    area = t_area;
                    selected.unshift(this);
                }
            }
        }
    });
}

function GetAttr(type) {
    if (type == 'xpath')
        return node_attrs['xpath'];
    else {
        if (platformName == 'Android')
            return (node_attrs['text'] || node_attrs['content-desc']);
        else
            return node_attrs['id'];
    }
}

function AddElement2List(node, index) {
    var el_class = "";
    var re_class = "";
    var c_index = "";
    var resourceid = "";
    var text = "";
    var content = "";
    if (platformName == 'Android') {
        el_class = $(node).attr("class");
        re_class = el_class.replace(/\./g, "_")
        c_index = $(node).attr("instance");
        resourceid = $(node).attr("resource-id");
        content = $(node).attr("content-desc");
        text = $(node).attr("text");
    }
    else {
        if ($(node).attr("visible") == "true") {
            el_class = $(node).attr("type");
            re_class = el_class;
            text = $(node).attr("name");
            content = $(node).attr("label");
            c_index = $(node).attr("xpath").match(/\[(\d+)\]$/)[1];
        }
    }
    if (el_class) {
        var title = "[class]&nbsp;" + el_class + ":" + c_index;
        if (text != "" && typeof text != "undefined")
            title = "[text]&nbsp;" + text;
        else if (content != "" && typeof content != "undefined")
            title = "[text]&nbsp;" + content;
        else if (resourceid != "" && typeof resourceid != "undefined")
            title = "[resource-id]&nbsp;" + resourceid;
        if (index == 0) {
            var query = title.match(/\[(.*)\]\&nbsp\;(.*)/);
            query_type = query[1];
            query_name = query[2];
            AddAttributes(node);
            return "<div class=\"panel panel-default\" index=\"0\"><div class=\"list-group-item active\"><a data-toggle=\"collapse\" onclick=\"ActiveTarget(event)\" href=\"\" style=\"color:black;font-weight:bold;\">" + title + "</a></div></div>";
        }
        else
            return "<div class=\"panel panel-default\" index=\"" + index + "\"><div class=\"list-group-item\"><a data-toggle=\"collapse\" onclick=\"ActiveTarget(event)\" href=\"\" style=\"color:black;font-weight:bold;\">" + title + "</a></div></div>";
    }
}

function ActiveTarget(event) {
    $("#element-list").find(".list-group-item.active").attr("class", "list-group-item");
    $(event.target).parent(".list-group-item").attr("class", "list-group-item active");
    var index = parseInt($(".list-group-item.active").parent().attr("index"));
    var query = $(event.target).text().match(/\[(.*)\]\s(.*)/);
    query_type = query[1];
    query_name = query[2];
    DrawRect(selected[index]);
    AddAttributes(selected[index]);
    currentNode(true);
}

function AddAttributes(node) {
    var attrs = "";
    $.each(node.attributes, function (i, attrib) {
        attrs += "<tr><td>" + attrib.name + "</td><td style=\"word-break: break-all;\">" + attrib.value + "</td></tr>";
        node_attrs[attrib.name] = attrib.value;
    });
    $("#attributes").empty();
    $("#attributes").append(attrs);
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
            case "class":
                locator = "-android uiautomator";
                var value = query_name.match(/(.*)\:(.*)/);
                selector = "new UiSelector().className(\"" + value[1] + "\").instance(" + value[2] + ");";
                break;
            case "xpath":
                locator = "xpath"
                selector = query_name;
        }
    }
    else {
        switch (query_type) {
            case "text":
                locator = 'id';
                selector = query_name;
                break;
            case "class":
            case "xpath":
                locator = 'xpath';
                selector = GetAttr(locator);
                break;
        }
    }
    return $.ajax({
        url: url + sessionId + "/elements",
        type: "POST",
        dataType: "json",
        data: {
            using: locator,
            value: selector
        },
        async: false,
        success: (function (data) {
            if (typeof data.value != "undefined" && data.value) {
                element_key = data.value[0].ELEMENT;
            }
            else {
                alert('No elements found.')
                element_key = null;
            }
        }),
        error: (function (data) {
            alert("Error!");
        })
    });
}

function Click() {
    if (FindElement().status == 200 && element_key) {
        $.ajax({
            url: url + sessionId + "/touch/click",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                element: element_key
            },
            success: (function (data) {
                Screenshot();
                var parent = AddBlock('click');
                if (parent) {
                    var child = AddBlock('element', query_type);
                    parent.getInput('element').connection.connect(child.outputConnection);
                    AttachBlock(parent);
                }
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function AttachBlock(block) {
    var list = workspace.getTopBlocks();
    if (list.length > 1)
        list[0].lastConnectionInStack_().connect(block.previousConnection);
}

function AddBlock(type, e_type = '') {
    if (rec) {
        var block = workspace.newBlock(type);
        if (type == 'element') {
            var text = $("#current_node").text();
            if (e_type)
                type = e_type
            else
                type = text.match(/\[(.*)\]/)[1];
            var value = text.match(/\]\s(.*)/)[1];
            switch (type) {
                case "class":
                case "xpath":
                    type = 'xpath';
                    value = GetAttr(type);
                    break;
                case "resource-id":
                    type = "id";
                    break;
                default:
                    type = "text";
                    break;
            }
            var element_type = AddBlock('element_type');
            element_type.setFieldValue(type, 'type');
            element_type.setFieldValue(value, 'value');
            block.getInput('element_type').connection.connect(element_type.outputConnection);
            if (type == "text")
                block.setFieldValue(value, 'name');
            else
                block.setFieldValue(node_attrs['xpath'], 'name');
        }
        block.initSvg();
        block.render();
        return block;
    }
    else
        return null;
}

function DrawRect(node) {
    if (typeof node != "undefined") {
        var color = document.getElementById("colorpicker").value;
        var can = document.getElementById("preview");
        var ctx = can.getContext("2d");
        var bound = GetBound(node);
        var x1 = can.width * bound[0] / parseInt(screen_w);
        var y1 = can.height * bound[1] / parseInt(screen_h);
        var x2 = can.width * bound[2] / parseInt(screen_w);
        var y2 = can.height * bound[3] / parseInt(screen_h);
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
            url: url + sessionId + "/back",
            type: "POST",
            dataType: "json",
            async: false,
            success: (function (data) {
                Screenshot();
                var parent = AddBlock('back');
                if (parent)
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
            url: url + sessionId + "/touch/perform",
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
                if (e) {
                    e.setFieldValue("quickly", "weight");
                    if (start < offset)
                        e.setFieldValue("up", "scroll");
                    else
                        e.setFieldValue("down", "scroll");
                    AttachBlock(e);
                }
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function Scroll_To(dir) {
    if (sessionId != 0) {
        var parent = AddBlock('scroll_to');
        if (parent) {
            parent.setFieldValue(dir, 'scrollto');
            var child = AddBlock('element', query_type);
            parent.getInput('element').connection.connect(child.outputConnection);
            AttachBlock(parent);
        }
    }
}

function ShowBlockly(event) {
    $("#blocklyModule").css("display", "inline");
    $("#selected-list").css("display", "none");
    $("li.active").attr("class", "noactive");
    $("a:contains('Blockly')").parent().attr("class", "active");
    Blockly.mainWorkspace.render();
}

function ShowNodes(event) {
    $("#blocklyModule").css("display", "none");
    $("#selected-list").css("display", "inline");
    $("li.active").attr("class", "noactive");
    $("a:contains('Nodes')").parent().attr("class", "active");
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
        var dom = Blockly.Xml.textToDom(text);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);
    };
    var file = $("#import_blockly").prop('files')[0];
    fileReader.readAsText(file, "UTF-8");
    $("#script_name").val(file.name.replace(/\.xml$/, ""));
}

function clearWorkspace() {
    if (confirm("Are you sure to clear the blockly workspace?"))
        Blockly.mainWorkspace.clear();
}

function Enter() {
    if (Click().status == 200) {
        var text = prompt("Enter", "");
        $.ajax({
            url: url + sessionId + "/element/" + element_key + "/clear",
            type: "POST",
            dataType: "json",
            async: false,
            error: (function (data) {
                alert("Error!");
            })
        });
        $.ajax({
            url: url + sessionId + "/element/" + element_key + "/value",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                value: text
            },
            success: (function (data) {
                Screenshot();
                var parent = AddBlock('enter');
                if (parent) {
                    parent.setFieldValue(text, 'text');
                    var child = AddBlock('element', 'xpath');
                    parent.getInput('element').connection.connect(child.outputConnection);
                    AttachBlock(parent);
                }
            }),
            error: (function (data) {
                alert("Error!");
            })
        });
    }
}

function DownloadZip(event) {
    check_blockly = true;
    elements = {};
    if ($('#script_name').val() != "") {
        var zip = new JSZip();
        zip.file($('#script_name').val() + '.feature', Blockly.Python.workspaceToCode(workspace));
        zip.file($('#script_name').val() + '.xml', Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace)));
        $.each(elements, function (name, value) {
            if (name == value[1] && value[0] == 'text') {
                delete elements[name];
            }
        });
        var json = {};
        json[blocly_platform] = elements;
        zip.file($('#script_name').val() + '.json', JSON.stringify(json));
        if (check_blockly) {
            var img = zip.folder("images");
            img.file("screenshot.png", image_base64, { base64: true });
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    // see FileSaver.js
                    // saveAs(content, $('#script_name').val() + ".zip");
                    var aLink = event.target;
                    var blob = new Blob([content]);
                    aLink.download = $('#script_name').val() + ".zip";
                    aLink.href = URL.createObjectURL(blob);
                });
        }
    }
    else {
        alert("Please enter the script name");
        $("#script_name").select();
    }
}