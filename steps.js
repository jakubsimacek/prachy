
function notPermited(flowData) {
  error('This action is not permited on the entity')
}

function createEmptyDocument(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function fetchListOfDocuments(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function getSchemaFromFlowData(flowData) {
	const _schema = flowData.entityConfigPath.path[0].entity.schema
//dbg(flowData.entityConfigPath.path)
	if (_.isUndefined(_schema))
	  error('Schema of the main entity not set')
	return _schema
}
function fetchDocumentListFromMongo(flowData) {
	const _schema = getSchemaFromFlowData(flowData)
		//dbg(_schema.schema.obj[0].type.toString())
  return _schema.find().exec()
}

function fetchDocumentFromMongo(flowData) {
	const _id = flowData.requestPath.path[0].id
	if (_.isUndefined(_id))
	  error('Id of the main entity not set')
	const _schema = getSchemaFromFlowData(flowData)
	if (_.isUndefined(_schema))
	  error('Schema of the main entity not set')
  return _schema.findById(_id).exec()
}

function storeToMongo(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function deleteFromMongo(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function getSubDocument(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function updateSubDocument(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

// requires previousResult/mongoDoc to be populated from schema.find()
function makeModel(flowData, mongoDocs) {
	//dbg(mongoDocs)
	const _fields = flowData.entityConfigPath.path[0].entity.fields 
	const _model = _.map(mongoDocs, (record) => {
		  const rec = record.toObject()
		//dbg(record)
	  return _.map(_fields, (field) => {
		  return {
		    name: field.name,
	      value: _.get(rec, field.name, field.defaultValue)
		  }
	  })
	})
	flowData.model = _model
	return Promise.resolve()
}

function createEmptyModel(flowData) {
  //error(`${flowData.actualStep} not yet implemented`)
	const _fields = flowData.entityConfigPath.path[0].entity.fields 
	const _model = _.map(_fields, (field) => {
				dbg(field.defaultValue)
		return {
			name: field.name,
		  value: (_.isFunction(field.defaultValue)) ? field.defaultValue() : field.defaultValue,
			type: field.type
		}
	})
	flowData.model = [ _model ]
	return Promise.resolve()
}

function enrichModel(flowData) {
}

function decorateModel(flowData) {
	dbg(flowData.entitaToWorkWith)
	_.forEach(flowData.model, (record) => {
		_.forEach(record, (field) => {
			const _fileDef = _.find(flowData.entitaToWorkWith.fields, { name: field.name })
			if (! _.isUndefined(_fieldDef)) {
			  field.control = _fieldDef.control
			  switch(_filedDef.control) {
					case "input":
						field.input = _fieldDef.input
			      break
			    case "select":
						field.select = _fieldDef.select
			      break
				}
			}
		})
	})
}

function validateModel(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

function generateRenderingListData(flowData) {
  //error(`${flowData.actualStep} not yet implemented`)
	const form = {
    actionUrl: null,
		backUrl: null,
		submitButtonValue: null
	}
	const buttons = {}
	const heading = {}
	flowData.renderingData = {
		buttons: buttons,
		heading: heading,
		columns: null,
		records: null,   // cells
		form: form
	}
}

function generateRenderingEditData(flowData) {
	const form = {
		actionUrl: `${flowData.entityConfigPath.app}/${flowData.actionConfig.aliases[0]}/${flowData.entityToWorkWith.entita}` + (_.isUndefined(flowData.entityToWorkWith.id)) ? '' : `/${flowData.entityToWorkWith.id}`,
		backUrl: null,
		submitButtonValue: null
	}
	const buttons = {}
	const heading = {}
	//const fields = _.map
	flowData.renderingData = {
		buttons: buttons,
		record: flowData.model[0],
		form: form
	}
}

function renderView(flowData) {
	dbg(flowData.renderingData)
  flowData.express.res.render(flowData.actionConfig.view, flowData.renderingData)	
}

function redirectElsewhere(flowData) {
  error(`${flowData.actualStep} not yet implemented`)
}

