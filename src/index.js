const app = require("./app");

async function main() {
  await app.listen(process.env.PORT || 5000);
  console.log(`Server funcionando en http://localhost:5000`);
}

main();
