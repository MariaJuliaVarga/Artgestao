import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgendaService, Festa } from '../../services/agenda';
import { DataBloqueadaService } from '../../services/data-bloqueada';

interface DiaMes {
  numero: number;
  dataISO: string;
  temFesta: boolean;
  bloqueada: boolean;
  foraMes: boolean;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda implements OnInit {

  // ─── CALENDÁRIO ───────────────────────────────────────

  dataHoje: Date = new Date();

  mesAtual: number = this.dataHoje.getMonth();

  anoAtual: number = this.dataHoje.getFullYear();

  diaSelecionado: string | null = null;

  diasMes: DiaMes[] = [];

  // ─── FESTAS ───────────────────────────────────────────

  todasFestas: Festa[] = [];

  festasDoDia: Festa[] = [];

  // ─── DATAS BLOQUEADAS ─────────────────────────────────

  datasBloqueadas: string[] = [];

  motivoBloqueio = '';

  mostrarModalBloqueio = false;

  // ─── MODAL FORMULÁRIO ─────────────────────────────────

  mostrarFormulario = false;

  editando = false;

  festaEditandoId: string | null = null;

  novaFesta: Festa = {
    nome: '',
    data: '',
    horario: '',
    observacao: ''
  };

  // ─── MODAL DETALHES ───────────────────────────────────

  festaDetalhes: Festa | null = null;

  nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


  constructor(
    private agendaService: AgendaService,
    private dataBloqueadaService: DataBloqueadaService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.carregarTudo();

  }


  // ─── INICIALIZAÇÃO ────────────────────────────────────

  carregarTudo(): void {

    // Carrega festas e datas bloqueadas em paralelo
    this.agendaService.listar().subscribe({

      next: (festas) => {

        this.todasFestas = festas;

        this.dataBloqueadaService.listar().subscribe({

          next: (bloqueadas) => {

            this.datasBloqueadas = bloqueadas.map(b => b.data);

            this.gerarCalendario();

          },

          error: () => {

            this.gerarCalendario();

          }

        });

      },

      error: () => {

        this.gerarCalendario();

      }

    });

  }


  // ─── CALENDÁRIO ───────────────────────────────────────

  gerarCalendario(): void {

    this.diasMes = [];

    const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1);
    const ultimoDia   = new Date(this.anoAtual, this.mesAtual + 1, 0);
    const diaSemanaInicio = primeiroDia.getDay();

    // Dias do mês anterior
    for (let i = 0; i < diaSemanaInicio; i++) {

      const d = new Date(this.anoAtual, this.mesAtual, -diaSemanaInicio + 1 + i);

      this.diasMes.push({
        numero: d.getDate(),
        dataISO: this.paraISO(d),
        temFesta: false,
        bloqueada: false,
        foraMes: true
      });

    }

    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {

      const d = new Date(this.anoAtual, this.mesAtual, dia);
      const iso = this.paraISO(d);

      this.diasMes.push({
        numero: dia,
        dataISO: iso,
        temFesta: this.todasFestas.some(f => f.data === iso),
        bloqueada: this.datasBloqueadas.includes(iso),
        foraMes: false
      });

    }

    // Dias do próximo mês
    const totalCelulas = Math.ceil(this.diasMes.length / 7) * 7;
    let proxDia = 1;

    while (this.diasMes.length < totalCelulas) {

      const d = new Date(this.anoAtual, this.mesAtual + 1, proxDia++);

      this.diasMes.push({
        numero: d.getDate(),
        dataISO: this.paraISO(d),
        temFesta: false,
        bloqueada: false,
        foraMes: true
      });

    }

    this.cdr.detectChanges();

  }


  mesAnterior(): void {

    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }

    this.diaSelecionado = null;
    this.festasDoDia = [];

