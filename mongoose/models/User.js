 import{ Schema, model} from"mongoose";

 const userSchema= new Schema({
    nom:{ type:String, required:true},
    email:{ type:String, required:true, unique:true},
    motdepasse:{ type:String, required:true},
    role:{ type:String, enum:["user", "admin"], default:"user"},
    dateCreation:{ type:Date, default:Date.now},
 });

const studentSchema = new Schema({
   nom:{type:String, required:true},
   prenom:{ type:String, required:true},
   email:{ type:String,unique:true, required:true},
   note:{ type:Array, required:true},
   matieres:{ type:Array, required:true}
})

 export default model("User", userSchema, studentSchema)