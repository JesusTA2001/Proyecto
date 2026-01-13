const bcrypt = require('bcrypt');

const hash = '$2b$10$VJpChhpOf11MXmFhZ3SEiOHoJYZVulMJ8TpGMXUfZT/JpJPbN6KxS';
const plain = '123456';

bcrypt.compare(plain, hash).then(r => {
  console.log('compare result:', r);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
