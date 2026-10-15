import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemaService, Tema } from '../../services/tema';

@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './temas.html',
  styleUrl: './temas.css'
})
export class Temas implements OnInit {

  temas: Tema[] = [];

  imagemAmpliada: string | null = null;

  imagensCarrossel: string[] = [];

  indiceImagemAtual = 0;

  termoPesquisa = '';

  mostrarFormulario = false;

  editando = false;

  temaEditandoId: string | null = null;

  arquivoImagens: File[] = [];

  previewImagens: string[] = [];

  novoTema: Tema = {
    nome: '',
    descricao: '',
    imagens: []
  };


  constructor(
    private temaService: TemaService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.listarTemas();

  }


  listarTemas(): void {

    this.temaService.listar().subscribe({

      next: (dados) => {

        this.temas = dados;

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao buscar temas:',
          erro
        );

      }

    });

  }


  abrirNovoTema(): void {

    this.novoTema = {
      nome: '',
      descricao: '',
      imagens: []
    };

    this.arquivoImagens = [];

    this.previewImagens = [];

    this.editando = false;

    this.temaEditandoId = null;

    this.mostrarFormulario = true;

  }


  fecharFormulario(): void {

    this.mostrarFormulario = false;

    this.editando = false;

    this.temaEditandoId = null;

    this.arquivoImagens = [];

    this.previewImagens = [];

  }


  selecionarImagens(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const novasImagens = Array.from(input.files);

  this.arquivoImagens = [
    ...this.arquivoImagens,
    ...novasImagens
  ];


  novasImagens.forEach((arquivo) => {

    const reader = new FileReader();

    reader.onload = () => {

      this.previewImagens.push(
        reader.result as string
      );

      this.cdr.detectChanges();

    };

    reader.readAsDataURL(arquivo);

  });

  // Permite selecionar novamente os mesmos arquivos
  input.value = '';

}

  editarTema(tema: Tema): void {

    this.novoTema = {

      nome: tema.nome,

      descricao: tema.descricao,

      imagens: tema.imagens

    };

    this.temaEditandoId = tema._id!;

    this.editando = true;

    this.mostrarFormulario = true;

    this.arquivoImagens = [];


    this.previewImagens = [];

    if (tema.imagens) {

      tema.imagens.forEach((imagem) => {

        this.previewImagens.push(
          'http://localhost:3000' + imagem
        );

      });

    }

  }

  excluirImagem(
    tema: Tema,
    imagem: string
  ): void {

    const confirmar = confirm(
      'Tem certeza que deseja excluir esta imagem?'
    );

    if (!confirmar) {

      return;

    }


    this.temaService.excluirImagem(
      tema._id!,
      imagem
    ).subscribe({

      next: (temaAtualizado) => {

        console.log(
          'Imagem excluída com sucesso.'
        );

        const index =
          this.temas.findIndex(
            item => item._id === tema._id
          );

        if (index !== -1) {

          this.temas[index] =
            temaAtualizado;

        }

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao excluir imagem:',
          erro
        );

        alert(
          'Erro ao excluir a imagem.'
        );

      }

    });

  }


  removerPreview(index: number): void {

    this.previewImagens.splice(index, 1);

    this.arquivoImagens.splice(index, 1);

  }


  salvarTema(): void {

    if (
      !this.novoTema.nome ||
      !this.novoTema.descricao
    ) {

      alert('Preencha todos os campos.');

      return;

    }


    const formData = new FormData();

    formData.append(
      'nome',
      this.novoTema.nome
    );

    formData.append(
      'descricao',
      this.novoTema.descricao
    );


    this.arquivoImagens.forEach((arquivo) => {

      formData.append(
        'imagens',
        arquivo
      );

    });


    // EDITAR

    if (
      this.editando &&
      this.temaEditandoId
    ) {

      this.temaService.editar(
        this.temaEditandoId,
        formData
      ).subscribe({

        next: (tema) => {

          console.log(
            'Tema editado:',
            tema
          );

          this.listarTemas();

          this.fecharFormulario();

        },

        error: (erro) => {

          console.error(
            'Erro ao editar tema:',
            erro
          );

          alert(
            'Erro ao editar o tema.'
          );

        }

      });

      return;

    }


    // CADASTRAR

    if (this.arquivoImagens.length === 0) {

      alert(
        'Selecione pelo menos uma imagem.'
      );

      return;

    }


    this.temaService.cadastrar(
      formData
    ).subscribe({

      next: (tema) => {

        console.log(
          'Tema cadastrado:',
          tema
        );

        this.temas.push(tema);

        this.fecharFormulario();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao cadastrar tema:',
          erro
        );

        alert(
          'Erro ao cadastrar o tema.'
        );

      }

    });

  }


  excluirTema(id: string): void {

    const confirmar = confirm(
      'Tem certeza que deseja excluir este tema?'
    );

    if (!confirmar) {

      return;

    }


    this.temaService.excluir(id)
      .subscribe({

        next: () => {

          console.log(
            'Tema excluído com sucesso.'
          );

          this.temas =
            this.temas.filter(
              tema => tema._id !== id
            );

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao excluir tema:',
            erro
          );

          alert(
            'Erro ao excluir o tema.'
          );

        }

      });

  }

  temasFiltrados(): Tema[] {

  if (!this.termoPesquisa) {
    return this.temas;
  }

  return this.temas.filter((tema) =>
    tema.nome
      .toLowerCase()
      .includes(this.termoPesquisa.toLowerCase())
  );

}

abrirImagem(imagem: string, imagens: string[]): void {

  this.imagensCarrossel = imagens;

  this.indiceImagemAtual = imagens.findIndex(
    item => item === imagem
  );

  this.imagemAmpliada =
    'http://localhost:3000' + imagem;

}


imagemAnterior(): void {

  if (this.imagensCarrossel.length <= 1) {
    return;
  }

  this.indiceImagemAtual--;

  if (this.indiceImagemAtual < 0) {
    this.indiceImagemAtual =
      this.imagensCarrossel.length - 1;
  }

  this.imagemAmpliada =
    'http://localhost:3000' +
    this.imagensCarrossel[this.indiceImagemAtual];

}


proximaImagem(): void {

  if (this.imagensCarrossel.length <= 1) {
    return;
  }

  this.indiceImagemAtual++;

  if (
    this.indiceImagemAtual >=
    this.imagensCarrossel.length
  ) {
    this.indiceImagemAtual = 0;
  }

  this.imagemAmpliada =
    'http://localhost:3000' +
    this.imagensCarrossel[this.indiceImagemAtual];

}


fecharImagem(): void {

  this.imagemAmpliada = null;

  this.imagensCarrossel = [];

  this.indiceImagemAtual = 0;

}


}