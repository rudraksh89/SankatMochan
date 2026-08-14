import mongoose from "mongoose";

const medicalDocumentSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    documentType:{
        type:String,
        required:true,
    },

    fileName:{
        type:String,
        required:true,
    },

    fileUrl:{
        type:String,
        required:true,
    },

    publicId:{
        type:String,
        required:true,
    },
    resourceType: {
  type: String,
  required: true,
},
},
{
    timestamps:true,
});

export default mongoose.model(
    "MedicalDocument",
    medicalDocumentSchema
);