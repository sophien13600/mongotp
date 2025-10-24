 import{ Schema, model} from"mongoose";

 const userSchema= new Schema({
    nom:{ type:String, required:true},
    email:{ type:String, required:true, unique:true},
    motdepasse:{ type:String, required:true},
    role:{ type:String, enum:["user", "admin"], default:"user"},
    dateCreation:{ type:Date, default:Date.now},
 });

 export default model("User", userSchema)