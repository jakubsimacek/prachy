const Month = require('../models/month');
const Account = require('../models/account');
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
    res.render('listMonths', rendata);
  }).catch(err => {
    util.renderr(res, 'Cannot load and render months', err);
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
      sumExpenses: month.expenses.map(e => e.amount).reduce((a, b) => a + b, 0),
      sumIncomes: month.incomes.map(e => e.amount).reduce((a, b) => a + b, 0)
    }
    return rendata
  }).then(rendata => {
    res.render('editMonths', rendata);
  }).catch(err => {
    util.renderr(res, 'Cannot load and render months', err);
  })
}

//router.post('/prachy/mesic/:year/:month', 
module.exports.valPostEditMonth = function (req, res) {

}

module.exports.postEditMonth = function (req, res) {

}


// edit types
//router.get('/prachy/typy', 
module.exports.getType = function (req, res) {

}

//router.post('/prachy/typ/:type', 
module.exports.valPostType = function (req, res) {

}

module.exports.postType = function (req, res) {

}

//router.get('/prachy/typ/:type', 
module.exports.valPostType = function (req, res) {

}

module.exports.postType = function (req, res) {

}

//router.get('/prachy/typ/novy', 
module.exports.getCreateType = function (req, res) {

}

//router.post('/prachy/typ/novy', 
module.exports.valPostCreateType = function (req, res) {

}

module.exports.postCreateType = function (req, res) {

}

/*
//router.post('/prachy/mesic/novy', 
module.exports.postCreateWeek = function (req, res) {
  if (!req.body.weekStartDate)
    res.render('error', {user: req.user, message: 'no start date', error: {}}); //TODO: return to add_week with an error message
  else {
    let newWeek = {
      state: 'new',
      startDate: req.body.weekStartDate,
      endDate: 'n/a',
      description: 'n/a',
      weekDisplayProps: {
        firstGap: 15,
        intermGap: 47,
        endGap: 20,
        tableWidth: 1005,
        ruler: [
        {
          "time" : "7:00",
          "left" : 180,
          "gap" : false
        },
        {
          "time" : "8:00",
          "left" : 360,
          "gap" : true
        },
        {
          "time" : "16:00",
          "left" : 407,
          "gap" : true
        },
        {
          "time" : "17:00",
          "left" : 587,
          "gap" : false
        },
        {
          "time" : "18:00",
          "left" : 767,
          "gap" : false
        },
        {
          "time" : "19:00",
          "left" : 947,
          "gap" : false
        }],
        "intervals" : [
        {
          "from" : "6:20",
          "to"   : "8:00"
        },
        {
          "from" : "16:00",
          "to"   : "19:00"
        }]
      },
      days: [
      {
        day: 'po',
        terms: {}
      },
      {
        day: 'ut',
        terms: {}
      },
      {
        day: 'st',
        terms: {}
      },
      {
        day: 'ct',
        terms: {}
      },
      {
        day: 'pa',
        terms: {}
      }]
    };
    Week.create(newWeek, (err, results) => {
      if (err)
        util.renderr(res, 'Cannot save a new week', err, newWeek);
      else
        res.redirect('/admin/tyden/' + req.body.weekStartDate);   // TODO: check the :week
    });
  }
}
*/
/*
//router.get('/admin/tyden/:week/editor', 
module.exports.getWeekEditor = function (req, res) {
  console.log(':week=' + CircularJSON.stringify(req.params.week));
  Week.findById(req.params.week, (err, week) => {
   if (err)
     util.renderr(res, 'Nemuzu najit tyden', error);
   else {
     console.log('admin tyden ' + week);
//router.post('/admin/tyden/:week/editor', 
module.exports.postWeekEditor = function (req, res) {
  // get submit button name
  // switch what to do
  // do it n times
  res.render('not-impl', {user: req.user});
}
*/
/*
//router.get('/admin/tydny', 
module.exports.getAdminWeeks = function (req, res) {
  //console.log('admin-tydny', req.user);
  Week.find({}, (err, weeks) => {
    if (err)
      render('error', { user: req.user, error: err });
    else {
console.log('weeks:' + weeks);
      let aggWeeks = weeks.map(w => {
        const noTerms = w.days.map(d => (d.terms) ? d.terms.length : 0).reduce(add, 0);
        const noSections = w.weekDisplayProps.intervals.length;
        const capacity = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.capacity.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        const noBookings = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.booked.count.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        const noReservations = w.days.map(d => {
          if (d.terms)
            return d.terms.map(t => {
              t.reserved.count.reduce(add, 0);
            });
          else
            return 0;
        }).reduce(add, 0); 
        console.log(noTerms);
        return { id: w._id,
                 name: w.name,
                 startDate: formatCzDate(w.startDate),
                 noTerms: noTerms,
                 noSections: noSections,
                 capacity: capacity,
                 noBookings: noBookings,
                 noReservations: noReservations,
                 description: w.description,
                 state: w.state
        };
      }); 
      console.log('weeks to render: ', aggWeeks);
      console.log('I\'m ' + req.user);
      res.render('adminWeeks', {user: req.user, weeks: aggWeeks});
    }
  });
}
*/

