import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Explicitly define _id
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, required: false },
    payment: { type: Boolean, required: false },
    isCompleted: { type: Boolean, required: false },
}, { _id: true }); // Ensure _id is always present


const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel
