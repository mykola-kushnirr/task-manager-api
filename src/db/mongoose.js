const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.DATABASE);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().catch(err => console.log(err));
