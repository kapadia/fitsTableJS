fitsTableJS
=============

Yes, a JavaScript library for reading FITS Binary Tables :)

Dependencies
------------
This library is dependent upon jDataView
* https://github.com/vjeux/jDataView

Installation
------------
Include the dependent library and fitsTableJS

    <script src="path/to/jdataview.js" type="text/javascript" charset="utf-8"></script>
    <script src="path/to/fitsTable.js" type="text/javascript" charset="utf-8"></script>

Usage
-----
Using an XMLHttpRequest, retrieve an array buffer or binary string of the binary FITS file.

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "url/to/astro.png", true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        var ft = new FitsTable(xhr.response);
    };
    xhr.send();

    // The header must be read first
    ft.readHeader();
    
    // Then we may read the columns
    ft.readColumns();
    
    // Access the data
    console.log(ft.tableData);

Notes for me
------------

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
------------
* Parse for the FITS header
* Read the above key/values
* Unpack the binary data using jDataView

TODO:
-----

Support the follow data types that appear in FITS binary tables:

<table>
    <tr>
        <td>FITS format code</td>
        <td>Description</td>
        <td>Number of 8-bit bytes</td>
    </tr>
    <tr>
        <td>L*</td>
        <td>logical (Boolean)</td>
        <td>1</td>
    </tr>
    <tr>
        <td>X*</td>
        <td>bit</td>
        <td>*</td>
    </tr>
    <tr>
        <td>B</td>
        <td>Unsigned byte</td>
        <td>1</td>
    </tr>
    <tr>
        <td>I</td>
        <td>16-bit integer</td>
        <td>2</td>
    </tr>
    <tr>
        <td>J</td>
        <td>32-bit integer</td>
        <td>4</td>
    </tr>
    <tr>
        <td>K*</td>
        <td>64-bit integer</td>
        <td>4</td>
    </tr>
    <tr>
        <td>A</td>
        <td>character</td>
        <td>1</td>
    </tr>
    <tr>
        <td>E</td>
        <td>single precision floating point</td>
        <td>4</td>
    </tr>
    <tr>
        <td>D</td>
        <td>double precision floating point</td>
        <td>8</td>
    </tr>
    <tr>
        <td>C*</td>
        <td>single precision complex</td>
        <td>8</td>
    </tr>
    <tr>
        <td>M*</td>
        <td>double precision complex</td>
        <td>16</td>
    </tr>
    <tr>
        <td>P*</td>
        <td>array descriptor</td>
        <td>8</td>
    </tr>
</table>
\* Work in progress

References
----------
http://packages.python.org/pyfits/users_guide/users_table.html

BAM!