const $ = process.env;
export default {
  mongo: {
    url: $.MONGO_URI || 'mongodb://localhost:27017/todoify',
  },
  JWT_SECRET: $.JWT_SECRET || 'AkFIKhwRLPC6JA1SOFndBhQN6fr8hAgZxwOj4AojOzymUKzlvzSqlB6HVqM2fGg7',
  JWT_ALGORITHM: $.JWT_ALGORITHM || 'HS256',
  JWT_ACCESS_VALIDITY: $.JWT_ACCESS_VALIDITY || '7d',
  JWT_REFRESH_VALIDITY: $.JWT_REFRESH_VALIDITY || '30d',
};
