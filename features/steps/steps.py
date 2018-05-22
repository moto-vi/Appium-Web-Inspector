import time, os, json, logging, pytest
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

pagedata = {}
driver = None
rect = {}
cur_element = None


def getLocator(name):
    if name in pagedata['android'].keys():
        return [By.XPATH, pagedata['android'][name][1]]
    else:
        return [
            MobileBy.ANDROID_UIAUTOMATOR,
            'new UiSelector().descriptionContains("%s");new UiSelector().textContains("%s");'
            % (name, name)
        ]


def getFrameBound():
    # For Android className
    className = 'android.widget.FrameLayout'
    frames = WebDriverWait(driver, 20).until(
        EC.visibility_of_any_elements_located(
            (MobileBy.ANDROID_UIAUTOMATOR,
             'new UiSelector().className("%s");' % className)))
    targetFrame = frames[1] if len(frames) > 1 else frame[0]
    # The rect function is not supported in python remote server, use size and location instead
    rect['top'] = targetFrame.location['y']
    rect['bottom'] = targetFrame.size['height'] + targetFrame.location['y']
    rect['left'] = targetFrame.location['x']
    rect['right'] = targetFrame.size['width'] + targetFrame.location['x']


def findElement(locator, timeout=20, index=0):
    cur_element = WebDriverWait(driver, timeout).until(
        EC.visibility_of_any_elements_located(locator))[index]
    return cur_element


def scrollPage(dir, str):
    len = {'quickly': 0.25, 'lightly': 0.1}
    offset = len[str]
    result = {
        'up': [True, 0.5 - offset, 0.5 + offset],
        'down': [True, 0.5 + offset, 0.5 - offset],
        'left': [False, 0.5 - offset, 0.5 + offset],
        'right': [False, 0.5 + offset, 0.5 - offset]
    }
    vert, start, offset = result[dir]
    x = driver.get_window_size()['width']
    y = driver.get_window_size()['height']
    if (vert):
        driver.swipe(0.5 * x, start * y, 0.5 * x, offset * y, 800)
    else:
        driver.swipe(0.5 * x, start * y, 0.5 * x, offset * y, 800)
    time.sleep(0.5)


@Given('I open the app')
def step_impl(context):
    global pagedata
    global driver
    driver = context.driver
    with open('features/%s.json' % context.cur_feature) as data_file:
        pagedata = json.load(data_file)
    getFrameBound()
    print('Launch App')


@Then('I click the "{element}"')
def step_impl(context, element):
    locator = getLocator(element)
    findElement((locator[0], locator[1])).click()


@Then('I wait for {timeout}s until the "{element}" is {status}')
def step_impl(context, timeout, element, status):
    locator = getLocator(element)
    findElement((locator[0], locator[1]), timeout=int(timeout))


@Then('I wait for {timeout}s')
def step_impl(context, timeout):
    time.sleep(float(timeout))


@Then('I scroll {dir} the page {str}')
def step_impl(context, dir, str):
    scrollPage(dir, str)


@Then('I scroll {dir} to the "{element}" within {timeout}s')
def step_impl(context, dir, element, timeout):
    startTime = time.time()
    found = False
    interval = 0.5
    while (startTime + float(timeout) > time.time()):
        locator = getLocator(element)
        elements = driver.find_elements(locator[0], locator[1])
        scroll_str = 'quickly'
        if (elements):
            element = elements[0]
            location = element.location
            size = element.size
            interval = 1.5
            # Android Hybrid App
            check = {
                'up': [
                    int(location['y']) > int(rect['top']),
                    int(location['y']) < int(rect['top']) * 0.2
                ],
                'down': [
                    int(size['height']) + int(location['y']) < int(
                        rect['bottom']),
                    int(size['height']) + int(location['y']) >
                    int(rect['bottom']) * 0.8
                ]
            }
            if check[dir][0]:
                found = True
                if check[dir][1] and not found:
                    scroll_str = 'lightly'
                else:
                    break
        scrollPage(dir, scroll_str)
        time.sleep(interval)
    assert found, "It can't found the target element."