var elements = {};
var element_type, element_value;
var check_blockly = true;

Blockly.Python['element'] = function (block) {
  var text_name = block.getFieldValue('name');
  if (!text_name) {
    alert('There is at least one element without name.');
    check_blockly = false;
  }
  var value_element_type = Blockly.Python.valueToCode(block, 'element_type', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  if (!elements[text_name])
    elements[text_name] = [element_type, element_value];
  else {
    if (elements[text_name][1] != element_value) {
      alert('Different elements have the same name: ' + text_name);
      check_blockly = false;
    }
  }
  var code = 'the "' + text_name + '"';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['element_type'] = function (block) {
  element_type = block.getFieldValue('type');
  element_value = block.getFieldValue('value');
  // TODO: Change ORDER_NONE to the correct strength.
  return [element_value, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['launcher'] = function (block) {
  var dropdown_platform = block.getFieldValue('platform');
  var text_feature = block.getFieldValue('feature');
  var text_scenario = block.getFieldValue('scenario');
  var text_tags = block.getFieldValue('tags');
  // TODO: Assemble Python into code variable.
  blocly_platform = dropdown_platform;
  var code = 'Feature: ' + text_feature + '\n\n' + text_tags + '\nScenario: ' + text_scenario + '\nGiven I open the app\n';
  return code;
};

Blockly.Python['click'] = function (block) {
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  // var code = 'Click' + value_element + '\n';
  var code = 'Then I click ' + value_element + '\n';
  console.log(code);
  if (!value_element)
    alert("The block 'click' lacks a target element.");
  else
    return code;
};

Blockly.Python['scroll'] = function (block) {
  var dropdown_scroll = block.getFieldValue('scroll');
  var dropdown_weight = block.getFieldValue('weight');
  // TODO: Assemble Python into code variable.
  // var code = 'Scroll(' + dropdown_scroll + ',' + dropdown_weight + ')\n';
  var code = 'Then I scroll ' + dropdown_scroll + ' the page ' + dropdown_weight + '\n';
  return code;
};

Blockly.Python['screenshot'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'Then take a screenshot';
  return code;
};

Blockly.Python['scroll_to'] = function (block) {
  var dropdown_scrollto = block.getFieldValue('scrollto');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  var number_timeout = block.getFieldValue('timeout');
  // TODO: Assemble Python into code variable.
  var code = 'Then I scroll ' + dropdown_scrollto + ' to the ' + value_element + ' within ' + number_timeout + 's\n';
  if (!value_element)
    alert("The block 'scroll_to' lacks a target element.");
  else
    return code;
};

Blockly.Python['status'] = function (block) {
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  var dropdown_status = block.getFieldValue('status');
  // TODO: Assemble Python into code variable.
  var code = value_element + ' is ' + dropdown_status;
  // TODO: Change ORDER_NONE to the correct strength.
  if (!value_element)
    alert("The block 'get status' lacks a target element.");
  else
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['enter'] = function (block) {
  var text_text = block.getFieldValue('text');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'Then I enter ' + text_text + ' into ' + value_element + '\n';
  if (!value_element)
    alert("The block 'scroll_to' lacks a target element.");
  else
    return code;
};

Blockly.Python['upload_result'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'Then upload the test result';
  return code;
};

Blockly.Python['wait'] = function (block) {
  var text_time = block.getFieldValue('time');
  // TODO: Assemble Python into code variable.
  var code = 'Then I wait for ' + text_time + 's \n';
  return code;
};

Blockly.Python['wait_until'] = function (block) {
  var value_condition = Blockly.Python.valueToCode(block, 'condition', Blockly.Python.ORDER_ATOMIC);
  var text_time = block.getFieldValue('time');
  // TODO: Assemble Python into code variable.
  var code = 'Then I wait for ' + text_time + 's until ' + value_condition + '\n';
  if (!value_condition)
    alert("The block 'wait for' lacks a condition.");
  else
    return code;
};

Blockly.Python['attribute'] = function (block) {
  var text_attribute_name = block.getFieldValue('attribute_name');
  var value_element = Blockly.Python.valueToCode(block, 'element', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'the ' + text_attribute_name + ' of ' + value_element;
  // TODO: Change ORDER_NONE to the correct strength.
  if (!value_element)
    alert("The block 'get attribute' lacks a target element.");
  else
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['back'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = 'Then go back (Android Only)\n';
  return code;
};

Blockly.Python['repeat'] = function(block) {
  var number_timeout = block.getFieldValue('timeout');
  var value_condition = Blockly.Python.valueToCode(block, 'condition', Blockly.Python.ORDER_ATOMIC);
  var statements_sentences = Blockly.Python.statementToCode(block, 'sentences');
  if (!statements_sentences)
    statements_sentences = '';
  // TODO: Assemble Python into code variable.
  var code = 'Given loop start\n' /
    + statements_sentences /
    + 'Given perform the following steps if the previous step fails\n' /
    + value_condition /
    + 'Then it will continue to loop until it passes or ' + number_timeout + 's timeout\n';
  return code;
};

Blockly.Python['current_element'] = function (block) {
  // TODO: Assemble Python into code variable.
  var code = '${current_element}';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};