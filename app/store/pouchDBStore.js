import PouchDB  from 'pouchdb-browser';
PouchDB.plugin(require('pouchdb-find'));

const databases = {
  tasks: new PouchDB('tasks_db')
}

export function create(doc, type) {
  return databases[type].post(doc);
}

export function query(query, type) {
  return databases[type].find(query);
}

export function syncWith(upstream) {
  const remote = `${ upstream }/tasks_db`;

  return PouchDB
    .replicate(remote, 'stock_db', {
      live: false,
      retry: false
    });
}
