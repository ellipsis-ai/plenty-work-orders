/*
@exportId uAbtebBnQNSuejgqqN-1og
*/
module.exports = (function() {
const WOD = require('WorkOrderDescription');
return function(ellipsis, assignedUsers, maintenanceType, startIndex, workOrderJson) {

const greeting = require('ellipsis-random-response').greetingForTimeZone(ellipsis.team.timeZone);
if (workOrderJson) {
  processWorkOrders(JSON.parse(workOrderJson));
} else {
  require('GetOpenWorkOrders')(ellipsis, assignedUsers, maintenanceType).then((workOrders) => processWorkOrders(workOrders));
}

function processWorkOrders(workOrders) {
  if (workOrders.length === 0) {
    ellipsis.success(`
${greeting}

 🎉 ${WOD.workOrderFilterDescription(assignedUsers, maintenanceType, 0)} at this moment. ${getScheduleInfo()}`);
    return;
  }
  let matchingMaintenanceType = maintenanceType;
  let matchingUsers = assignedUsers;
  const numMatches = workOrders.length;
  const first5 = workOrders.slice(startIndex, startIndex + 5);
  const numShown = first5.length;
  const nextStartIndex = numMatches > startIndex + numShown ? startIndex + numShown : null;
  const workOrderSummary = first5.map((wo, index) => {
    const woTitle = workOrderTitle(wo, index);
    const woMaintenanceType = wo.extraFields.dv_intMaintenanceTypeID || "";
    if (woMaintenanceType && maintenanceType.toLowerCase() !== "all") {
      matchingMaintenanceType = woMaintenanceType;
    }
    if (wo.strAssignedUsers && assignedUsers.toLowerCase() !== "all") {
      matchingUsers = wo.strAssignedUsers;
    }
    const siteID = wo.extraFields.dv_intSiteID || "";
    const details = [woTitle, woMaintenanceType, siteID]
      .map((ea) => ea.trim())
      .filter((ea) => Boolean(ea))
      .join(" · ");
    const asset = wo.strAssets ? `Asset: ${wo.strAssets}\n` : "";
    const description = wo.strDescription ? `> ${wo.strDescription.trim().replace(/\n/g, "\n> ")}\n` : "";
    const tasks = wo.tasks
      .map((task) => task.strDescription)
      .filter((ea) => Boolean(ea));
    const taskSummary = tasks.length > 0 ? `> _Tasks:_\n${taskSummaryFor(tasks)}` : "";
    return `**${details.trim()}**
${asset}${description}${taskSummary}`;
  }).join("\n\n");
  const intro = `${WOD.workOrderFilterDescription(matchingMaintenanceType, matchingUsers, numMatches)}. ${batchDescription(numMatches, startIndex, numShown)}`;
  const result = `
${startIndex > 0 ? "" : greeting}

${intro} ${getScheduleInfo()}

${workOrderSummary}

**Select a work order to mark it completed.**
`;
  ellipsis.success(result, {
    choices: first5.map((wo, index) => {
      return {
        actionName: "Complete work order with tasks",
        label: workOrderTitle(wo, index),
        args: [{
          name: "workOrderId",
          value: String(wo.id)
        }, {
          name: "notifyChannel",
          value: getChannelId() || "none"
        }],
        allowOthers: true,
        allowMultipleSelections: true
      };
    }),
    next: nextStartIndex ? {
      actionName: "Load more option",
      args: [{
        name: "workOrders",
        value: JSON.stringify(workOrders)
      }, {
        name: "assignedUsers",
        value: assignedUsers
      }, {
        name: "maintenanceType",
        value: maintenanceType
      }, {
        name: "startIndex",
        value: String(nextStartIndex)
      }]
    } : null
  });
}

function getChannelId() {
  return ellipsis.event.message && ellipsis.event.message.channel && ellipsis.event.message.channel.id;
}

function getScheduleInfo() {
  if (ellipsis.event.schedule) {
    return `_[⏰ Edit schedule](${ellipsis.event.schedule.editLink})_`;
  } else {
    return "";
  }
}

function workOrderTitle(wo, index) {
  return `${index + 1}. WO ${wo.strCode}`;
}

function batchDescription(numMatches, startIndex, numShown) {
  const numBatches = Math.ceil(numMatches / 5);
  const batchNumber = Math.floor(startIndex / 5) + 1;
  if (startIndex === 0) {
    if (numShown < numMatches) {
      return ` Here are the first ${numShown} work orders (batch 1 of ${numBatches}):`;
    } else {
      return "";
    }
  } else {
    if (numShown > 1) {
      return ` Here are the next ${numShown} work orders (batch ${batchNumber} of ${numBatches}):`;
    } else {
      return ` Here is the last work order:`;
    }
  }
}

function taskSummaryFor(tasks) {
  return tasks.map((ea, index) => {
    const text = `> • ${ea.replace(/\n/g, "\n> ")}`;
    if (text.length > 150) {
      return text.slice(0, 150) + "… _(cont.)_";
    } else {
      return text;
    }
  }).join("\n");
}

}

})()
     