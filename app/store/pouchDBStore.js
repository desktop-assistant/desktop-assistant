import PouchDB from 'pouchdb-browser';

PouchDB.plugin(require('pouchdb-find'));

const databases = {
  tasks: new PouchDB('tasks_db')
};

export function create(doc, type) {
  return databases[type].post(doc);
}

export function query(params, type) {
  return databases[type].find(params);
}

export function syncWith(upstream) {
  const remote = `${upstream}/tasks_db`;

  return PouchDB
    .replicate('tasks_db', remote, {
      live: false,
      retry: false
    });
}
