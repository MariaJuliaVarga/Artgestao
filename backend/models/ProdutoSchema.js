import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        descricao: {
            type: String,
            required: true
        },

        preco: {
            type: Number,
            required: true,
            min: 0
        },

        categoria: {
            type: String,
            required: true,
            enum: [
                'brinquedos',
                'buquês',
                'presentes',
                'decoração',
                'outros'
            ]
        },

        quantidade: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default ProdutoSchema;
