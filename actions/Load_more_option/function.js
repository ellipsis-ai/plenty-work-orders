function(workOrders, assignedUsers, maintenanceType, date, startIndex, ellipsis) {
  const workOrderData = JSON.parse(workOrders);
const numBatches = Math.ceil(workOrderData.length / 5);
const batchNumber = Math.floor(Number.parseInt(startIndex, 10) / 5) + 1;
ellipsis.success("", {
  choices: [{
    label: `Next batch (${batchNumber}/${numBatches})`,
    actionName: "Load more",
    allowOthers: true,
    allowMultipleSelections: true,
    args: [{
      name: "workOrders",
      value: workOrders
    }, {
      name: "assignedUsers",
      value: assignedUsers
    }, {
      name: "maintenanceType",
      value: maintenanceType
    }, {
      name: "date",
      value: date
    }, {
      name: "startIndex",
      value: startIndex
    }]
  }]
});
}
