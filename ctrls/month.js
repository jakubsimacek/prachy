const Month = require('../models/month');
const Account = require('../models/account');
const Type = require('../models/type');
const util = require('../util');
//const formatDate = require('format-date');
//const CircularJSON = require('circular-json');
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

//if (!req.body.weekStartDate)

// list months
//router.get('/prachy/mesice', 
module.exports.valGetListMonths = function (req, res) {
}

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

//router.post('/prachy/mesic/novy', 
module.exports.valPostCreateMonth = function (req, res) {
console.log('valPostCreateMonth called')
  return [
    check('year').isInt({ ge: 2018, lt: 2100 }).withMessage('Musí být rok v rozmezí 2018 až 2099'),
    check('month').isInt({ ge: 1, le: 12 }).withMessage('Měsíc musí být v rozmezí 1 až 12')
  ]
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

//router.post('/prachy/mesic/:year/:month', 
module.exports.valPostEditMonth = function (req, res) {

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
      /*types: [
      {
        _id: "hbl.jidlo",
        name: ""
      }, 
      {
        _id: "hbl.vstupenky",
        name: ""
      }, 
      {
        _id: "hbl.obleceni",
        name: ""
      }, 
      {
        _id: "hbl.ostatni",
        name: ""
      }, 
      {
        _id: "potraviny",
        name: ""
      }, 
      {
        _id: "bydleni.najem",
        name: ""
      }, 
      {
        _id: "cestovani",
        name: ""
      }, 
      {
        _id: "",
        name: ""
      }, 
      {
        _id: "",
        name: ""
      }, 
      {
        _id: "",
        name: ""
      }, 

    vyrovnani
    auto
      pojisteni
      benzin
      koupe
      ] */
    }
    return rendata
  }).then(rendata => {
console.log(rendata)
    res.render('editMonth', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render page editMonth', err)
  })
}

//router.post('/prachy/mesic/:year/:month', ctrl.valPostAddExpense, ctrl.postAddExpense);
//router.post('/prachy/mesic/:year/:month', 
module.exports.postAddExpense = function (req, res) {

}

// add income to month
//router.get('/prachy/mesic/:year/:month/prijem', 
module.exports.getAddIncome = function (req, res) {

}

//router.post('/prachy/mesic/:year/:month', ctrl.valPostAddIncome, ctrl.postAddIncome);
//router.post('/prachy/mesic/:year/:month', 
module.exports.postAddIncome = function (req, res) {

}


/////////////////////////////////////

const entityConf = [
  {
    name: 'Type',
    model: Type,
    fields: [
      {
        name: '_id',
        label: 'Id',
        isEditable: true,
        isUpdatable: false,
        control: 'input',
        input: {
          type: 'text',
        },
        errorClass: '', // too early
      }
    ]
  }
]

function getEntityConf(entityType) {
  return entityConf.filter(ec => ec.name == entityType).map(ec => (ec == null) ? Promise.reject(`Entity type ${entityType} not found in the config!`) : Promise.resolve(ec))
}

// edit types
//router.get('/prachy/typy', 
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
console.log(rendata)
    res.render('listTypes', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render page listTypes', err)
  })
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

//router.get('/prachy/typ/novy', 
module.exports.getCreateType = function (req, res) {
  getEntityConf('Type').then(ec => {
    const rendata = {
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
  }).then(rendata => {
    res.render('editType', rendata)
  }).catch(function onCreateCatch (err) {
    util.renderr(res, 'Cannot create a new type', err, newType);
  })
}

//router.post('/prachy/typ/novy', 
//module.exports.valPostCreateType = function (req, res) {
//}

module.exports.postCreateType = function (req, res) {
console.log('postCreateType called')
    console.log(req.body)
  //const errors = validationResult(req)
  //if (!errors.isEmpty())
    //return util.renderr(res, 'Validation errors', errors)
  const _id = req.body.id
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
}

//router.get('/prachy/typ/:type/:action', 
module.exports.getEditType = function (req, res) {
console.log('getEditType called')
  const _id = req.params.type
  const _action = req.params.action
  getEntityConf('Type').then(ec => {
    Type.findOne({ _id: _id }).
    exec()
  }).then(entity => {
    const rendata = {
      form: {
        title: 'Typ ' + _id,
        isCreating: false,
        isDeleting: _action == 'smazat',
        isUpdating: _action == 'zmenit',
        isReadOnly: _action == 'smazat',
        action: _action,
        submitButtonValue: _action,
        backUrl: '/prachy/typy'
      },
      error: {},
      type: { 
        _id: entity._id,
        name: entity.name,
        type: entity.type,
        order: entity.order,
        notes: entity.notes
      },
    }
    return rendata
  }).then(rendata => {
    console.log(rendata)
    res.render('editType', rendata)
  }).catch(err => {
    util.renderr(res, 'Cannot load and render a type', err)
  })
}

//router.post('/prachy/typ/smazat', /*ctrl.valPostDeleteType,*/ 
module.exports.postEditType = function (req, res) {
console.log('postEditType called')
    console.log(req.body)
  //const errors = validationResult(req)
  //if (!errors.isEmpty())
    //return util.renderr(res, 'Validation errors', errors)
  const _id = req.body.id
  const _action = req.body.action
  Type.findByIdAndRemove(_id).exec().then(function onDeleteThen (doc) {
    res.redirect('/prachy/typy');
  }).catch(function onSaveCatch (err) {
    util.renderr(res, 'Cannot ' + _action +  ' a type ' + _id, err, newType);
  })
}


