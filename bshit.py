from bs4 import BeautifulSoup as bshit

hl = open('index.php','rb').read().decode('UTF-8')

soup = bshit(hl,'html.parser')

