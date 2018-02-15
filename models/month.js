let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let expense = {
    _id: {type: String, required: true},
    day: {type: Number, required: true},
    amount: {type: Number, required: true},
    paymentType: {type: String, required: false},
    types: {type: [String], required: false},
    notes: String
};

let income = {
    _id: {type: String, required: true},
    day: {type: Number, required: true},
    amount: {type: Number, required: true},
    types: {type: [String], required: false},
    notes: String
};

let month = {
    _id: {type: String, required: true},
    state: {type: String, required: true},
    notes: {type: String, required: false},
    startDate: {type: Date, required: true},
    expenses: {type: [expense], required: false},
    incomes: {type: [income], required: false}
};

let Month = new Schema(month);

module.exports = mongoose.model('Month', Month);

