import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendaService, Venda, ItemVenda } from '../../services/venda';
import { ProdutoService, Produto } from '../../services/produto';

// Item em edição durante o registro da venda (antes de enviar)
interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css'
})
export class Vendas implements OnInit {

  // ─── LISTA DE VENDAS ──────────────────────────────────

  vendas: Venda[] = [];

  // ─── PRODUTOS DISPONÍVEIS ─────────────────────────────

  produtos: Produto[] = [];

  termoPesquisaProduto = '';

  // ─── MODAL REGISTRAR VENDA ────────────────────────────

  mostrarFormulario = false;

  carrinho: ItemCarrinho[] = [];

  produtoSelecionadoId = '';

  quantidadeItem = 1;

  observacao = '';

  // ─── MODAL DETALHES ───────────────────────────────────

  vendaDetalhes: Venda | null = null;

  // ─── PESQUISA ─────────────────────────────────────────

  termoPesquisa = '';


  constructor(
    private vendaService: VendaService,
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.carregarVendas();
    this.carregarProdutos();
  }


  // ─── CARREGAMENTO ─────────────────────────────────────

  carregarVendas(): void {

    this.vendaService.listar().subscribe({

      next: (vendas) => {
        this.vendas = vendas;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao listar vendas:', erro);
      }

    });

  }


  carregarProdutos(): void {

    this.produtoService.listar().subscribe({

      next: (produtos) => {
        this.produtos = produtos;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
      }

    });

  }


  // ─── FORMULÁRIO ───────────────────────────────────────

  abrirFormulario(): void {
    this.carrinho = [];
    this.produtoSelecionadoId = '';
    this.quantidadeItem = 1;
    this.observacao = '';
    this.termoPesquisaProduto = '';
    this.mostrarFormulario = true;
  }


  fecharFormulario(): void {
    this.mostrarFormulario = false;
  }


  // ─── CARRINHO ─────────────────────────────────────────

  get produtosFiltradosModal(): Produto[] {

    const termo = this.termoPesquisaProduto.toLowerCase().trim();

    return this.produtos.filter(p =>
      p.quantidade > 0 &&
      (!termo || p.nome.toLowerCase().includes(termo))
    );

  }


  get produtoSelecionado(): Produto | null {
    return this.produtos.find(p => p._id === this.produtoSelecionadoId) ?? null;
  }


  adicionarAoCarrinho(): void {

    const produto = this.produtoSelecionado;

    if (!produto) {
      alert('Selecione um produto.');
      return;
    }

    if (!this.quantidadeItem || this.quantidadeItem < 1) {
      alert('Informe uma quantidade válida.');
      return;
    }

    // Já está no carrinho → apenas atualiza a quantidade
    const jaNoCarrinho = this.carrinho.find(
      i => i.produto._id === produto._id
    );

    const qtdTotal = jaNoCarrinho
      ? jaNoCarrinho.quantidade + this.quantidadeItem
      : this.quantidadeItem;

    if (qtdTotal > produto.quantidade) {
      alert(
        `Estoque insuficiente para "${produto.nome}". ` +
        `Disponível: ${produto.quantidade}.`
      );
      return;
    }

    if (jaNoCarrinho) {
      jaNoCarrinho.quantidade += this.quantidadeItem;
    } else {
      this.carrinho.push({ produto, quantidade: this.quantidadeItem });
    }

    // Reseta seleção
    this.produtoSelecionadoId = '';
    this.quantidadeItem = 1;
    this.termoPesquisaProduto = '';

    this.cdr.detectChanges();

  }


  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
    this.cdr.detectChanges();
  }


  atualizarQuantidadeCarrinho(item: ItemCarrinho, novaQtd: number): void {

    if (novaQtd < 1) {
      return;
    }

    if (novaQtd > item.produto.quantidade) {
      alert(
        `Estoque insuficiente para "${item.produto.nome}". ` +
        `Disponível: ${item.produto.quantidade}.`
      );
      return;
    }

    item.quantidade = novaQtd;
    this.cdr.detectChanges();

  }


  get totalCarrinho(): number {
    return this.carrinho.reduce(
      (acc, i) => acc + i.produto.preco * i.quantidade,
      0
    );
  }


  // ─── FINALIZAR VENDA ──────────────────────────────────

  finalizarVenda(): void {

    if (this.carrinho.length === 0) {
      alert('Adicione ao menos um produto à venda.');
      return;
    }

    const itens = this.carrinho.map(i => ({
      produto: i.produto._id!,
      nomeProduto: i.produto.nome,
      precoUnitario: i.produto.preco,
      quantidade: i.quantidade,
      totalItem: i.produto.preco * i.quantidade
    }));

    const payload: Partial<Venda> = {
      itens,
      totalVenda: this.totalCarrinho,
      observacao: this.observacao
    };

    this.vendaService.cadastrar(payload).subscribe({

      next: (vendaSalva) => {

        this.vendas.unshift(vendaSalva);

        // Atualiza estoque local dos produtos
        this.carrinho.forEach(item => {
          const p = this.produtos.find(p => p._id === item.produto._id);
          if (p) {
            p.quantidade -= item.quantidade;
          }
        });

        this.fecharFormulario();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao registrar venda:', erro);

        const msg = erro?.error || 'Erro ao registrar a venda.';

        alert(msg);

      }

    });

  }


  // ─── EXCLUIR VENDA ────────────────────────────────────

  excluirVenda(id: string): void {

    const confirmar = confirm('Deseja excluir esta venda?');

    if (!confirmar) {
      return;
    }

    this.vendaService.excluir(id).subscribe({

      next: () => {

        this.vendas = this.vendas.filter(v => v._id !== id);

        if (this.vendaDetalhes?._id === id) {
          this.vendaDetalhes = null;
        }

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao excluir venda:', erro);

        alert('Erro ao excluir a venda.');

      }

    });

  }


  // ─── DETALHES ─────────────────────────────────────────

  abrirDetalhes(venda: Venda): void {
    this.vendaDetalhes = venda;
  }


  fecharDetalhes(): void {
    this.vendaDetalhes = null;
  }


  // ─── FILTRO ───────────────────────────────────────────

  get vendasFiltradas(): Venda[] {

    const termo = this.termoPesquisa.toLowerCase().trim();

    if (!termo) {
      return this.vendas;
    }

    return this.vendas.filter(v =>
      v.data.includes(termo) ||
      v.itens.some(i => i.nomeProduto.toLowerCase().includes(termo)) ||
      (v.observacao ?? '').toLowerCase().includes(termo)
    );

  }


  // ─── UTILITÁRIOS ──────────────────────────────────────

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }


  formatarData(iso: string): string {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }


  get totalMes(): number {

    const agora = new Date();

    return this.vendas
      .filter(v => {
        const [ano, mes] = v.data.split('-').map(Number);
        return ano === agora.getFullYear() && mes - 1 === agora.getMonth();
      })
      .reduce((acc, v) => acc + v.totalVenda, 0);

  }

}
