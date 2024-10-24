const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'teacher'
    }
})
const TeacherModel = mongoose.model('teacher', TeacherSchema)
module.exports = TeacherSchema