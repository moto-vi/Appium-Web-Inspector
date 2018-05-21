# Appium Web Inspector
## Overview
#### It's a html5 web tool based on Appium inspector.
#### You can locate mobile elements and recording the automated test scripts of appium on this web page.
+ **Related Components:**
    + Html5 page: jQuery + Bootstrap
    + Code generator: Goole blockly
    + Image recognition: OpenCV library
    + Communication with devices: Appium server
+ **Page preview:**
---
## Requirements
1. **Nodejs**
    + https://nodejs.org/en/
2. **Appium *(need nodejs)***
    + Open the terminal or cmd:
    + Install appium using npm tool from nodejs.
+     npm install -g appium
3. **Android Studio & SDK *(For windows or mac os)***
    + https://developer.android.com/studio/
4. **iOS SDK & Xcode *(Only for mac os)***
    + Download in app store
5. **Appium doctor *(need nodejs)***
+     npm install appium-doctor -g
     It's used to check the **Appium** required environment on terminal.
+     appium-doctor
     Please ensure that the environment required by the corresponding platform have been configured.   
     *If it fails, please configure the missing configuration.*
6. **Python & Pip(python package manager)**
    + Install python 2.7 or 3.6 or higher verion.
    + https://www.python.org/
    + Pip is usually included in the python installation.
7. **Appium-Python-Client**
    + Install appium-python-client using pip.
+     pip install Appium-Python-Client
    + And use the following command to launch Appium server.
+     appium
---
## Get Started