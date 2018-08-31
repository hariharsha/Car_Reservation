import nfc
from ndef import TextRecord

clf = nfc.ContactlessFrontend('usb')

tag = clf.connect(rdwr={'on-connect': lambda tag:False})
print(tag)

assert tag.ndef is not None
for record in tag.ndef.records:
    print(record)

tag.ndef.records = [TextRecord('Car-10')]
    
for record in tag.ndef.records:
    print(record)
