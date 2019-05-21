function(taskId, taskNumber, remainingTaskData, notifyChannel, hours, ellipsis) {
  const remainingTasks = JSON.parse(remainingTaskData);
const ellipsisFiix = ellipsis.require('ellipsis-fiix@^0.1.0');
const workOrders = ellipsisFiix.workOrders(ellipsis);
const users = ellipsisFiix.users(ellipsis);
const EllipsisApi = require('ellipsis-api');
const actionsApi = new EllipsisApi(ellipsis);

users.userIdForEmail(ellipsis.event.user.email).then((userId) => {
  return workOrders.completeTask(taskId, userId, hours).then((updatedTask) => {
    if (remainingTasks.length > 0) {
      return finishRemainingTasks();
    } else {
      return workOrders.getCompletedStatusId().then((newStatusId) => {
        return workOrders.complete(updatedTask.intWorkOrderID, newStatusId, userId).then((updatedWorkOrder) => {
          return workOrderCompleted(updatedWorkOrder);
        });
      })
    }
  });
});

function finishRemainingTasks() {
  const intro = `OK, task ${taskNumber} marked complete.`
  const nextTask = remainingTasks[0];
  const nextTaskNumber = Number.parseInt(taskNumber, 10) + 1
  const nextTaskSummary = `Task ${nextTaskNumber}: ${remainingTasks[0].strDescription || "(no description available)"}`;
  const remainingTaskSummary = remainingTasks.length === 1 ? "There is one more task:" : `There are ${remainingTasks.length} more tasks.`;
  const result = `
${intro} ${remainingTaskSummary}

${nextTaskSummary}`;
  ellipsis.success(result, {
    next: {
      actionName: "Complete work order task",
      args: [{
        name: "taskId",
        value: String(nextTask.id)
      }, {
        name: "taskNumber",
        value: String(nextTaskNumber)
      }, {
        name: "remainingTaskData",
        value: JSON.stringify(remainingTasks.slice(1))
      }]
    }
  });
}

function getChannelId() {
  return ellipsis.event.message && ellipsis.event.message.channel && ellipsis.event.message.channel.id;
}

function workOrderCompleted(workOrder) {
  const intro = `OK, work order ${workOrder.strCode} is now marked complete.`;
  announceCompletion(workOrder).then(() => ellipsis.success(intro));
}

function announceCompletion(workOrder) {
  if (notifyChannel !== "none" && notifyChannel !== getChannelId()) {
    return actionsApi.say({
      message: `✅ Work order ${workOrder.strCode} has been marked complete by ${ellipsis.event.user.formattedLink}.`,
      channel: notifyChannel
    }).catch(() => {
      console.log(`Unable to announce work order completion to channel ID ${notifyChannel}`);
    });
  } else {
    return Promise.resolve(null);
  }
}
}
