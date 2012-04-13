import sys
import inspect
import base64

import numpy
import pyfits

def create_fits_table():
    """
    Create some test data that encompasses all (or close to all)
    data types that can be stored in FITS tables.
    """
    boolean_array           = numpy.array([True, False, True, False], dtype=numpy.bool)
    # bit_array               = numpy.array([], dtype=numpy.)
    unsigned_byte_array     = numpy.array([-128, -110, 0, 126], dtype=numpy.int8)
    integer_16_array        = numpy.array([-32768, -16010, 0, 32767], dtype=numpy.int16)
    integer_32_array        = numpy.array([-2147483648, -1258594759, 0, 2147483647], dtype=numpy.int32)
    integer_64_array        = numpy.array([-9223372036854775808, -81122610257436647070, 9223372036854775807], dtype=numpy.int64)
    # character_array         = numpy.array([], dtype=numpy.)
    float_single_array      = numpy.array([], dtype=numpy.float32)
    float_double_array      = numpy.array([], dtype=numpy.float64)
    complex_single_array    = numpy.array([], dtype=numpy.complex64)
    complex_double_array    = numpy.array([], dtype=numpy.complex128)
    # array_descriptor_array  = numpy.array([], dtype=numpy.)
    
    col1    = pyfits.Column(name='boolean', format='L', array=boolean_array)
    # col2    = pyfits.Column(name='bit', format='X', array=bit_array)
    col3    = pyfits.Column(name='unsigned_byte', format='B', array=unsigned_byte)
    col4    = pyfits.Column(name='integer_16', format='I', array=integer_64_array)
    col5    = pyfits.Column(name='integer_32', format='J', array=integer_32_array)
    col6    = pyfits.Column(name='integer_64', format='K', array=integer_64_array)
    # col7    = pyfits.Column(name='character', format='A', array=character_array)
    col8    = pyfits.Column(name='float_single', format='E', array=float_single_array)
    col9    = pyfits.Column(name='float_double', format='D', array=float_double_array)
    col10   = pyfits.Column(name='complex_single', format='C', array=complex_single_array)
    col11   = pyfits.Column(name='complex_double', format='M', array=complex_double_array)
    # col12   = pyfits.Column(name='array_descriptor', format='P', array=array_descriptor_array)
    


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