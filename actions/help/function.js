function(ellipsis) {
  ellipsis.success("", {
  choices: [{
    actionName: "setup",
    label: "Set up a review schedule",
    allowMultipleSelections: true,
    allowOthers: true
  }, {
    actionName: "List open work orders",
    label: "List open work orders",
    allowMultipleSelections: true,
    allowOthers: true
  }]
});
}
