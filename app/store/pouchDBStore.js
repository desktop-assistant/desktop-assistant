import fs from 'fs';
import PouchDB from 'pouchdb-browser';
import replicationStream from 'pouchdb-replication-stream';

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
PouchDB.plugin(require('pouchdb-find'));

const databases = {
  tasks: new PouchDB('tasks_db'),
  settings: new PouchDB('settings_db')
};

export function create(doc, type) {
  return databases[type].put(doc);
}

export function update(params, type) {
  return databases[type].put(params);
}

export function query(params, type) {
  return databases[type].find(params);
}

export function remove(doc, type) {
  return databases[type].remove(doc);
}

export function destroyDB() {
  databases.tasks.destroy().then(() => {
    databases.tasks = new PouchDB('tasks_db');
    return true;
  }).catch(e => e);
}

export function exportDB(path) {
  const ws = fs.createWriteStream(`${path}/my-desktop-assistant-export.txt`);
  return databases.tasks.dump(ws).then(res => res);
}

export function importDB(path) {
  const ws = fs.createReadStream(path);
  return databases.tasks.load(ws).then(res => res);
}

export function syncWith(upstream) {
  const remote = `${upstream}/tasks_db`;

  return PouchDB
    .replicate('tasks_db', remote, {
      live: false,
      retry: false
    });
}
