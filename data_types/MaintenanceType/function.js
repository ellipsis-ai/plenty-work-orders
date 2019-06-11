function(ellipsis) {
  const MaintenanceTypes = ellipsis.require("ellipsis-fiix@^0.2.0-beta").maintenanceTypes(ellipsis);
MaintenanceTypes.getAll().then((maintenanceTypes) => {
  ellipsis.success([{
    id: "all",
    label: "Any type"
  }].concat(maintenanceTypes.map((ea) => {
    return {
      id: ea.id,
      label: ea.strName.trim(),
      code: ea.intSysCode
    };
  })))
});
}
