/*
@exportId G0dUh5nQTli2aHtbXK3D3g
*/
module.exports = (function() {
return {
  workOrderFilterDescription: function(assignedUsersFilter, maintenanceTypeFilter, count) {
    let start;
    if (count === 0) {
      start = "There are no";
    } else if (count === 1) {
      start = "There is one";
    } else {
      start = `There are ${count}`;
    }
    return `${start} open ${
      maintenanceTypeFilter.toLowerCase() === "all" ? "" : maintenanceTypeFilter + " "
    }${
      count === 1 ? "work order" : "work orders"
    } assigned to ${
      assignedUsersFilter.toLowerCase() === "all" ? "anyone" : assignedUsersFilter
    }`;
  }
};
})()
     