import express from 'express';

import TemaController from '../controllers/TemaController.js';

import upload from '../middlewares/upload.js';

const router = express.Router();

// Cadastrar tema
router.post('/temas',upload.array('imagens'),TemaController.cadastrar);

// Listar temas
router.get('/temas',TemaController.listar);

// Buscar tema por ID
router.get('/temas/:id',TemaController.buscarPorId);

// Editar tema
router.put('/temas/:id',upload.array('imagens'),TemaController.editar);

// Excluir uma imagem do tema
router.delete('/temas/:id/imagem',TemaController.excluirImagem);

// Excluir tema
router.delete('/temas/:id',TemaController.excluir);

export default router;