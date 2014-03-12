# AProgress
---

##### Lightweight Android themed loading indicator for AJAX applications

---

### Installation

Add aProgress.js to your project.

---
### Basic usage

Simply call:
* <code>AProgress.start()</code> when AJAX/XMLHTTPRequest starts
* <code>AProgress.done()</code> when AJAX/XMLHTTPRequest ends (calling success/error callback)

---
### Advanced usage (Configuration)

You can always change settings of your progress bar simply by calling <code>AProgress.config</code> (Note: changing styles of the bar can cause some mess, so do it carefully! Note to myself: try to hide bar's CSS).

* Change number of dots: <code>AProgress.config({numberOfDots: NEW_NUMBER});</code>
* Change selector's name (for example: bar):
```
var oldBar = AProgress.settings.bar,
      newBar = {};
newBar.selectorSign = oldBar.selectorSign;
newBar.css = oldBar.css;
newBar.selectorName = 'NEW_SELECTOR_NAME';
AProgress.config(bar: newBar);
```
---



