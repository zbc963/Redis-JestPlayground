const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey =  JSON.stringify(options.key || 'default');

  return this;
}

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache){
    return exec.apply(this, arguments);
  }
  // assign attribute to an empty object
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });

  //see if we have a vlaue for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, JSON.stringify(key));

  //if we do, return that
  if(cacheValue){
    const doc = JSON.parse(cacheValue);
    return doc.constructor !== Object ? doc.map(d => new this.model(d)) : new this.model(doc); 
  }
  //otherwise, issue the query and stroe the result in the redis
  const result = await exec.apply(this, arguments);
  client.hset(this.hashKey, JSON.stringify(key), JSON.stringify(result), 'EX', 10);
  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}