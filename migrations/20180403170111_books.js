exports.up = (knex, Promise) => {
    return knex.schema.createTable('books', (table) => {
     // TABLE COLUMN DEFINITIONS HERE
     table.increments('id').primary()
     table.string('title', 255).notNullable().defaultTo('')
     table.string('author', 255).notNullable().defaultTo('')
     table.string('genre', 255).notNullable().defaultTo('')
     table.text('description', 255).notNullable().defaultTo('')
     table.text('cover_url', 255).notNullable().defaultTo('')
     table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
     table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
   })
}
exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('books')
}
