import Database from './database';
import Server from './server';

Database.connect().then(() => {
  // tslint:disable-next-line
  console.log('Connected to database mongodb');
});
Server.start();

const shutdown = async done => {
  await Database.close();
  Server.stop(done);
};

// Nodemon
process.on('exit', shutdown.bind(null, process.exit));
process.on('SIGINT', shutdown.bind(null, process.exit));
process.on('uncaughtException', shutdown.bind(null, process.exit));
