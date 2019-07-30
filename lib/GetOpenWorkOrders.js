/*
@exportId kxz0x4eWSRijfWpRZgk5eA
*/
module.exports = (function() {
const moment = require('moment-timezone');

function workOrderOpenedBetween(dateCreated, startFilter, endFilter) {
  return !startFilter || !endFilter || dateCreated.isBetween(startFilter, endFilter);
}

return function(ellipsis, assignedUsers, maintenanceType, date) {
  const ellipsisFiix = require('EllipsisFiixLoader')(ellipsis);
  const WorkOrders = ellipsisFiix.workOrders(ellipsis);
  const startFilter = date ? moment.tz(date, ellipsis.team.timeZone).startOf('day') : null;
  const endFilter = date ? moment.tz(date, ellipsis.team.timeZone).endOf('day') : null;
  return WorkOrders.getOpen().then((allWorkOrders) => {
    return Promise.resolve(allWorkOrders.filter((wo) => {
      const users = (wo.strAssignedUsers || "").split(",").map((ea) => ea.trim());
      const woMaintenanceType = wo.extraFields && wo.extraFields.dv_intMaintenanceTypeID || "";
      const matchesUsers = assignedUsers.toLowerCase() === "all" ||
        users.some((ea) => ea.toLowerCase() === assignedUsers.toLowerCase());
      const matchesType = maintenanceType.toLowerCase() === "all" ||
        woMaintenanceType.toLowerCase() === maintenanceType.toLowerCase();
      const matchesDate = workOrderOpenedBetween(moment(wo.dtmDateCreated), startFilter, endFilter);
      return matchesUsers && matchesType && matchesDate;
    }));
  });
};

})()
     