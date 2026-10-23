import mongoose from 'mongoose';

const ItemVendaSchema = new mongoose.Schema(
    {
        produto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produto',
            required: true
        },

        nomeProduto: {
            type: String,
            required: true
        },

        precoUnitario: {
            type: Number,
            required: true,
            min: 0
        },

        quantidade: {
            type: Number,
            required: true,
            min: 1
        },

        totalItem: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const VendaSchema = new mongoose.Schema(
    {
        itens: {
            type: [ItemVendaSchema],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length > 0,
                message: 'A venda deve ter ao menos um produto.'
            }
        },

        totalVenda: {
            type: Number,
            required: true,
            min: 0
        },

        data: {
            type: String,
            required: true
        },

        observacao: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

export default VendaSchema;
