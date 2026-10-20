import mongoose from 'mongoose';

const DataBloqueadaSchema = new mongoose.Schema(
    {
        data: {
            type: String,
            required: true,
            unique: true
        },

        motivo: {
            type: String,
            required: false,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

export default DataBloqueadaSchema;
