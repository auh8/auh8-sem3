
/** @Module Items */

import sqlite from 'sqlite-async'

class Items {
    
  constructor(dbName = ':memory:') {
    return (async() => {
      this.db = await sqlite.open(dbName)
      const sql = 'CREATE TABLE IF NOT EXISTS items(\
        id INTEGER PRIMARY KEY AUTOINCREMENT,\
        userid INTEGER,\
        photo TEXT,\
        itemname TEXT NOT NULL,\
        sellingprice TEXT,\
        FOREIGN KEY(userid) REFERENCES users(id)\
      );'
      await this.db.run(sql)
      return this
    })()
  }
   async all() {
     const sql = 'SELECT users.user, items.* FROM items, users\
                   WHERE items.userid = users.id;'
     const items = await this.db.all(sql)
     for(const index in items) {
       if(items[index].photo === null) items[index].photo = 'placeholder.jpg'
     }
     return items
   }
    
    
}

export default Items