    this.gerarCalendario();

  }


  proximoMes(): void {

    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }

    this.diaSelecionado = null;
    this.festasDoDia = [];

    this.gerarCalendario();

  }


  selecionarDia(dia: DiaMes): void {

    if (dia.foraMes) {
      return;
    }

    this.diaSelecionado = dia.dataISO;

    this.agendaService.listarPorData(dia.dataISO).subscribe({

      next: (festas) => {

        this.festasDoDia = festas;

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao buscar festas do dia:', erro);

      }

    });

  }


  ehHoje(dia: DiaMes): boolean {

    return dia.dataISO === this.paraISO(this.dataHoje);

  }


  ehSelecionado(dia: DiaMes): boolean {

    return dia.dataISO === this.diaSelecionado;

  }


  get diaSelecionadoBloqueado(): boolean {

    return !!this.diaSelecionado &&
      this.datasBloqueadas.includes(this.diaSelecionado);

  }


  // ─── DATAS BLOQUEADAS ─────────────────────────────────

  abrirModalBloqueio(): void {

    this.motivoBloqueio = '';

    this.mostrarModalBloqueio = true;

  }


  fecharModalBloqueio(): void {

    this.mostrarModalBloqueio = false;

    this.motivoBloqueio = '';

  }


  confirmarBloqueio(): void {

    if (!this.diaSelecionado) {
      return;
    }

    this.dataBloqueadaService.bloquear(
      this.diaSelecionado,
      this.motivoBloqueio
    ).subscribe({

      next: () => {

        this.datasBloqueadas.push(this.diaSelecionado!);

        this.gerarCalendario();

        this.fecharModalBloqueio();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao bloquear data:', erro);

        alert('Erro ao bloquear a data.');

      }

    });

  }


  desbloquearData(): void {

    if (!this.diaSelecionado) {
      return;
    }

    const confirmar = confirm(
      `Desbloquear ${this.formatarDataExibicao(this.diaSelecionado)}?`
    );

    if (!confirmar) {
      return;
    }

    this.dataBloqueadaService.desbloquear(this.diaSelecionado).subscribe({

      next: () => {

        this.datasBloqueadas = this.datasBloqueadas.filter(
          d => d !== this.diaSelecionado
        );

        this.gerarCalendario();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao desbloquear data:', erro);

        alert('Erro ao desbloquear a data.');

      }

    });

  }


  // ─── FESTAS ───────────────────────────────────────────

  listarFestas(): void {

    this.agendaService.listar().subscribe({

      next: (festas) => {

        this.todasFestas = festas;

        this.gerarCalendario();

      },

      error: (erro) => {

        console.error('Erro ao buscar festas:', erro);

      }

    });

  }


  // ─── FORMULÁRIO FESTA ─────────────────────────────────

  abrirNovaFesta(): void {

    this.novaFesta = {
      nome: '',
      data: this.diaSelecionado ?? '',
      horario: '',
      observacao: ''
    };

    this.editando = false;

    this.festaEditandoId = null;

    this.mostrarFormulario = true;

  }


  abrirEdicao(festa: Festa): void {

    this.novaFesta = {
      nome: festa.nome,
      data: festa.data,
      horario: festa.horario,
      observacao: festa.observacao ?? ''
    };

    this.festaEditandoId = festa._id!;

    this.editando = true;

    this.mostrarFormulario = true;

    this.festaDetalhes = null;

  }


  fecharFormulario(): void {

    this.mostrarFormulario = false;

    this.editando = false;

    this.festaEditandoId = null;

  }


  salvarFesta(): void {

    const { nome, data, horario } = this.novaFesta;

    if (!nome || !data || !horario) {

      alert('Preencha os campos obrigatórios: nome, data e horário.');

      return;

    }

    // Impede cadastro em data bloqueada
    if (this.datasBloqueadas.includes(data)) {

      alert('Não é possível cadastrar uma festa nesta data, pois ela está bloqueada.');

      return;

    }

    if (this.editando && this.festaEditandoId) {

      this.agendaService.editar(
        this.festaEditandoId,
        this.novaFesta
      ).subscribe({

        next: (festaAtualizada) => {

          const idx = this.todasFestas.findIndex(
            f => f._id === this.festaEditandoId
          );

          if (idx !== -1) {
            this.todasFestas[idx] = festaAtualizada;
          }

          const idxDia = this.festasDoDia.findIndex(
            f => f._id === this.festaEditandoId
          );

          if (idxDia !== -1) {

            if (festaAtualizada.data === this.diaSelecionado) {
              this.festasDoDia[idxDia] = festaAtualizada;
            } else {
              this.festasDoDia.splice(idxDia, 1);
            }

          }

          this.gerarCalendario();

          this.fecharFormulario();

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error('Erro ao editar festa:', erro);

          alert('Erro ao editar a festa.');

        }

      });

      return;

    }

    this.agendaService.cadastrar(this.novaFesta).subscribe({

      next: (festaNova) => {

        this.todasFestas.push(festaNova);

        if (festaNova.data === this.diaSelecionado) {

          this.festasDoDia.push(festaNova);

          this.festasDoDia.sort((a, b) =>
            a.horario.localeCompare(b.horario)
          );

        }

        this.gerarCalendario();

        this.fecharFormulario();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao cadastrar festa:', erro);

        alert('Erro ao cadastrar a festa.');

      }

    });

  }


  excluirFesta(id: string): void {

    const confirmar = confirm(
      'Tem certeza que deseja excluir esta festa?'
    );

    if (!confirmar) {
      return;
    }

    this.agendaService.excluir(id).subscribe({

      next: () => {

        this.todasFestas = this.todasFestas.filter(
          f => f._id !== id
        );

        this.festasDoDia = this.festasDoDia.filter(
          f => f._id !== id
        );

        this.festaDetalhes = null;

        this.gerarCalendario();

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('Erro ao excluir festa:', erro);

        alert('Erro ao excluir a festa.');

      }

    });

  }


  // ─── DETALHES ─────────────────────────────────────────

  abrirDetalhes(festa: Festa): void {

    this.festaDetalhes = festa;

  }


  fecharDetalhes(): void {

    this.festaDetalhes = null;

  }


  // ─── UTILITÁRIOS ──────────────────────────────────────

  paraISO(d: Date): string {

    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;

  }


  formatarDataExibicao(iso: string): string {

    if (!iso) return '';

    const [ano, mes, dia] = iso.split('-');

    return `${dia}/${mes}/${ano}`;

  }


  get tituloMes(): string {

    return `${this.nomesMeses[this.mesAtual]} ${this.anoAtual}`;

  }


  get quantidadeMes(): number {

    return this.todasFestas.filter(f => {

      const [ano, mes] = f.data.split('-').map(Number);

      return ano === this.anoAtual && mes - 1 === this.mesAtual;

    }).length;

  }

}
