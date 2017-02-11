import PouchDB  from 'pouchdb-browser';
PouchDB.plugin(require('pouchdb-find'));

const databases = {
  tasks: new PouchDB('tasks_db')
}

export function create(doc, type) {
  return databases[type].post(doc)
    // .then(response => {
    //   // handle response
    // }).catch(err => {
    //   console.log('err', err);
    // });
}

export function query(query, type) {
  return databases[type].find(query)
    // .then(response => {
    //   console.log('response', response)
    // }).catch(err => {
    //   console.log('err', err);
    // });
}

export function syncWith(upstream) {
  const remote = `${ upstream }/stock_db`;

  return PouchDB
    .replicate(remote, 'stock_db', {
      live: false,
      retry: false
    });
}
