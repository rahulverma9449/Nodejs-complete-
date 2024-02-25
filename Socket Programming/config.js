import mongoose from "mongoose";

export const connect = async()=>{
  await mongoose.connect("mongodb+srv://rahulverma9559:2JEc0XwXpgfEU8TE@cluster0.7sa8r47.mongodb.net/?retryWrites=true&w=majority",{

  useNewUrlParser: true,
  useUnifiedTopology: true
  })
  console.log("Db is connected");
}