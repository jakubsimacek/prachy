const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')

// returns true if the entity already exists
const containsEntity = function (entityList, name) {
  (_.findIndex(entityList, (ent) => { ent.name == name }) == -1) ? false : true
}

// stores entyty to the entity list
const storeEntity = function (entityList, name, entity) {
console.log('==== storeEntity ====')
console.log(`name: ${name}`)
console.log(entity)
  if (containsEntity(entityList, entity.name))
    throw new Exception(`Entity ${entity.name} already stored to the entity list!`)
  entityList[entity.name] = entity
}

// recursively processes row of fields
const processFields = function(entityList, fields) {
//console.log('@@@@@ processFields @@@@@')
  return _.map(fields, (field) => {
//console.log('---- field ----')
//console.log(field)
    if (field.type == Array) {
      if (containsEntity(entityList, field.name)) {
//console.log('array-existing> ', field.name)
        return {
          name: field.name,
          type: [entityList[field.name]],
          required: (field.required == true) ? true : false
        }
      }
      else {
//console.log('array-new>')
//console.log(field)
        const subEntity = processFields(entityList, field.definition.fields)
//console.log('subEntity: ', field.name)
//console.log(subEntity)
        storeEntity(entityList, field.name, subEntity)
//console.log('definition: ')
//console.log()
        return {
          name: field.name,
          type: [subEntity],
          required: (field.required == true) ? true : false
        }
      }
    }
    else {
      return {
        name: field.name,
        type: field.type,
        required: (field.required == true) ? true : false
      }
    }
  })
}

const initializeSchemas = function (appConf) {
  const entityList = new Object()
  _.forEach(appConf, (app) => {
    _.forEach(app.entities, (entity) => {
      const ent = processFields(entityList, entity.fields)
       storeEntity(entityList, entity.name, ent)
       console.log(`***** registering a new schema ${entity.name} *****`)
       //console.log(ent)
       entity.schema = mongoose.model(entity.name, new Schema(ent))
    })
  })
  appConf.schemas = entityList
  console.log('##### Schemas initialized #####')
}

module.exports.initializeSchemas = initializeSchemas

