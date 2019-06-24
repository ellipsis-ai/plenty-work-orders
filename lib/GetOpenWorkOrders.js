/*
@exportId kxz0x4eWSRijfWpRZgk5eA
*/
module.exports = (function() {
return function(ellipsis, assignedUsers, maintenanceType) {
  const WorkOrders = ellipsis.require('ellipsis-fiix@^0.1.1').workOrders(ellipsis);
  return WorkOrders.getOpen().then((allWorkOrders) => {
    return Promise.resolve(allWorkOrders.filter((wo) => {
      const users = (wo.strAssignedUsers || "").split(",").map((ea) => ea.trim());
      const woMaintenanceType = wo.extraFields && wo.extraFields.dv_intMaintenanceTypeID || "";
      const matchesUsers = assignedUsers.toLowerCase() === "all" ||
        users.some((ea) => ea.toLowerCase() === assignedUsers.toLowerCase());
      const matchesType = maintenanceType.toLowerCase() === "all" ||
        woMaintenanceType.toLowerCase() === maintenanceType.toLowerCase();
      return matchesUsers && matchesType;
    }));
  });
};
})()
     