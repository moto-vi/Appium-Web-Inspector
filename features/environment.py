from appium import webdriver
# from browserstack.local import Local
import os, json

def GetConfig(config):
    global CONFIG, TASK_ID, BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY
    DEFAULT_CONFIG = 'config/%s.json' % config if config else 'config/local.json'
    CONFIG_FILE = os.environ['CONFIG_FILE'] if 'CONFIG_FILE' in os.environ else DEFAULT_CONFIG
    TASK_ID = int(os.environ['TASK_ID']) if 'TASK_ID' in os.environ else 0
    
    with open(CONFIG_FILE) as data_file:
        CONFIG = json.load(data_file)

    if config:
        BROWSERSTACK_USERNAME = os.environ['BROWSERSTACK_USERNAME'] if 'BROWSERSTACK_USERNAME' in os.environ else CONFIG['user']
        BROWSERSTACK_ACCESS_KEY = os.environ['BROWSERSTACK_ACCESS_KEY'] if 'BROWSERSTACK_ACCESS_KEY' in os.environ else CONFIG['key']

def before_all(context):
    config = context.config.userdata['config'] if context.config.userdata.get('config') else None
    GetConfig(config)

    desired_capabilities = CONFIG['environments'][TASK_ID]

    for key in CONFIG["capabilities"]:
        if key not in desired_capabilities:
            desired_capabilities[key] = CONFIG["capabilities"][key]

    if not config:
        context.driver = webdriver.Remote(
            desired_capabilities=desired_capabilities,
            command_executor="http://localhost:4723/wd/hub")
    else:
        context.driver = webdriver.Remote(
            desired_capabilities=desired_capabilities,
            command_executor="http://%s:%s@hub-cloud.browserstack.com/wd/hub" %
            (BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY))


def after_all(context):
    context.driver.quit()


def before_feature(context, feature):
    context.cur_feature = feature.name
