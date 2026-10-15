import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../../services/produto';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  produtos: Produto[] = [];

  termoPesquisa = '';

  mostrarModal = false;

  editando = false;

  produtoEditandoId: string | null = null;

  categorias = [
    'brinquedos',
    'buquês',
    'presentes',
    'decoração',
    'outros'
  ];

  novoProduto: Produto = {
    nome: '',
    descricao: '',
    preco: 0,
    categoria: '',
    quantidade: 0
  };


  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.listarProdutos();
  }


  listarProdutos(): void {

    this.produtoService.listar().subscribe({

      next: (dados) => {

        this.produtos = dados;

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao buscar produtos:', erro);

      }

    });

  }


  produtosFiltrados(): Produto[] {

    if (!this.termoPesquisa) {
      return this.produtos;
    }

    return this.produtos.filter((produto) =>
      produto.nome
        .toLowerCase()
        .includes(this.termoPesquisa.toLowerCase())
    );

  }


  abrirNovoProduto(): void {

    this.novoProduto = {
      nome: '',
      descricao: '',
      preco: 0,
      categoria: '',
      quantidade: 0
    };

    this.editando = false;

    this.produtoEditandoId = null;

    this.mostrarModal = true;

  }


  abrirEdicao(produto: Produto): void {

    this.novoProduto = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      quantidade: produto.quantidade
    };

    this.produtoEditandoId = produto._id!;

    this.editando = true;

    this.mostrarModal = true;

  }


  fecharModal(): void {

    this.mostrarModal = false;

    this.editando = false;

    this.produtoEditandoId = null;

  }


  salvarProduto(): void {

    const { nome, descricao, preco, categoria, quantidade } = this.novoProduto;

    if (!nome || !descricao || !categoria || preco === undefined || quantidade === undefined) {

      alert('Preencha todos os campos obrigatórios.');

      return;

    }


    // EDITAR

    if (this.editando && this.produtoEditandoId) {

      this.produtoService.editar(
        this.produtoEditandoId,
        this.novoProduto
      ).subscribe({

        next: (produto) => {

          const index = this.produtos.findIndex(
            p => p._id === this.produtoEditandoId
          );

          if (index !== -1) {
            this.produtos[index] = produto;
          }

          this.fecharModal();

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error('Erro ao editar produto:', erro);

          alert('Erro ao editar o produto.');

        }

      });

      return;

    }


    // CADASTRAR

    this.produtoService.cadastrar(this.novoProduto).subscribe({

      next: (produto) => {

        this.produtos.unshift(produto);

        this.fecharModal();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao cadastrar produto:', erro);

        alert('Erro ao cadastrar o produto.');

      }

    });

  }


  excluirProduto(id: string): void {

    const confirmar = confirm(
      'Tem certeza que deseja excluir este produto?'
    );

    if (!confirmar) {
      return;
    }

    this.produtoService.excluir(id).subscribe({

      next: () => {

        this.produtos = this.produtos.filter(
          p => p._id !== id
        );

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao excluir produto:', erro);

        alert('Erro ao excluir o produto.');

      }

    });

  }


  formatarPreco(preco: number): string {

    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  }


  labelCategoria(categoria: string): string {

    const labels: Record<string, string> = {
      brinquedos: 'Brinquedos',
      'buquês': 'Buquês',
      presentes: 'Presentes',
      'decoração': 'Decoração',
      outros: 'Outros'
    };

    return labels[categoria] ?? categoria;

  }

}
