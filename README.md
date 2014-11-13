# Coady tumblr theme

Staging link: [http://coadycode.tumblr.com](http://coadycode.tumblr.com)

## Project setup

```
npm install
bower install
gulp
```

## Code format

### Functions
> Full yuidoc comments
> Two line breaks before next function

```
/**
 *  Desc
 *
 *  [@private]
 *  [@static]
 *  @function/@method name 
 *  @param {Type} param Desc
 *  @param {Type} param2 Desc
 *  [@return {Type} Desc]
 */
function name ( param, param2 ) {
  
  ...
}


/**
 *  Desc
```

### Early return
> Commented underline matching line length

```
function whatever () {
  
  if ( expression ) return;
  // ----------------------

  ...
}
```

### If statements

```
if ( expression ) {
  
  ... multiple statements ...
}

if ( expression ) single statement;
```

### Browserify dependencies
> Tab all to match the length of the longest named dependencies

```
var Dep1              = require('dep1'),
    Dep2              = require('dep2'),
    DepWithLongName   = require('depwithlongname');
```

## Z-index

- Modal window: 150
- Tooltips: 150
- Navbar: 100
