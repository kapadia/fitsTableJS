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
    unsigned_byte_array     = numpy.array([128, 110, 0, 126], dtype=numpy.int8)
    integer_16_array        = numpy.array([-32768, -16010, 0, 32767], dtype=numpy.int16)
    integer_32_array        = numpy.array([-2147483648, -1258594759, 0, 2147483647], dtype=numpy.int32)
    # integer_64_array        = numpy.array([-9223372036854775808, -81122610257436647070, 9223372036854775807], dtype=numpy.int64)
    character_array         = numpy.array(['NGC what what', 'Messier messy catalog', 'long redundant name for an object', 'SDSS J011813.23-005420.7'])
    float_single_array      = numpy.array([0.52765727,  0.49855918,  0.18345617,  0.96718222], dtype=numpy.float32)
    float_double_array      = numpy.array([0.1591198764073356,  0.52608471328096251,  0.46402682308528254,  0.21657682117710586], dtype=numpy.float64)
    complex_single_array    = numpy.array([1.15767050-0.27762079j, -0.18762238+0.21096167j, 1.35169768+0.00690449j, -0.08271787+0.2196918j], dtype=numpy.complex64)
    complex_double_array    = numpy.array([1.66975072-0.26756817j, 0.88275133-0.54015721j, -0.66180928+0.01391293j, -1.39973848+1.48623702j], dtype=numpy.complex128)
    # array_descriptor_array  = numpy.array([], dtype=numpy.)

    col1    = pyfits.Column(name='boolean', format='L', array=boolean_array)
    # col2    = pyfits.Column(name='bit', format='X', array=bit_array)
    col3    = pyfits.Column(name='unsigned_byte', format='B', array=unsigned_byte_array)
    col4    = pyfits.Column(name='integer_16', format='I', array=integer_16_array)
    col5    = pyfits.Column(name='integer_32', format='J', array=integer_32_array)
    # col6    = pyfits.Column(name='integer_64', format='K', array=integer_64_array)
    col7    = pyfits.Column(name='character', format='33A', array=character_array)
    col8    = pyfits.Column(name='float_single', format='E', array=float_single_array)
    col9    = pyfits.Column(name='float_double', format='D', array=float_double_array)
    col10   = pyfits.Column(name='complex_single', format='C', array=complex_single_array)
    col11   = pyfits.Column(name='complex_double', format='M', array=complex_double_array)
    # col12   = pyfits.Column(name='array_descriptor', format='P', array=array_descriptor_array)

    cols = pyfits.ColDefs([
        col1,
        # col2,
        col3,
        col4,
        col5,
        # col6,
        col7,
        col8,
        col9,
        col10,
        col11,
        # col12
    ])
    tbhdu = pyfits.new_table(cols)
    tbhdu.writeto('test-data.fits')

def generate_test_data(f):
    f = open(f, 'rb')
    s = 'var fits_binary_table = "%s";' % base64.b64encode(f.read())

    data_js = open("data.js", 'w')
    data_js.write(s)
    data_js.close()

if __name__ == '__main__':
    if len(sys.argv) is 1:
        create_fits_table()
    elif len(sys.argv) is 2:
        generate_test_data(sys.argv[1])
    else:
        print "This script has two options, either"
        print "Usage python %s" % inspect.getfile( inspect.currentframe() )
        print "to generate a test binary FITS table from predefined data, or"
        print "Usage python %s [FITS Table File]" % inspect.getfile( inspect.currentframe() )
        print "to generate JavaScript from a FITS binary table."
        quit()