import express from 'express';

import TemaController from '../controllers/TemaController.js';
import ProdutoController from '../controllers/ProdutoController.js';

import upload from '../middlewares/upload.js';

const router = express.Router();

// ========================
// ROTAS DE TEMAS
// ========================

// Cadastrar tema
router.post('/temas', upload.array('imagens'), TemaController.cadastrar);

// Listar temas
router.get('/temas', TemaController.listar);

// Buscar tema por ID
router.get('/temas/:id', TemaController.buscarPorId);

// Editar tema
router.put('/temas/:id', upload.array('imagens'), TemaController.editar);

// Excluir uma imagem do tema
router.delete('/temas/:id/imagem', TemaController.excluirImagem);

// Excluir tema
router.delete('/temas/:id', TemaController.excluir);

// ========================
// ROTAS DE PRODUTOS
// ========================

// Cadastrar produto
router.post('/produtos', ProdutoController.cadastrar);

// Listar produtos (suporta ?nome= para busca)
router.get('/produtos', ProdutoController.listar);

// Buscar produto por ID
router.get('/produtos/:id', ProdutoController.buscarPorId);

// Editar produto
router.put('/produtos/:id', ProdutoController.editar);

// Atualizar apenas a quantidade
router.patch('/produtos/:id/quantidade', ProdutoController.atualizarQuantidade);

// Excluir produto
router.delete('/produtos/:id', ProdutoController.excluir);

export default router;