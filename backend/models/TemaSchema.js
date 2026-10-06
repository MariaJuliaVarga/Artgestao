import mongoose from 'mongoose';

const TemaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        descricao: {
            type: String,
            required: false
        },

        imagens: {
            type: [String],
            required: false,
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default TemaSchema;