Usage
=======

To make glutton work like in the example all you have to do is create a button with the correct classes
and fire it of on click with a callback that returns a promise. Like so:

```html
<button id="tester" class="glutton fill-horizontal">Test me!</button>
```

```javascript
$("#tester").on("click", function () {
  $(this).glutton("start", asyncEvent);
});
```

Glutton ships with a default set of callbacks that fills the button from the left upon progress.
To declare your own callbacks, extend the Glutton.Variations object:

```javascript
$.extend(Glutton.Variations, {
  "fill-vertical": {
    onProgressed: function (element, progression) {
      progressBar = element.find(".progress");
      
      progressBar.height(progression + "%");
    }
  }
});
```

Then in your call to "glutton('start', callback)", pass along the name of your variation:
```javascript
$(this).glutton("start", asyncEvent, "fill-vertical");
```

