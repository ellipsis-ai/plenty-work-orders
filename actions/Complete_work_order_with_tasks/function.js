function(workOrderId, notifyChannel, ellipsis) {
  const ellipsisFiix = require('EllipsisFiixLoader')(ellipsis);
const moment = require('moment-timezone');
const workOrders = ellipsisFiix.workOrders(ellipsis);

workOrders.getCompletedStatusId().then((completedID) => {
  workOrders.find(workOrderId).then((wo) => {
    if (!wo || wo.intWorkOrderStatusID === completedID) {
      const dateCompleted = wo.dtmDateCompleted ? 
        moment(wo.dtmDateCompleted).tz(ellipsis.team.timeZone).format(" [on] M/D/YYYY [at] h:mm A") : "";
      ellipsis.success(`Work order ${wo.strCode} was already marked complete${dateCompleted}.`)
    } else {
      return beginWorkOrderCompletion(wo);
    }
  });
});

function beginWorkOrderCompletion(wo) {
  return workOrders.getTasksFor(workOrderId).then((tasks) => {
    const firstTask = tasks[0];
    const createdDate = moment.tz(wo.dtmDateCreated, ellipsis.team.timeZone).format("M/D/YYYY");
    const woTitle = `Work order ${wo.strCode}`;
    const maintenanceType = wo.extraFields.dv_intMaintenanceTypeID || "";
    const siteID = wo.extraFields.dv_intSiteID || "";
    const details = [maintenanceType, siteID]
      .map((ea) => ea.trim())
      .filter((ea) => Boolean(ea))
      .join(" · ");
    const asset = wo.strAssets ? `_Asset:_ ${wo.strAssets}\n` : "";
    const taskIntro = tasks.length === 1 ?
      "There is one task in this work order." : `There are ${tasks.length} tasks in this work order.`;
    const firstTaskDescription = tasks.length === 1 ? (`• ${firstTask.strDescription}` || "") : 
      `Task 1: ${firstTask.strDescription || "(no description available)"}`;
    ellipsis.success(`
You have chosen to mark ${woTitle} (opened ${createdDate}) complete.

**${details}**
${asset}
_Description:_ ${wo.strDescription || "(none)"}

${taskIntro}

${firstTaskDescription}
  `, {
      next: {
        actionName: "Complete work order task",
        args: [{
          name: "taskId",
          value: String(firstTask.id)
        }, {
          name: "taskNumber",
          value: "1"
        }, {
          name: "remainingTaskData",
          value: JSON.stringify(tasks.slice(1))
        }, {
          name: "notifyChannel",
          value: notifyChannel
        }, {
          name: "previousNotes",
          value: ""
        }]
      }
    });
  });
}
}
