/*
@exportId G0dUh5nQTli2aHtbXK3D3g
*/
module.exports = (function() {
const moment = require('moment-timezone');
return {
  workOrderFilterDescription: function(assignedUsersFilter, maintenanceTypeFilter, date, timeZone, count) {
    let start;
    if (count === 0) {
      start = "There are no";
    } else if (count === 1) {
      start = "There is **1**";
    } else {
      start = `There are **${count}**`;
    }
    const dateOpened = moment.tz(date, timeZone).format("MMMM D");
    return `${start} open ${
      maintenanceTypeFilter.toLowerCase() === "all" ? "" : `_${maintenanceTypeFilter}_ `
    }${
      count === 1 ? "work order" : "work orders"
    } assigned to _${
      assignedUsersFilter.toLowerCase() === "all" ? "anyone" : assignedUsersFilter
    }_ opened _${dateOpened}_`;
  }
};
})()
     