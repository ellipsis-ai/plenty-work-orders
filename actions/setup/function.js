function(assignedUsers, maintenanceType, channel, recurrence, countRecurrence, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const moment = require('moment-timezone');
const actions = new EllipsisApi(ellipsis).actions;

actions.unschedule({
  actionName: "List open work orders",
  channel: channel
}).then(() => actions.unschedule({
  actionName: "Count open work orders",
  channel: channel
})).then(() => actions.schedule({
  actionName: "List open work orders",
  channel: channel,
  recurrence: recurrence,
  args: [{
    name: "assignedUsers",
    value: assignedUsers
  }, {
    name: "maintenanceType",
    value: maintenanceType
  }]
})).then((listResult) => {
  if (countRecurrence.toLowerCase() === "never") {
    return Promise.resolve({
      list: listResult
    });
  } else {
    return actions.schedule({
      actionName: "Count open work orders",
      channel: channel,
      recurrence: countRecurrence,
      args: [{
        name: "assignedUsers",
        value: assignedUsers
      }, {
        name: "maintenanceType",
        value: maintenanceType
      }]
    }).then((countResult) => {
      return Promise.resolve({
        list: listResult,
        count: countResult
      });
    });
  }
}).then((results) => {
  const firstRun = moment.tz(results.list.scheduled.firstRecurrence, ellipsis.team.timeZone).format("LLLL z");
  const listSummary = `
OK, I will report open work orders for ${maintenanceType} assigned to ${assignedUsers} in the ${channel} channel, ${results.list.scheduled.recurrence}.

The first run will be ${firstRun}.`;
  const countSummary = results.count ? `

I will remind you about how many open work orders there are ${results.count.scheduled.recurrence}.` : "";
  ellipsis.success(listSummary + countSummary);
});
}
