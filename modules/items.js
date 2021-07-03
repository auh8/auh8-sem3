
/** @Module Items */

import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

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
    async add(data) {
      
      console.log(data)
      let filename
      if(data.fileName) {
          filename = `${Date.now()}.${mime.extension(data.fileType)}`
          console.log(filename)
          await fs.copy(data.filePath, `public/avatars/${filename}`)
      }
      try {
        const sql = `INSERT INTO items(userid, photo, itemname, sellingprice)\
                      VALUES("${data.account}", "${filename}", "${data.itemname}", "${data.sellingprice}")`
        console.log(sql)
        await this.db.run(sql)
        return true
      } catch(err) {
        console.log(err)
        throw(err)
      }
      
    }
    async close() {
      await this.db.close()
    }
    
}
export default Items


