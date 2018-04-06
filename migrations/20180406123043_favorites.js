exports.up = (knex, Promise) => {
    return knex.schema.createTable('favorites', (table) => {
     // TABLE COLUMN DEFINITIONS HERE
     table.increments('id').primary()
     table.integer('user_id').notNull().references('id').inTable('users').index().onDelete('CASCADE')
     table.integer('book_id').notNull().references('id').inTable('books').index().onDelete('CASCADE')
     table.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
     table.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
   })
}
exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('favorites')
}
