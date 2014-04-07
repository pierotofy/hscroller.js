## hscroller.js

This is a simple horizontal scrolling single page web template. It provides a more intuitive user experience when using touch devices while preserving the expectations of desktop users. Feel free to use/fork/share it.

* [Live demo](http://www.pierotoffanin.com/scrolling-demo/#)
* [Tutorial](http://www.pierotoffanin.com/2014/03/horizontal-scrolling-single-page-website-done-right/)

## Features

✓ Supports swipe gestures for touch-enabled devices

✓ Handles vertical scrolling in legacy browsers

✓ Hash routing for easy bookmarking/linking

✓ IE7+, Firefox 3.6+, Safari 4+ support

✓ Responsive			
	
✓ MIT permissive license

## Usage

### To add a new page, simply add a new element:

```html
<li class="page overthrow">
	content here
</li>
```

The pages are numbered by their position in the DOM. So the first element is page 0, the second is page 1, etc.

### To link a page use:

```html
<a href="#page.html" data-page="N">Link</a>
```

Replace N with an integer >= 0, first page starts at 0.

Replace page.html with a unique name for your page.

