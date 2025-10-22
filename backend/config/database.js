const q = require('mysql2/promise');

const F = x => x.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/) 
  ? { u: RegExp.$1, p: RegExp.$2, h: RegExp.$3, P: +RegExp.$4, d: RegExp.$5 }
  : null;

let C = (() => {
  const e = process.env;
  let r = e.DATABASE_URL ? F(e.DATABASE_URL) : null;

  return r
    ? { ...r, user: r.u, password: r.p, host: r.h, port: r.P, database: r.d,
        waitForConnections: !0, connectionLimit: 10, queueLimit: 0 }
    : {
        host: e.DB_HOST || 'localhost',
        user: e.DB_USER || 'root',
        password: e.DB_PASSWORD || '',
        database: e.DB_NAME || 'tennis_store',
        port: e.DB_PORT || 3306,
        waitForConnections: !0,
        connectionLimit: 10,
        queueLimit: 0
      };
})();

const pool = q.createPool(C);

module.exports = pool;
