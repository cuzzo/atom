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
    var class_dict = {},
        transform_len = transformed_classes.length;
    for (var j = 0; j < transform_len; j++) {
      class_dict[transformed_classes[j]] = true;
    }
    transformed_classes = Object.keys(class_dict);
    if (transformed_classes.length > 0) {
      el.className = transformed_classes.join(" ");
    }
    else {
      el.removeAttribute("class");
    }
  }
};

var atomize_class = function(bem_class) {
  var classes = MOLECULES[bem_class];
  if (SPLIT_MOLECULES[bem_class]) {
    classes.push(bem_class);
  }
  return classes;
};

document.addEventListener("DOMContentLoaded", function() {
  atomize();
});
