var atomize = function() {
  var els = document.getElementsByTagName("*"),
      len = els.length;
  for (var i = 0; i < len; i++) {
    var el = els[i],
        classes = el.classList,
        classes_len = classes.length,
        transformed_classes = [];
    if (classes_len === 0) continue;
    for (var j = 0; j < classes_len; j++) {
      transformed_classes.push.apply(
          transformed_classes,
          atomize_class(classes[j])
        );
    }
    for (var j = 0; j < transformed_classes.length; j++) {
      el.classList.add(transformed_classes[j]);
    }
  }
};

var atomize_class = function(bem_class) {
  return MOLECULES[bem_class];
};

document.addEventListener("DOMContentLoaded", function() {
  atomize();
});
