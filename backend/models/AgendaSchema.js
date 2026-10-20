import mongoose from 'mongoose';

const AgendaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        data: {
            type: String,
            required: true
        },

        horario: {
            type: String,
            required: true
        },

        observacao: {
            type: String,
            required: false,
            default: ''
        },

        usuario: {
            type: String,
            required: false,
            default: 'Claudia'
        }
    },
    {
        timestamps: true
    }
);

export default AgendaSchema;
