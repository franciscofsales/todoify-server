import { merge } from 'lodash';
import mongoose, { Mongoose } from 'mongoose';
import configs from './configs';
// import mongofile from '../mongofile';

mongoose.set('useCreateIndex', true);

class Database {
  private mongoInstance: Mongoose;
  private config: object;

  async connect(
    options = {
      useNewUrlParser: true,
    }
  ): Promise<void> {
    if (!!this.mongoInstance) {
      return;
    }
    this.config = merge({}, options);
    this.mongoInstance = await mongoose.connect(
      configs.mongo.url,
      this.config
    );
  }

  async close(): Promise<void> {
    if (!this.mongoInstance) {
      return;
    }

    await this.mongoInstance.disconnect();
  }
}

export default new Database();
