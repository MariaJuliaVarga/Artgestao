import express from 'express';

import TemaController from '../controllers/TemaController.js';
import ProdutoController from '../controllers/ProdutoController.js';
import AgendaController from '../controllers/AgendaController.js';
import DataBloqueadaController from '../controllers/DataBloqueadaController.js';
import VendaController from '../controllers/VendaController.js';

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

// ========================
// ROTAS DE AGENDA
// ========================

// Cadastrar festa
router.post('/agenda', AgendaController.cadastrar);

// Listar todas as festas
router.get('/agenda', AgendaController.listar);

// Listar festas por data (YYYY-MM-DD)
router.get('/agenda/data/:data', AgendaController.listarPorData);

// Buscar festa por ID
router.get('/agenda/:id', AgendaController.buscarPorId);

// Editar festa
router.put('/agenda/:id', AgendaController.editar);

// Excluir festa
router.delete('/agenda/:id', AgendaController.excluir);

// ========================
// ROTAS DE DATAS BLOQUEADAS
// ========================

// Listar todas as datas bloqueadas
router.get('/datas-bloqueadas', DataBloqueadaController.listar);

// Bloquear uma data
router.post('/datas-bloqueadas', DataBloqueadaController.bloquear);

// Desbloquear uma data (por valor da data YYYY-MM-DD)
router.delete('/datas-bloqueadas/:data', DataBloqueadaController.desbloquear);

// ========================
// ROTAS DE VENDAS
// ========================

// Registrar venda
router.post('/vendas', VendaController.cadastrar);

// Listar todas as vendas
router.get('/vendas', VendaController.listar);

// Buscar venda por ID
router.get('/vendas/:id', VendaController.buscarPorId);

// Excluir venda
router.delete('/vendas/:id', VendaController.excluir);

export default router;