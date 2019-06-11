function(ellipsis) {
  const Users = ellipsis.require("ellipsis-fiix@^0.2.0-beta").users(ellipsis);
Users.getAllActive().then((users) => {
  ellipsis.success([{
    id: "all",
    label: "Any user"
  }].concat(users.map((ea) => {
    return {
      id: ea.id,
      label: ea.strFullName.trim(),
      email: ea.strEmailAddress
    };
  })))
});
}
