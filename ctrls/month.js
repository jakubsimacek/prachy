const util = require('../util');
//const formatDate = require('format-date');
//const CircularJSON = require('circular-json');
//const { check, validationResult } = require('express-validator/check')
//const { matchedData, sanitize } = require('express-validator/filter')
const compose = require('compose-function')
const { curry } = require('curry-this')
const cfg = require('../config')
const _ = require('lodash')


// LISTS
//router.get('/prachy/mesice', 
module.exports.getListMonths = function (req, res) {
  Month.find({}).
  limit(24).
  sort({ _id: 1 }).
  exec().
  then(months => {
    const rendata = {
      title: 'Měsíce',
      months: months.map(function addTotals (m) {
        return {
          _id: m._id,
          state: m.state,
          notes: m.notes,
          sumExpenses: m.expenses.map(e => e.amount).reduce((a, b) => a + b, 0),
          sumIncomes: m.incomes.map(e => e.amount).reduce((a, b) => a + b, 0)
        }
      })
    }
    return rendata
  }).then(rendata => {
console.log(rendata)
    res.render('listMonths', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render months', err)
  })
}

// add month
//router.get('/prachy/mesic/novy', 
module.exports.getCreateMonth = function (req, res) {
  // zjisti prvni neexistujici mesic v budoucnosti nebo pritomnosti a preda ho jako vychozi hodnotu
  res.render('createMonth', {title: 'Nový měsíc'});
}

module.exports.postCreateMonth = function (req, res) {
console.log('postCreateMonth called')
  //const errors = validationResult(req)
  //if (!errors.isEmpty())
    //return util.renderr(res, 'Validation errors', errors)
  const _year = req.body.year
  const _month = (req.body.month.length == 1) ? '0' + req.body.month : req.body.month
  const _notes = req.body.notes
  const newMonth = new Month({
    _id: _year + "/" + _month,
    state: 'Nový',
    notes: _notes,
    //name: _year + "/" + _month,
    startDate: new Date(_year + '-' + _month + '-01T00:00:00'),
    expenses: [],
    incomes: []
  })
  newMonth.save().then(function onSaveThen (doc) {
    res.redirect('/prachy/mesice');
  }).catch(function onSaveCatch (err) {
    util.renderr(res, 'Cannot save a new month', err, newMonth);
  })
}

// edit month
//router.get('/prachy/mesic/:year/:month', 
module.exports.getEditMonth = function (req, res) {
  const _year = req.params.year
  const _month = req.params.month
  const _id = _year + '/' + _month
  Month.findOne({ _id: _id }).
  exec().
  then(month => {
    const rendata = {
      title: 'Měsíc ' + _id,
      _id: _id,
      sumExpenses: month.expenses.map(e => e.amount).reduce((a, b) => a + b, 0),
      sumIncomes: month.incomes.map(e => e.amount).reduce((a, b) => a + b, 0)
    }
    return rendata
  }).then(rendata => {
console.log(rendata)
    res.render('editMonth', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render a month', err)
  })
}


module.exports.postEditMonth = function (req, res) {

}

// add expense to month
//router.get('/prachy/mesic/:year/:month/vydaj', 
module.exports.getAddExpense = function (req, res) {
  const _year = req.params.year
  const _month = req.params.month
  const _id = _year + '/' + _month
  Month.findOne({ _id: _id }).
  exec().
  then(month => {
    const rendata = {
      title: 'Přidat výdaj v měsíci ' + _id,
      _id: _id
    }
    return rendata
  }).then(rendata => {
console.log(rendata)
    res.render('editMonth', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render page editMonth', err)
  })
}


// edit types
//router.get('/prachy/:entitas', 
module.exports.getListTypes = function (req, res) {
  Type.find({}).
  //limit(24).
  sort([[ 'type', 1 ], [ 'order', 1 ], [ '_id', 1 ]]).
  exec().
  then(types => {
    const rendata = {
      form: {
        title: 'Typy',
        isCreating: true,
        isDeleting: false,
        isUpdating: false,
        isReadOnly: false,
        submitButtonValue: 'Vytvořit',
        backUrl: '/prachy/typy'
      },
      error: {},
      types: types.map(function enrichType (t) {
        return {
          _id: t._id,
          type: (t.type == 'Expense') ? 'Výdaj' : 'Příjem',
          name: t.name,
          order: (t.order) ? t.order : 1000,
          notes: t.notes
        }      
      })
    }
    return rendata
  }).then(rendata => {
//console.log(rendata)
    res.render('listTypes', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render page listTypes', err)
  })
}


/////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////

function getEntityConfiguration(app, entita, akce) {
  const _entityConf = _.find(cfg.appConfig, (ec) => { return ec.app == app })
  const _cfg = _find(cfg.entityConf, (ec) => {
    
  })
  return {
    app: app,
    action: action,
    entity: entity,
    schema: schema,
    handler: handler,
    conf: conf
  }
}
function getEntityConf(entityType) {
  const _cfg = cfg.entityConf.filter(ec => ec.name == entityType)
  return (_cfg == null) ? Promise.reject(`Entity type ${entityType} not found in the config!`) : Promise.resolve(_cfg[0])
}

function getEntitaConf(entita) {
  const _cfg = cfg.entityConf.filter(ec => ec.entita == entita)
  return (_cfg == null) ? Promise.reject(`Entity type alias ${entita} not found in the config!`) : Promise.resolve(_cfg[0])
}

function getEntitasConf(entitas) {
  const _cfg = cfg.entityConf.filter(ec => ec.plural == entitas)
  return (_cfg == null) ? Promise.reject(`Entity type plural alias ${entitas} not found in the config!`) : Promise.resolve(_cfg[0])
}


const deepClone = (object) => JSON.parse(JSON.stringify(object))

const addValuesToFields = (fields, document) => {
  fields.forEach(i => { 
    i.value = document[i.name]
  })
  return fields
} 

const prepareFields = (document) => compose(
  curry.call(addValuesToFields)(document),
  deepClone
)

function actionNotRecognized(action) {
    throw new Error(`Action "${action}" not recognized!`)
}

function akceToAction(akce) {
  const ret = _.find(cfg.actionConf, (o) => {
    return o.action == akce || _.includes(o.aliases, akce)
  })
  if (ret == undefined)
    actionNotRecognized(akce)
  return ret.action
}

const isCreate = (action) => action == 'create'
const isUpdate = (action) => action == 'update'
const isDelete = (action) => action == 'delete'

// initialize model
function initializeModel(action, schema, id) {
  if (action == 'delete')
    return schema.findOne({ id: id }).exec()
  else if (action == 'create')
    return Promise.resolve({})
  else
    actionNotRecognized(action)
}

// perform action
function performAction(schema, action, id, document) {
//  console.log(action)
  if (action == 'delete' || action == 'update')
    return schema.findByIdAndRemove(id).exec()
  else if (action == 'update')
    return schema.findByIdAndUpdate(id, document).exec()
  else if (action == 'create')
    return schema.create(document)
  else
    actionNotRecognized(action)
}

const createDocumentFromBody = (body, confFields) => {
  const _doc = {}
  confFields.forEach(cf => {
    const _name = cf.name
    const _value = body[_name]
    const _toStore = (_value) ? _value : cf.defaultValue
    if (_toStore)
      _doc[_name] = _toStore
  })
  return _doc
}

const renderListEntities = function (req, res, pohled, entitas) {

}

const renderEditEntity = function (req, res, entita, akce, id) {
  console.log(`renderEditTEntity called as ${akce} for ${entita} with ${id}`)
  const _action = akceToAction(akce)
  let _ec = null
  getEntitaConf(entita).then(ec => {
    _ec = ec
    return initializeModel(_action, ec.schema, id) 
  }).then(model => {
    return (model == null) ? Promise.reject(`Entity type ${entita} with id ${id} not found!`) : _ec.name
  }).then(model => {
    const rendata = {
      fields: prepareFields(_ec.fields)(_ec.name),
      form: {
        id: id,
        title: 'Typ ' + id,
        isCreating: isCreate(_action),
        isDeleting: isDelete(_action),
        isUpdating: isUpdate(_action),
        isReadOnly: isDelete(_action),
        action: _action,
        akce: akce,
        submitButtonValue: _.startCase(_action),
        backUrl: '/prachy/typy'
      }
    }
    return rendata
  }).then(rendata => {
    console.log(rendata)
    res.render('editEntity', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render a type', err)
  })
}

const processEditEntity = function (req, res, akce, entita, id, body) {
  console.log(`postEditTEntity called with ${entita}, ${id}, ${akce}`)

  const _action = akceToAction(akce)
  let _entityConf = null

  getEntitaConf(entita).then(ec => {
    _entityConf = ec
    return createDocumentFromBody(req.body, _entityConf.fields)
  }).then(function doAction (document) {
    return performAction(_entityConf.schema, _action, id, document)
  }).then(function redirect(whatever) {
    res.redirect(`/prachy/${_entityConf.plural}`);
  }).catch(function onSaveCatch (err) {
    util.renderr(res, `Cannot ${_action} an entity type ${entita} with id ${id}`, err);
  })
}

// /:app/:entita/:akce/:id
module.exports.generalGetController = function (req, res) {
  const entConf = getEntityConfiguration(req.params.app, req.params.entita, req.params.akce)
}

// /:app/:entita/:akce/:id
module.exports.generalPostController = function (req, res) {

}

//router.get('/prachy/:entita/novy', 
module.exports.getCreateEntity = function (req, res) {
  renderEditEntity(req, res, req.params.entita, 'novy', req.params.id)
}

//router.get('/prachy/:entita/:id/:akce', 
module.exports.getEditEntity = function (req, res) {
  renderEditEntity(req, res, req.params.entita, req.params.akce, req.params.id)
}

module.exports.postCreateEntity = function (req, res) {
  //const _entita = req.params.entita //'Type'
  processEditEntity(req, res, 'novy', req.params.entita, req.params.id, req.body)
}

//router.post('/prachy/:entita/:id/:akce', /*ctrl.valPostDeleteType,*/ 
module.exports.postEditEntity = function (req, res) {
  processEditEntity(req, res, req.params.akce, req.params.entita, req.params.id, req.body)
}

////////////////////////////////////////
// TODO: other operations
////////////////////////////////////////

//router.post('/prachy/mesic/:year/:month', 
module.exports.postAddExpense = function (req, res) {

}

// add income to month
//router.get('/prachy/mesic/:year/:month/prijem', 
module.exports.getAddIncome = function (req, res) {

}

//router.post('/prachy/mesic/:year/:month', 
module.exports.postAddIncome = function (req, res) {

}


//router.post('/prachy/typ/:type', 
//module.exports.valPostListTypes = function (req, res) {
//}

//module.exports.postListTypes = function (req, res) {
//}

//router.get('/prachy/typ/:type', 
//module.exports.valPostType = function (req, res) {
//}

//module.exports.postType = function (req, res) {
//}

/*
module.exports.postEditEntity = function (req, res) {
  const _id = req.params.id
  const _akce = req.params.akce
  const _action = akceToAction(_akce)
  const _entita = req.params.entita //'Type'
  console.log(`postEditTEntity called with ${_entita}, ${_id}, ${_akce}`)
  //console.log(req.body)
  //const errors = validationResult(req)
  //if (!errors.isEmpty())
    //return util.renderr(res, 'Validation errors', errors)
  let _entityConf = null

  getEntityConf('Type').then(ec => {
    _entityConf = ec
    return createDocumentFromBody(req.body, _entityConf.fields)
  }).then(function doAction (document) {
    return performAction(_entityConf.schema, _action, _id, document)
//  Type.findByIdAndRemove(_id).exec().then(function onDeleteThen (doc) {
  }).then(function redirect(whatever) {
    res.redirect('/prachy/typy');
  }).catch(function onSaveCatch (err) {
    util.renderr(res, 'Cannot ' + _action +  ' a type ' + _id, err);
  })
}
*/
/*
module.exports.postCreateEntity = function (req, res) {
console.log('postCreateType called')
    console.log(req.body)
  const _id = req.body._id
  const _name = req.body.name
  const _type = req.body.type
  const _order = req.body.order
  const _notes = req.body.notes
  const newType = new Type({
    _id: _id,
    type: _type,
    name: _name,
    order: _order,
    notes: _notes
  })
  newType.save().then(function onSaveThen (doc) {
    res.redirect('/prachy/typy');
  }).catch(function onSaveCatch (err) {
    util.renderr(res, 'Cannot save a new type', err, newType);
  })
*/

/*
module.exports.getEditEntity = function (req, res) {
console.log('getEditType called')
  const _id = req.params.id
  const _akce = req.params.akce
  const _action = akceToAction(_akce)
  const _entita = req.params.entita //'Type'
  let _ec = null
  getEntityConf('Type').then(ec => {
    _ec = ec
    //return Type.findOne({ _id: _id }).exec()
    return ec.schema.findOne({ _id: _id }).exec()
  }).then(entity => {
    return (entity == null) ? Promise.reject(`Entity type ${_entita} with id ${_id} not found!`) : entity
  }).then(entity => {
    const rendata = {
      fields: prepareFields(_ec.fields)(entity),
      form: {
        id: _id,
        title: 'Typ ' + _id,
        isCreating: false,
        isDeleting: isDelete(_action),
        isUpdating: isUpdate(_action),
        isReadOnly: isDelete(_action),
        action: _action,
        akce: _akce,
        submitButtonValue: _action,
        backUrl: '/prachy/typy'
      }
    }
    return rendata
  }).then(rendata => {
    console.log(rendata)
    res.render('editEntity', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render a type', err)
  })
*/

  /*
module.exports.getCreateEntity = function (req, res) {
const _entita = req.params.entita //'Type'
  getEntitaConf(_entita).then(ec => {
//console.log(ec)
    const rendata = {
      fields: ec.fields,
      form: {
        title: 'Nový typ',
        isCreating: true,
        isDeleting: false,
        isUpdating: false,
        isReadOnly: false,
        submitButtonValue: 'Vytvořit',
        backUrl: '/prachy/typy'
      },
      error: {},
      types: {}
    }
    return rendata
  }).then(rendata => {
console.log(rendata)
    res.render('editEntity', rendata)
  }).catch(function onCreateCatch (err) {
    util.renderr(res, 'Cannot create a new type', err, newType);
  })
*/


//router.post('/prachy/mesic/novy', 
//module.exports.valPostCreateMonth = function (req, res) {
//console.log('valPostCreateMonth called')
  //return [
    //check('year').isInt({ ge: 2018, lt: 2100 }).withMessage('Musí být rok v rozmezí 2018 až 2099'),
    //check('month').isInt({ ge: 1, le: 12 }).withMessage('Měsíc musí být v rozmezí 1 až 12')
  //]
//}

/*  if (_.includes(['novy', 'nova', 'nove'], action))
    return 'create'
  else if (_.includes(['upravit', 'zmenit'], action))
    return 'update'
  else if (['smazat', 'odstranit'], action))
    return 'delete'
  else
    throw new Error(`Action ${action} not recognized!`)
*/
