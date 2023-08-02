exports.handler = (data) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = require('crypto');
  console.log('Inside Transform handler', randomUUID());
  return data;
};
