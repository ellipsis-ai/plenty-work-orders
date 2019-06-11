function(assignedUsers, maintenanceType, ellipsis) {
  const greeting = require('ellipsis-random-response').greetingForTimeZone(ellipsis.team.timeZone);
const workOrders = ellipsis.require('ellipsis-fiix@^0.2.0-beta').workOrders(ellipsis);

function workOrderTitle(wo, index) {
  return `${index + 1}. WO ${wo.strCode}`;
}

workOrders.getOpen().then((allWorkOrders) => {
  const workOrders = allWorkOrders.filter((wo) => {
    const users = (wo.strAssignedUsers || "").split(",").map((ea) => ea.trim());
    const woMaintenanceType = wo.extraFields && wo.extraFields.dv_intMaintenanceTypeID || "";
    const matchesUsers = assignedUsers.id === "all" ||
      users.some((ea) => ea === assignedUsers.label);
    const matchesType = maintenanceType.id === "all" ||
      woMaintenanceType === maintenanceType.label;
    return matchesUsers && matchesType;
  });
  let matchingMaintenanceType = maintenanceType.label;
  let matchingUsers = assignedUsers.label;
  if (workOrders.length === 0) {
    ellipsis.success(`
${greeting}

 🎉 ${workOrderFilterDescription(matchingMaintenanceType, matchingUsers, 0)} at this moment. ${getScheduleInfo()}`);
    return;
  }
  const numMatches = workOrders.length;
  const first5 = workOrders.slice(0, 5);
  const workOrderSummary = first5.map((wo, index) => {
    const woTitle = workOrderTitle(wo, index);
    const woMaintenanceType = wo.extraFields.dv_intMaintenanceTypeID || "";
    if (woMaintenanceType && maintenanceType.id !== "all") {
      matchingMaintenanceType = woMaintenanceType;
    }
    if (wo.strAssignedUsers && assignedUsers.id !== "all") {
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
    const taskSummary = tasks.length > 0 ? `> _Tasks:_\n${tasks.map((ea, index) => `> • ${ea.replace(/\n/g, "\n> ")}`).join("\n")}` : "";
    return `**${details.trim()}**
${asset}${description}${taskSummary}
`
  }).join("\n\n");
  const intro = `${workOrderFilterDescription(matchingMaintenanceType, matchingUsers, numMatches)}.${
    numMatches > 5 ? " Here are the first 5:" : ""
  }`;
  const result = `
${greeting}

${intro} ${getScheduleInfo()}

${workOrderSummary}

**Select a work order to mark it completed.**
`;
  ellipsis.success(result, {
    choices: workOrders.map((wo, index) => {
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
    })
  });
});

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

function workOrderFilterDescription(maintenanceTypeFilter, assignedUsersFilter, count) {
  let start;
  if (count === 0) {
    start = "There are no";
  } else if (count === 1) {
    start = "There is one";
  } else {
    start = `There are ${count}`;
  }
  return `${start} open ${
    maintenanceTypeFilter === "Any type" ? "" : maintenanceTypeFilter + " "
  }${
    count === 1 ? "work order" : "work orders"
  } assigned to ${
    assignedUsersFilter === "Any user" ? "anyone" : assignedUsersFilter
  }`;
}
}
