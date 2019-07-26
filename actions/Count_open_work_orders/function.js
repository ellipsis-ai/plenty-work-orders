function(assignedUsers, maintenanceType, date, ellipsis) {
  const greeting = require('ellipsis-random-response').greetingForTimeZone(ellipsis.team.timeZone);
const WOD = require("WorkOrderDescription");
const intro = ellipsis.event.schedule ? greeting : "";
const reminder = ellipsis.event.schedule ? "Reminder: " : "";
require('GetOpenWorkOrders')(ellipsis, assignedUsers, maintenanceType, date).then((workOrders) => {
  ellipsis.success(`
${intro}

${reminder}${WOD.workOrderFilterDescription(assignedUsers, maintenanceType, date, ellipsis.team.timeZone, workOrders.length)}.
`);
});
}
