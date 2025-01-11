export interface IExcursao {
  id: string
  nome: string
  dataInicio: string
  dataFim: string
  observacoes: string | null
  ativo: boolean
  publicadoSite: boolean
  gerouFinanceiro: boolean
  vagas: number
  valor: number
  codigoPacote: string
  usuarioCadastro: string
  concluida: boolean
  qtdMinVendas: number
  destacado: boolean
  ExcursaoPassageiros: {
    id: string
    reserva: string
    localEmbarque: string
    Pessoa: {
      id: string
      nome: string
      cpf: string
      sexo: string
      observacoes: string | null
      telefone: string | null
      telefoneWpp: string | null
      email: string
      contato: string | null
      telefoneContato: string | null
      ativo: boolean
      dataNascimento: string | null
      usuarioCadastro: string
    }
    LocalEmbarque: {
      id: string
      nome: string
      observacoes: string
      horaEmbarque: string
      ativo: boolean
      codigoEndereco: string
      usuarioCadastro: string
    }
  }
  Pacotes: {
    id: string
    nome: string
    valor: number
    descricao: string
    ativo: boolean
    origem: number
    tipoTransporte: number
    urlImagem: string
    urlImgEsgotado: string
    idWP: number
    destino: string
    categoria: string
    codigoDestino: string | null
    usuarioCadastro: string
    Produto: {
      id: string
      nome: string
      valor: number
    }[]
  }
  LocalEmbarque: {
    id: string
    nome: string
    observacoes: string
    horaEmbarque: string
    ativo: boolean
    codigoEndereco: string
    usuarioCadastro: string
  }[]
}

export interface IExcursaoArgs {
  page: number;
  size: number;
  nome?: string | null
  dataInicio?: string | null
  dataFim?: string | null
  status?: number | string | null
  ativo?: boolean
}

export interface IDataExcursao {
  nome: string
  dataInicio: Date
  dataFim: Date
  observacoes: string | null
  ativo: boolean
  gerouFinanceiro: boolean
  vagas: number
  codigoPacote: string
  usuarioCadastro: string
  qtdMinVendas: number
}

export interface IExcursaoResponse {
  data: IExcursao[];
  count: number;
  isLoading: boolean;
}

export interface IExcursaoListResponse {
  data: IExcursao;
  isLoading: boolean;
}

export interface ICreateExcursaoArgs {
  nome: string
  dataInicio: Date
  dataFim: Date
  observacoes: string | null
  ativo: boolean
  gerouFinanceiro: boolean
  vagas: number
  codigoPacote: string
  usuarioCadastro: string
  qtdMinVendas: number
  itensAdicionais: {
    idFornecedor: string
    valor: number
    data: string
  }[]
  localEmbarque: {
    id: string
  }[]
}

export interface IUpdateExcursaoArgs extends ICreateExcursaoArgs {
  id: string
}

export interface ICreateExcursaoResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, ICreateExcursaoArgs, unknown>;
}

export interface IUpdateExcursaoResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, IUpdateExcursaoArgs, unknown>;
}
