import requests
import urllib3

# ========== Upload app package
# curl -u "barrymor1:xFRzUzP4Yq46MqC5DUhk" \
# -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
# -F "file=@/path/to/app/file/Application-debug.apk"
# -F 'data={"custom_id": "MyApp"}'

userName = 'barrymor1'
accessKey = 'xFRzUzP4Yq46MqC5DUhk'

# ========== Upload APP
# curl -u "barrymor1:xFRzUzP4Yq46MqC5DUhk" \
# -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
# -F "file=@/path/to/app/file/Application-debug.apk"
# -F 'data={"custom_id": "MyApp"}'

def uploadApp(filepath):
    filepath = '/Users/baihongmo/Downloads/944.apk'
    url = 'https://api-cloud.browserstack.com/app-automate/upload'
    files = {'file': open(filepath,'rb')}
    urllib3.disable_warnings()
    response = requests.post(url, files=files, auth=(userName, accessKey),verify=False).text
    print(response)

# ========== Get The Uploaded APP List
# curl -u "barrymor1:xFRzUzP4Yq46MqC5DUhk" -X GET https://api-cloud.browserstack.com/app-automate/recent_apps

def getAppList():
    url = 'https://api-cloud.browserstack.com/app-automate/recent_apps'
    urllib3.disable_warnings()
    response = requests.get(url, auth=(userName, accessKey),verify=False).text
    print(response)

# bs://a3236890af90215aeff99a5f08908cd9dcdb05c6

import sys
print(sys.path)