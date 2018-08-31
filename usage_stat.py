from os import listdir,getcwd

from os.path import isfile,join

cwd = getcwd()

files = [f for f in listdir(cwd) if 'car_live2018-07' in f]

data = [[] for i in range(9)]
for i in files:
    rea = open(i,'r')
    ind = 0
    for line in rea:
        line = line.replace('\n','')
        data[ind].append(line.split(','))
        ind+=1
        if ind == 9: break
