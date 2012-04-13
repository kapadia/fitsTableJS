fitsTableJS
=============

Yes, and JavaScript library for reading FITS Binary Tables :)

Notes
=====

These are the fields that describe the columns and data format in the test data.

* TTYPE1  = 'flux    '
* TFORM1  = 'D       '
* TTYPE2  = 'best_fit'
* TFORM2  = 'D       '
* TTYPE3  = 'wavelength'
* TFORM3  = 'D       '
* TTYPE4  = 'and_mask'
* TFORM4  = 'J       '
* TTYPE5  = 'or_mask '
* TFORM5  = 'J       '
* TTYPE6  = 'inverse_variance'
* TFORM6  = 'D'

How we do it
============
* Parse for the FITS header
* Read the above key/values
* Unpack the binary data using jDataView