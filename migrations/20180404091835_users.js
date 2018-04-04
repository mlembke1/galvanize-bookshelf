exports.up = (knex, Promise) => {
    return knex.schema.createTable('users', (table) => {
     // TABLE COLUMN DEFINITIONS HERE
     table.increments('id').primary()
     table.string('first_name', 255).notNull().defaultTo('')
     table.string('last_name', 255).notNull().defaultTo('')
     table.string('email', 255).notNull().unique()
     table.specificType('hashed_password', 'char(60)').notNull()
     table.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
     table.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
   })
}
exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('users')
}
