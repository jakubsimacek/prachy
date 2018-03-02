
const Month = require('./models/month');
const Account = require('./models/account');
const Type = require('./models/type');


const entityConf = [
  {
    name: 'Type',
    entita: 'typ',
    schema: Type,
    // postFieldInit(fields),
    fields: [
      {
        name: '_id',
        label: 'Id',
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
    schema: Month,
    fields: [
      {
        name: '_id',
        label: 'Id',
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

module.exports.entityConf = entityConf

