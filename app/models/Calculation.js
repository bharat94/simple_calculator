const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalculationSchema = new Schema({
    expression: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    isError: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('calculations', CalculationSchema);
