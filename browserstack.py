import requests
import urllib3
from appium import webdriver
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# ========== Upload app package
# curl -u "barrymor1:xFRzUzP4Yq46MqC5DUhk" \
# -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
# -F "file=@/path/to/app/file/Application-debug.apk"
# -F 'data={"custom_id": "MyApp"}'

# filepath = 'C:/Users/BarryMo/Downloads/WikipediaSample.apk'
# url = 'https://api-cloud.browserstack.com/app-automate/upload'
# files = {'file': open(filepath,'rb')}
# urllib3.disable_warnings()
# curl = requests.post(url, files=files, auth=('barrymor1', 'xFRzUzP4Yq46MqC5DUhk'),verify=False).text
# print(curl.url)
# print(curl.content)


# ========== Get App
# curl -u "barrymor1:xFRzUzP4Yq46MqC5DUhk" -X GET https://api-cloud.browserstack.com/app-automate/recent_apps

# url = 'https://api-cloud.browserstack.com/app-automate/recent_apps'
# urllib3.disable_warnings()
# curl = requests.get(url, auth=('barrymor1', 'xFRzUzP4Yq46MqC5DUhk'),verify=False).text
# print(curl)

# ========== 
userName = "barrymor1"
accessKey = "xFRzUzP4Yq46MqC5DUhk"
startTime = time.time().__str__()
desired_caps = {
    #'build': startTime,
    'device': 'Google Nexus 6',
    'os_version': '6.0',
    'app': 'bs://b320ada8583dec85d662452994e9317d593c8f82'
}
driver = webdriver.Remote("http://" + userName + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub", desired_caps)

'browserstack.user' : 'barrymor1',
            'browserstack.key' : 'xFRzUzP4Yq46MqC5DUhk',
            'build' : 'Node Android',
            'name': 'single_test',
            'device': 'Google Pixel',
            'app': 'bs://b320ada8583dec85d662452994e9317d593c8f82',
            'browserstack.debug' : true

# search_element = WebDriverWait(driver, 30).until(
#     EC.element_to_be_clickable((MobileBy.ACCESSIBILITY_ID, "Search Wikipedia"))
# )
# search_element.click()
 
# search_input = WebDriverWait(driver, 30).until(
#     EC.element_to_be_clickable((MobileBy.ID, "org.wikipedia.alpha:id/search_src_text"))
# )
# search_input.send_keys("BrowserStack")
# time.sleep(5)
 
# search_results = driver.find_elements_by_class_name("android.widget.TextView")
# assert(len(search_results) > 0)

driver.quit()