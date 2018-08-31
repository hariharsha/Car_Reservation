import pyautogui as pa
import time

import win32com.client as comclt


#program waits till the user does some things

pa.FAILSAFE: False

def do_stuff():
    try:
        db_window = pa.getWindow('連絡車予約')
        db_window.maximize()
        db_window.set_foreground()
    except AttributeError:
        db_window = pa.getWindow('HGJ-S MG承認車両予約')
        db_window.maximize()
        db_window.set_foreground()
        pa.hotkey('ctrl','shift','tab')
        time.sleep(1)
        print('Error encountered') 

    def get_data(filename="backup.txt"):
        pa.press('f9')
        pa.hotkey('alt','f')
        pa.press(['e','enter'])

        while True:
            if ('書き出し' in pa.getWindows().keys()):
                break

        pa.hotkey('alt','n')
        pa.typewrite('C')
        wsh = comclt.Dispatch("WScript.Shell")
        wsh.SendKeys(":")
        pa.typewrite("\\xampp\\htdocs\\Car_stat\\")
        pa.typewrite(filename)

        pa.press(['enter','enter'])

        while True:
            if ('構造化テキストの書き出し' in pa.getWindows().keys()):
                break
        pa.hotkey('alt','i')
        pa.press('enter')
        print(pa.getWindows().keys())

    get_data('file1.txt')
    pa.hotkey('ctrl','tab')
    time.sleep(.3)
    get_data('file2.txt')
    pa.hotkey('ctrl','shift','tab')

    db_window.minimize()
    browser = pa.getWindow('Firefox')
    browser.maximize()
    browser.set_foreground()

while True:
    do_stuff()
    wait = True
    while wait:
        mouse = pa.position()
        time.sleep(2)
        if mouse==pa.position(): wait=False
    time.sleep(4)

