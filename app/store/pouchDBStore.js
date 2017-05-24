import fs from 'fs';
import PouchDB from 'pouchdb-browser';
import replicationStream from 'pouchdb-replication-stream';

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
PouchDB.plugin(require('pouchdb-find'));

const databasesName = {
  tasks: 'tasks_db',
  settings: 'settings_db'
};

const databases = {
  tasks: new PouchDB(databasesName.tasks),
  settings: new PouchDB(databasesName.settings)
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

export function complexQuery(map, options, type) {
  return databases[type].query(map, options);
}

export function remove(doc, type) {
  return databases[type].remove(doc);
}

export function destroyDB(type) {
  databases[type].destroy().then(() => {
    databases[type] = new PouchDB(databasesName[type]);
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
