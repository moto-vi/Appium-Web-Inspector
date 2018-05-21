Blockly.Blocks['element'] = {
  init: function() {
    this.appendValueInput("element_type")
        .setCheck("element_type")
        .appendField(new Blockly.FieldTextInput("element"), "name");
    this.setInputsInline(false);
    this.setOutput(true, "element");
    this.setColour(200);
 this.setTooltip("FindElements(query_type, query_value, index[default:0])");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['element_type'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["text","text"], ["xpath","xpath"]]), "type")
        .appendField("=")
        .appendField(new Blockly.FieldTextInput("value"), "value");
    this.setOutput(true, "element_type");
    this.setColour(150);
 this.setTooltip("element type");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['launcher'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("[START TEST]  on ")
        .appendField(new Blockly.FieldDropdown([["Android","android"], ["iOS","ios"]]), "platform");
    this.appendDummyInput()
        .appendField("*Feature:")
        .appendField(new Blockly.FieldTextInput("feature1"), "feature")
        .appendField("*Scenario:")
        .appendField(new Blockly.FieldTextInput("scenario1"), "scenario");
    this.appendDummyInput()
        .appendField("Tags:")
        .appendField(new Blockly.FieldTextInput(""), "tags");
    this.setNextStatement(true, null);
    this.setColour(50);
 this.setTooltip("Tags: @tag1 @tag2 ...");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['click'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("element")
        .appendField("Click");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("Click(element)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['scroll'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Scroll")
        .appendField(new Blockly.FieldDropdown([["up","up"], ["down","down"], ["left","left"], ["right","right"]]), "scroll")
        .appendField(new Blockly.FieldDropdown([["lightly","lightly"], ["quickly","quickly"]]), "weight");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("Scroll on current page");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['screenshot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Screenshot");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(50);
 this.setTooltip("Get a screenshot for device.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['scroll_to'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("element")
        .appendField("Scroll")
        .appendField(new Blockly.FieldDropdown([["up","up"], ["down","down"], ["left","left"], ["right","right"]]), "scrollto")
        .appendField("to");
    this.appendDummyInput()
        .appendField("within")
        .appendField(new Blockly.FieldNumber(20), "timeout")
        .appendField("s");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("Scroll to specified element");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['status'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("element");
    this.appendDummyInput()
        .appendField("is")
        .appendField(new Blockly.FieldDropdown([["appears","appears"], ["disappears","disappears"], ["enabled","enabled"], ["disabled","disabled"]]), "status");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(100);
 this.setTooltip("Status of element");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['enter'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("element")
        .appendField("Enter")
        .appendField(new Blockly.FieldTextInput("text"), "text")
        .appendField("into");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("Enter(text, element)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['upload_result'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Upload result");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(50);
 this.setTooltip("Upload test result");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wait for")
        .appendField(new Blockly.FieldNumber(20), "time")
        .appendField("s");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(50);
 this.setTooltip("Wait for n secs");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['wait_until'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("Wait")
        .appendField(new Blockly.FieldTextInput("20"), "time")
        .appendField("s until");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
 this.setTooltip("Wait for condition passed in x seconds");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['attribute'] = {
  init: function() {
    this.appendValueInput("element")
        .setCheck("element")
        .appendField(new Blockly.FieldTextInput("attribute"), "attribute_name")
        .appendField("of");
    this.setOutput(true, ["String", "Number"]);
    this.setColour(100);
 this.setTooltip("GetAttribut(attr_name,element)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['back'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Back");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("Go back");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['repeat'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("Repeat until")
        .appendField(new Blockly.FieldNumber(20), "timeout")
        .appendField("s timeout or");
    this.appendStatementInput("sentences")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['current_element'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("current element");
    this.setOutput(true, "element");
    this.setColour(200);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};