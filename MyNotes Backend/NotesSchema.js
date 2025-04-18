const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    heading: String,
    text: String
},{
    collection: "collection1"
});
mongoose.model("collection1", notesSchema);