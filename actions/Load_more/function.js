function(workOrders, assignedUsers, maintenanceType, date, startIndex, ellipsis) {
  require("ListOpenWorkOrders")(ellipsis, assignedUsers, maintenanceType, date, Number.parseInt(startIndex, 10), workOrders);
}
