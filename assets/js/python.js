Blockly.Python['element'] = function(block) {
  var text_name = block.getFieldValue('name');
  var dropdown_type = block.getFieldValue('type');
  var text_value = block.getFieldValue('value');
  var value_index = Blockly.Python.valueToCode(block, 'index', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  if(!value_index)
    value_index = 0;
  var code = 'FindElement('+dropdown_type+','+text_value+','+value_index+')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['click'] = function (block) {
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'Click' + value_element + '\n';
  if(!value_element)
    alert("The block 'click' lacks a target element.");
  else
    return code;
};

Blockly.Python['scroll'] = function (block) {
  var dropdown_scroll = block.getFieldValue('scroll');
  var dropdown_weight = block.getFieldValue('weight');
  // TODO: Assemble Python into code variable.
  var code = 'Scroll(' + dropdown_scroll + ',' + dropdown_weight + ')\n';
  return code;
};

Blockly.Python['screenshot'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'Screenshot()\n';
  return code;
};

Blockly.Python['scroll_to'] = function (block) {
  var dropdown_scrollto = block.getFieldValue('scrollto');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'ScrollTo(' + dropdown_scrollto + ',' + value_element + ')\n';
  if(!value_element)
    alert("The block 'scroll_to' lacks a target element.");
  else
    return code;
};

Blockly.Python['status'] = function (block) {
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  var dropdown_status = block.getFieldValue('status');
  // TODO: Assemble Python into code variable.
  var code = 'GetStatus(' + value_element + ',' + dropdown_status + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  if(!value_element)
    alert("The block 'get status' lacks a target element.");
  else
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['enter'] = function (block) {
  var text_text = block.getFieldValue('text');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'Enter(' + text_text + ',' + value_element + ')\n';
  if(!value_element)
    alert("The block 'scroll_to' lacks a target element.");
  else
    return code;
};

Blockly.Python['current_element'] = function(block) {
  // TODO: Assemble Python into code variable.
  var code = 'current_element';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['upload_result'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'UploadResult()\n';
  return code;
};

Blockly.Python['wait'] = function (block) {
  var text_time = block.getFieldValue('time');
  // TODO: Assemble Python into code variable.
  var code = 'Wait(' + text_time + ')\n';
  return code;
};

Blockly.Python['wait_for'] = function (block) {
  var value_condition = Blockly.Python.valueToCode(block, 'condition', Blockly.Python.ORDER_ATOMIC);
  var text_time = block.getFieldValue('time');
  // TODO: Assemble Python into code variable.
  var code = 'WaitFor(' + value_condition + ',' + text_time + ')\n';
  if(!value_condition)
    alert("The block 'wait for' lacks a condition.");
  else
    return code;
};

Blockly.Python['attribute'] = function (block) {
  var text_attribute_name = block.getFieldValue('attribute_name');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'GetAttr(' + text_attribute_name + ',' + value_element + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  if(!value_element)
    alert("The block 'get attribute' lacks a target element.");
  else
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['back'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'Back()\n';
  return code;
};