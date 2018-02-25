const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const type = {
    _id: {type: String, required: true},
    type: {type: String, required: true, enum: ['Expense', 'Income']},
    name: {type: String, required: true},
    notes: {type: String, required: false},
    order: {type: Number, required: false, default: 1000}
}

let Type = new Schema(type);

module.exports = mongoose.model('Type', Type);

/*
root
  vydaje
    hbl
      jidlo
      vstupenky
      obleceni
      ostatni
    potraviny
    bydleni
      najem
    cestovani
    vyrovnani
    auto
      pojisteni
      benzin
      koupe

  prijmy
    osvc
      dcos
      hbl
    splatky
    pujcky
    ostatni
*/
