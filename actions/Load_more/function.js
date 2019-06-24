function(workOrders, assignedUsers, maintenanceType, startIndex, ellipsis) {
  require("ListOpenWorkOrders")(ellipsis, assignedUsers, maintenanceType, Number.parseInt(startIndex, 10), workOrders);
}
