# -*- coding: cp932 -*-

import nfc
from ndef import TextRecord
import time
from Tkinter import *
import winsound

from datetime import date, timedelta

car_array = [i.decode('cp932').encode('utf8') for i in ["N-BOXスラッシュ(92-51)",
            "N-ONE(70-21)", "N-WGN(34-82)","STEPWGN(No.ナシ)","スペーシア車イス(69-70)",
              "タントスローパー(70-10)" ,"FITハイブリッドﾞ(76-13)",
              "N-BOX Custom(30-89)","N-BOX(30-90)"]]

clf = nfc.ContactlessFrontend('usb')

no_cars = 9
car_time = dict()
for i in range(no_cars):
    car_time[i]=[]
cars_stats = [1 for i in range(no_cars)]
#1 car is here, parked, 0 means no car here

def prnt():
    file_write = open(file_loc,"w")
    for i in range(no_cars):
        file_write.write(','.join(car_time[i])+'\n')
    file_write.write(','.join([str(i) for i in cars_stats]))
    file_write.close()

def diff_time(t1,t2):
    """takes 2 strings "11:58:02" and "14:35:45" and gives the diff in seconds"""
    t1 = [int(i) for i in t1.split(':')]
    t2 = [int(i) for i in t2.split(':')]
    return abs(((t1[0]-t2[0])*60+t1[1]-t2[1])*60+t1[2]-t2[2])    

def use_msg(number,status):
    
    strs =[i.decode('cp932').encode('utf8') for i in ['使用開始','使用終了']]
    welcome_msg = '\n\n'+car_array[number]+'\n'+strs[status]+'\n\n'
    
    root = Tk()
    root.title("Notice")
    text = Label(root,text=welcome_msg,width=26,font=("Helvetica",64))
    text.pack(pady=20,padx=20)
    #button = Button(root,text='OK',command=root.destroy,font=("Helvetica",32))
    #button.pack()
    text.after(1000,root.destroy)
    root.overrideredirect(1)
    root.wm_attributes("-topmost","1")
    root.mainloop()
    

while True:
    not_read = True
    while not_read:
        try:
            tag = clf.connect(rdwr={'on-connect': lambda tag:False})
            assert tag.ndef is not None
            not_read = False
        except AssertionError:
            print('Assertion Error encountered but OK')
            pass

    winsound.Beep(2500,750)

    """This try here is for the file"""
    date_ = time.strftime("%Y-%m-%d",time.localtime())
    time_now = time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime())[11:19]
    file_loc = "C:\\xampp\htdocs\Car_stat\car_live"+date_+".txt"

    try:
        file_read = open(file_loc,'r')
        for i in range(no_cars):
            car_time[i] = file_read.readline().replace('\n','').split(',')
            if car_time[i][-1]=='\n': car_time[i]=car_time[i][:-1]
        cars_stats = [int(i) for i in file_read.readline().split(',')]
        file_read.close()
    except IOError:
        try:
            print('Reading yesterday\'s file')
            kino = (date.today() -timedelta(1)).strftime("%Y-%m-%d")
            file_kino =open("C:\\xampp\htdocs\Car_stat\car_live"+kino+".txt",'r')
            for i in range(no_cars):
                file_kino.readline()
            cars_stats = [int(i) for i in file_kino.readline().split(',')]
            for i in range(no_cars):
                if (not cars_stats[i]): car_time[i].append('06:00:00')
            file_kino.close()
        except IOError:
            print('Not found yesterday\'s file, creating new one')
    
    for record in tag.ndef.records:
        txt_ = record.text
        print(txt_,time_now)
        car_number = int(txt_[-1])-1
        cars_stats[car_number] = 1^cars_stats[car_number] #if 1=>0 ; if 0=>1
        use_msg(car_number,cars_stats[car_number])
        if len(car_time[car_number]) and cars_stats[car_number]==1:
            if diff_time(car_time[car_number][-1],time_now)<5*60: #under 5 mins, no need to show in the site
                car_time[car_number].pop()
                prnt()
                continue
        try:
            if car_time[car_number][-1]=='': car_time[car_number].pop()
        except IndexError: pass
        car_time[car_number].append(time_now)
        if cars_stats[car_number]: car_time[car_number].append('0')
        prnt()
    while (tag.is_present):
        time.sleep(.1)

