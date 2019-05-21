function(ellipsis) {
  // Write a Node.js (8.10) function that calls ellipsis.success() with a result.
// You can require any NPM package.
const name = ellipsis.event.user.fullName || "friend";
ellipsis.success(`Hello, ${name}.`);
}
