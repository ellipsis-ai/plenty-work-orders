function(assignedUsers, maintenanceType, channel, recurrence, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const moment = require('moment-timezone');
const actions = new EllipsisApi(ellipsis).actions;

actions.unschedule({
  actionName: "List open work orders",
  channel: channel
}).then(() => actions.schedule({
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
})).then((result) => {
  const firstRun = moment.tz(result.scheduled.firstRecurrence, ellipsis.team.timeZone).format("LLLL z");
  ellipsis.success(`
OK, I will report open work orders for ${maintenanceType} assigned to ${assignedUsers} in the ${channel} channel, ${result.scheduled.recurrence}.

The first run will be ${firstRun}.`);
});
}
