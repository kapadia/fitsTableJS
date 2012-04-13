import sys
import inspect
import base64

import pyfits

def generate_test_data(f):
    f = open(f, 'rb')
    s = 'var fits_binary_table = "%s";' % base64.b64encode(f.read())

    data_js = open("data.js", 'w')
    data_js.write(s)
    data_js.close()

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print "Usage python %s [FITS Table File]" % inspect.getfile( inspect.currentframe() )
        quit()
    generate_test_data(sys.argv[1])