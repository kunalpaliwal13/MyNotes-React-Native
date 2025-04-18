const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require('cors');

app.use(cors());

const mongourl= "mongodb+srv://admin:admin@cluster0.7tdyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongourl).then(()=>{
    console.log("Database connected")
})


require("./NotesSchema");
const Note = mongoose.model("collection1"); 

app.get("/data",async (req,res)=>{
    try{
    const notes = await Note.find();
    res.json(notes);
}catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' }
);}});

app.delete("/deletedata/:id", async (req, res)=>{
    const id = req.params.id;
    try{
        const deletedNote = await Note.findByIdAndDelete(id);
        if (deletedNote) {
            res.status(200).json({ message: 'Note deleted successfully' });
        }
        else{res.status(404).json({ message: 'Note not found' });}
    }catch(e){res.status(500).json({ e: 'Server error' });}
});

app.post("/updatedata", async (req, res) => {
    const { _id, heading, text } = req.body;
    try {
      if (_id) {
        console.log("Checking for existing note with _id:", _id);
        const existingNote = await Note.findById(_id);
        if (existingNote) {
          console.log("Existing note found. Updating...");
          existingNote.heading = heading;
          existingNote.text = text;
          await existingNote.save();
          return res.send({ status: "updated", data: existingNote });
        } else {
          console.log("No existing note found with _id");
        }
      } 
    } catch (error) {
      console.error("Error saving note:", error);
      return res.status(500).send({ status: "error", error: error.message });
    }
});
  
app.post("/adddata", async(req, res)=>{
    try{
    const newNote = await Note.create({heading: "", text: "",});
    return res.send({ status: "created", data: newNote }); 
    }catch(e){console.log("Note could not be created."+ e)};   
});


app.listen(5001, ()=>{
    console.log("server started!")
});
