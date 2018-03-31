const stp = require('./steps')
///////////////////////
// Action handlers
// ////////////////////
function handlerDisplay() {
	return [
	  {
			phase: 'get',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
			    handlers: [
		        [ stp.fetchDocumentFromMongo, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		        [ stp.fetchDocumentFromMongo, stp.getSubDocument, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
			    ]
			  },
			  {
          type: 'list',
					alias: 'plural',
					withId: false,
					view: 'generalList',
			    handlers: [
		        [ stp.fetchDocumentListFromMongo, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingListData ],
		        [ stp.fetchDocumentFromMongo, stp.getSubDocument, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingListData ],
			    ]
			  }
			]
	  }
	]
}

function handlerCreateDocument() {
	return [
	  {
			phase: 'get',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: false,
			    handlers: [
		        [ stp.createEmptyModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		        [ stp.fetchDocumentFromMongo, stp.createEmptyModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		      ]
			  }
			]
	  },
	  {
			phase: 'post',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
	        handlers: [
		        [ stp.validateModel, stp.updateSubDocument, stp.storeToMongo, stp.redirectElsewhere ]
		        [ stp.validateModel, stp.storeToMongo, stp.redirectElsewhere ]
		      ]
			  }
			]
	  }
	]
}

function handlerCopyDocument() {
	return [
	  {
			phase: 'get',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
			    handlers: [
		        [ stp.fetchDocumentFromMongo, stp.makeModel, stp.clearNonCopybleData, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		        [ stp.fetchDocumentFromMongo, stp.getSubDocument, stp.makeModel, stp.clearNonCopybleData, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		      ]
			  }
			]
	  },
	  {
			phase: 'post',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
	        handlers: [
		        [ stp.validateModel, stp.updateSubDocument, stp.storeToMongo, stp.redirectElsewhere ]
		        [ stp.validateModel, stp.storeToMongo, stp.redirectElsewhere ]
		      ]
			  }
			]
	  }
	]
}

function handlerUpdateDocument() {
	return [
	  {
			phase: 'get',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
			    handlers: [
		        [ stp.fetchDocumentFromMongo, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
		        [ stp.fetchDocumentFromMongo, stp.getSubDocument, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ]
		      ]
			  }
			]
	  },
	  {
			phase: 'post',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
	        handlers: [
		        [ stp.validateModel, stp.storeToMongo, stp.redirectElsewhere ]
		        [ stp.validateModel, stp.updateSubDocument, stp.storeToMongo, stp.redirectElsewhere ]
		      ]
			  }
			]
	  }
	]
}

function handlerDeleteDocument() {
	return	[
	  {
		  phase: 'get',
			types: [
			  {
          type: 'single',
					alias: 'entita',
					withId: true,
		      handlers: [
			      [ stp.fetchDocumentFromMongo, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ],
	  	      [ stp.fetchDocumentFromMongo, stp.getSubDocument, stp.makeModel, stp.enrichModel, stp.decorateModel, stp.generateRenderingEditData, stp.renderView ]
		      ]
			  }
			]
	  },
	  {
		  phase: 'post',
			types: [
			  {
					type: 'single', // TODO: make check for plural alias
					alias: 'entita',
					withId: true,
		      handlers: [
			      [ stp.validateModel, stp.deleteFromMongo, stp.redirectElsewhere ],
		        [ stp.deleteSubDocument, stp.storeToMongo, stp.redirectElsewhere ]
		      ]
				}
			]
	  }
	]
}

