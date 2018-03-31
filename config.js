
//const Month = require('./models/month');
//const Account = require('./models/account');
//const Type = require('./models/type');
const _ = require('lodash')
const han = require('./handlers');
const tanita = require('./tanita');

function dbg(out) { console.log(out) }

function error(msg) {
  throw new Error(msg)
}

// phase: usually 'get' and 'post' but may be others. Usually mapped from the
// HTTP operation, but may be artifical
// levels: 1 - top level document, 2 - 1st sub-level document, and so on
function getHandlerSteps(handlerGeneratorFunc, phase, level, hasLastId) {
	dbg('getHandlerSteps invoked')
	//	dbg(type)
	const _handlerPhase = _.find(handlerGeneratorFunc(), { phase: phase })
	if (_.isUndefined(_handlerPhase))
		error(`Phase ${phase} for ${handlerGeneratorFunc.name} not found`)

	const _handlerType = _.find(_handlerPhase.types, { withId: hasLastId })
	if (_.isUndefined(_handlerType))
		error(`Type ${type} for phase ${phase} for ${handlerGeneratorFunc.name} not found`)

	const _handlers = _handlerType.handlers
	if (_.isEmpty(_handlers))
		error(`Handlers for ${handlerGeneratorData.name} not found`)
	return _handlers[Math.min(_handlers.length, level) - 1]
}

const defaultActionConf = [
  {
    action: 'display',
    aliases: ['zobraz', 'seznam' ],
    view: 'listEntities',
    handlerGenerator: han.handlerDisplay
  },
  {
    action: 'create',
    aliases: ['novy', 'nova', 'nove'],
    view: 'editEntity',
    handlerGenerator: han.handlerCreateDocument
  },
  {
    action: 'update',
    aliases: ['upravit', 'zmenit'],
    view: 'editEntity',
    handlerGenerator: han.handlerUpdateDocument
  },
  {
    action: 'delete',
    aliases: ['smazat', 'odstranit'],
    view: 'editEntity',
    handlerGenerator: han.handlerDeleteDocument
  }
]

const expenseFields = {
  name: 'expense',
  entita: 'vydaj',
  plural: 'vydaje',
  fields: [
    { name: '_id', type: String, required: true },
    { name: 'day', type: Number, required: true },
    { name: 'amount', type: Number, required: true },
    { name: 'paymentType', type: String, required: false },
    { name: 'types', type: [String], required: false },
    { name: 'notes', type: String }
  ]
}

const incomeFields = {
  name: 'income',
  entita: 'prijem',
  plural: 'prijmy',
  fields: [
    { name: '_id', type: String, required: true },
    { name: 'day', type: Number, required: true },
    { name: 'amount', type: Number, required: true },
    { name: 'types', type: [String], required: false },
    { name: 'notes', type: String }
  ]
}

const finConfig = {
  app: 'fin',
  entities: [
    {
      name: 'Type',
      entita: 'typ',
      plural: 'typy',
	  persistence: 'Mongosee',    // Mongosee, later, it will be a factorory function
      //schema: Type,
      actions: [ 
        { 
          action: 'copy', 
          aliases: [ 'kopie' ],
          view: 'editEntity',
          handlerGenerator: han.handlerCopyDocument
        } 
      ],
      // postFieldInit(fields),
      fields: [   // isEditable, isUpdatable, isCopyable
        {
          name: '_id',
          label: 'Id',
          pkSeq: 1,
          type: String,
          required: true,
          // fieldInit(field),
          isEditable: true,
          isUpdatable: false,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'type',
          label: 'Typ',
          type: String,
          required: true,
          enum: ['Expense', 'Income'],
          isEditable: true,
          isUpdatable: false,
          control: 'select',
          select: {
            name: 'type',
            options: [
              {
                value: 'Expense',
                isSelected: '',
                text: 'Výdaj'
              },
              {
                value: 'Income',
                text: 'Příjem'
              }
            ]
          }
        },
        {
          name: 'name',
          label: 'Jmeno',
          type: String,
          required: true,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'notes',
          label: 'Poznámky',
          type: String,
          required: false,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'order',
          label: '#',
          type: Number,
          required: false,
          default: 1000,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        }
      ]
    }, 
    {
      name: 'Month',
      entita: 'mesic',
      plural: 'mesice',
	  persistence: 'Mongosee',    // Mongosee, later, it will be a factorory function
      //schema: Month,
      fields: [
        {
          name: '_id',
          label: 'Id',
          type: String,
          required: true,
          isEditable: true,
          isUpdatable: false,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'name',
          label: 'Jmeno',
          type: String,
          required: true,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'notes',
          label: 'Poznámky',
          type: String,
          required: false,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'startDate',
          label: 'Datum začátku',
          type: Date,
          required: false,
          isEditable: true,
          isUpdatable: true,
          control: 'input',
          input: {
            type: 'text',
          }
        },
        {
          name: 'incomes',
          plural: 'prijmy',
          definition: incomeFields,
          label: 'Příjmy',
          type: Array,
        }, 
        {
          name: 'expenses',
          plural: 'vydaje',
          definition: expenseFields,
          label: 'expenses',
          type: Array,
        },
      ]
    }
  ]
}

module.exports.appConfig = [ finConfig, tanita.config ]

module.exports.defaultActionConf = defaultActionConf

module.exports.error = error
module.exports.getHandlerSteps = getHandlerSteps
//function hand
//////////////////////////////////
// top level DB set operations
//////////////////////////////////
/*function getSingleId(path) {
  return path[0].id
}

function createDocument(schema_, path_, document) {
  return schema.create(document)
}

function updateDocument(schema, path, partDoc) {
  return schema.findById(getSingleId(path)).exec().then((doc) => {
    return enrichDocument(doc, partDoc)
  }).then((doc) => {
    return doc.save()
  })
  //return schema.findByIdAndUpdate(getSingleId(path), document).exec()
}

function deleteDocument(schema, path) {
  return schema.findByIdAndRemove(getSingleId(path)).exec()
}

*/
//////////////////////////////////////
// 2nd/3rd level actions on document
//////////////////////////////////////

/*function findSubDocument(_schema, path, documentChildArray) {
  return documentChildArray.id(subId)
}*/
/*
function createSubDocument(schema, path, subDocument) {
  return schema.findById(getSingleId(path)).exec().then((doc) => {
    return enrichDocument(doc, partDoc)
  }).then((doc) => {
    findSubDocument(doc, path).create(subDocument)  
    return doc
  }).then((doc) => {
    return doc.save()
  })
  //documentChildArray.push(subDocument)
  //documentChildArray.create(subDocument)
}

function updateSubDocument(schema, path, partialSubDocument) {
  return schema.findById(getSingleId(path)).exec().then((doc) => {
    const subDoc = findSubDocument(doc, path).create(subDocument)  
    return [ doc, subDoc ]
  }).then(( [ doc, subDoc ] ) => {
    return enrichDocument(doc, subDoc)
  }).then((doc) => {
    return doc.save()
  })
  //const _subDoc = findSubDocument(documentChildArray, subId)
  //enrichDocument(_subDoc, partialSubDocument)
}

function deleteSubDocument(schema, path) {
  return schema.findById(getSingleId(path)).exec().then((doc) => {
    findSubDocument(doc, path).remove()  
    return doc
  }).then((doc) => {
    return doc.save()
  })
  //findSubDocument(documentChildArray, subId).remove()
}
*/

