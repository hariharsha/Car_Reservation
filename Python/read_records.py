import nfc
from ndef import TextRecord
import time
import type4

clf = nfc.ContactlessFrontend('usb')

tag = clf.connect(rdwr={'on-connect': lambda tag:False})

#assert tag.ndef is not None
for record in tag.ndef.records:
    print(record.text)
