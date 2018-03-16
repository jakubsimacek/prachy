const util = require('../util');
//const formatDate = require('format-date');
//const CircularJSON = require('circular-json');
const cfg = require('../config')
const _ = require('lodash')

// operation - low level DB operation
// action    - what a form can do
// entity    - type of object

/////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////
function l(out) { console.log(out) }

function processActionSteps(funcArray, initialData) {
  return funcArray.reduce((promise, func) => {
    return promise.then((previousResult) => {
			  return func(previousResult)
      })
  }, Promise.resolve(initialData));
}


// Promise wrapper of the above function
function getPromiseEntityConfigurationPath(request) {
  try {
    return Promise.resolve(getEntityConfigurationPath(request))
  }
  catch(e) {
    return Promise.reject(e)
  }
}
/*
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
*/
/*
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
*/
// initialize model
/*
function initializeModel(action, schema, id) {
  if (action == 'delete')
    return schema.findOne({ id: id }).exec()
  else if (action == 'create')
    return Promise.resolve({})
  else
    actionNotRecognized(action)
}
*/
/////////////////////////////////////////////////////
// enrich document - adds from source to target
/////////////////////////////////////////////////////
/*
function enrichDocument(targer, source) {
  _.ownKeys(source, (value, key) => {
    if (value)
      target[key] = value
  })
}
*/
/////////////////////////////////////////////////////
// finds a subdocument in any level
// path is an array of { entity, id } pairs
/////////////////////////////////////////////////////
function findSubDocument(document, path) {
  let _current = document
  _.forEach(path, o => {
    _current = _current[o.entity].id(o.id)
  })
  return _current
}


/////////////////////////////////////
// Hi-level operation on document
/////////////////////////////////////
/*
const operationArray = [
  {
    action: 'create',
    aliases: ['novy', 'nova', 'nove'],
    operation: [ createDocument, createSubDocument ]
  },
  {
    action: 'update',
    aliases: ['upravit', 'zmenit'],
    operation: [ updateDocument, updateSubDocument ]
  },
  {
    action: 'delete',
    aliases: ['smazat', 'odstranit'],
    operation: [ deleteDocument, deleteSubDocument ]
  }
]
*/

// path: [ { entity, id } ]
function doOperationOnDocument(action, path, partialDocument) {
  const operationDepth = (path.length > 1) ? 1 : 0
  //const doc = (operationDepth == 1) ? findSubDocument(document, path) : -1234545
  return operationArray[operationDepth](schema, path, document)
}

//////////////////////////////////////////////

/*
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
*/
/*
const renderListEntities = function (req, res, pohled, entitas) {

}
*/
// parses parameters
const parseParameters = function (req) {
  const _params = req.params
  const _path = new Array()

  const _entita = _params.entita
  if (! _.isString(_entita))
    cfg.error(`Top level entity not a string: ${_entita}`)
  
  _path.push({ entita: _entita, id: _params.id })

  const _subEntita = _params.subEntita
  if (_.isString(_subEntita)) {
    _path.push({ entita: _subEntita, id: _params.subId })

    const _subSubEntita = _params.SubSubEntita
    if (_.isString(_subSubEntita)) {
      _path.push({ entita: _subSubEntita, id: _params.subSubId })
    }
  } 

  return {
    app: _params.app,
    akce: _params.akce,
    path: _path
  }
}

/////////////////////////////////////
// GET handler
/////////////////////////////////////
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

/////////////////////////////////////
// POST handler - level 1
/////////////////////////////////////
/*const processEditEntityL1 = function (req, res, akce, entita, id, body) {
  console.log(`postEditTEntityL1 called with ${entita}, ${id}, ${akce}`)

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

/////////////////////////////////////
// POST handler - level 2
/////////////////////////////////////
const processEditEntityL2 = function (req, res, akce, entita1, id1, entita2, id2, body) {
  console.log(`postEditTEntityL2 called with ${entita1}, ${id1}, ${akce} L2: ${entita2} ${id2}`)

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
*/
function findAkceInArray(arr, akce) {
	l(`akce ${akce}`)
  return _action = _.find(arr, (act) => {
    return _.find(act.aliases, (item) => { l(item); return item == akce })
  })
}

// returns action handler for akce and entity
function getActionConfig(entityConf, akce) {
  let _action
	if (_.find(entityConf, 'actions')) {
		l('lezu dovnitr')
	  _action = findAkceInArray(entityConf.actions, akce) 
	}
  if (_.isUndefined(_action)) {
    _action = findAkceInArray(cfg.defaultActionConf, akce)
    if (_.isUndefined(_action))
      cfg.error(`Action alias ${akce} not found`) 
  }

  return _action
}

// goes through the request and returns enriched path with the configuration of each item of the path
function getEntityConfigurationPath(request) {
  const _appEntityConf = _.find(cfg.appConfig, (ec) => { return ec.app == request.app })
  const _entita = request.path[0].entita
  let _cfgEntity = _.find(_appEntityConf.entities, (ec) => { return ec.entita == _entita || ec.plural == _entita })
  const _enrichedPath = []

  if (_.isUndefined(_cfgEntity))
    cfg.error(`Entity ${_entita} not found in the config for ${request.app}`)

  _enrichedPath.push({
    entita: _entita,
    id: request.path[0].id,
    cfg: _cfgEntity
  })

  _.forEach(_.drop(request.path), (pathSubItem, index) => {
    const _subEntity = _.find(_cfgEntity, { name: pathSubItem.plural })
    if (_.isUndefined(_subEntity))
      cfg.error(`Sub-entity ${pathSubItem.entita} at index ${index} not found!`)
    _cfgEntity = _subEntity.definition
    
    _enrichedPath.push({
      entita: pathSubItem.entita,
      id: pathSubItem.id,
      cfg: _cfgEntity
    })
  })

  return {
    app: request.app,
    path: _enrichedPath,
    //action: action,
    entity: _appEntityConf.entity,
    //schema: _appEntityConf.schema,
    conf: _appEntityConf
  }
}
/////////////////////////////////////
// General controllers
/////////////////////////////////////
// /:app/:akce/:entita/:id/:subentita/:subid/:subsubentita/:subsubid
module.exports.generalGetController = function (req, res) {
  const _requestPath = parseParameters(req)
	const _entityConfig = getEntityConfigurationPath(_requestPath)
	const _actionConfig = getActionConfig(_entityConf, requestPath.akce)
  const _handlerGenerator = gerHandlerGenerator(_actionConfig.handlerGenerators)

  processActionSteps()

	let _actionConfig
  .then((entConfPath) => {
    _entConfig = entConfig
    return entConfPath
  }).then((entConfPath) => {
		l('entConfPath')
		l(entConfPath.actionConfig)
		_actionConfig = 
    return entConfPath.handlerGenerator()
  }).then((rendata) => {
    res.render(rendata.view, rendata)
  }).catch((err) => {
    util.renderr(res, 'Cannot render view', err);
  })
}

// /:app/:akce/:entita/:id/:subentita/:subid/:subsubentita/:subsubid
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

module.exports.postEditEntity = function (req, res) {
  processEditEntity(req, res, req.params.akce, req.params.entita, req.params.id, req.body)
}

