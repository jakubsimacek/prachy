const han = require('./handlers');

const config = {
  app: 'tanita',
  entities: [
    {
      name: 'Tanita',
      entita: 'tanita',
      plural: 'tanity',
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
    } 
  ]
}

module.exports.config = config
