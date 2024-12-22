export interface IVendasArgs {
  page: number;
  size: number;
}

export interface IVendas {
  id: string
  valorTotal: number
  valorUnitario: number
  tipo: number
  qtd: number
  efetivada: boolean
  origem: number
  codigoCliente: string
  codigoFormaPagamento: string
  codigoProduto: string | null
  codigoPacote: string | null
  usuarioCadastro: string
  numeroComprovante?: string | null
  Usuarios: {
    id: string,
    nome: string
  }
  Produtos: {
    id: string,
    nome: string
    valor: number
  }
  Excursao?: {
    id: string
    nome: string
    dataInicio: string
    dataFim: string
  }
  FormaPagamento: {
    id: string
    nome: string
  }
  Pessoas: {
    id: string
    nome: string
  }
}

export interface IVendasResponse {
  data: IVendas[];
  count: number;
  isLoading: boolean;
}

export interface ICreateVendasArgs {
  codigoCliente: string
  codigoProduto: string
  codigoExcursao: tring
  qtd: number
  valor: number
  codigoFormaPagamento: string
  tipo: number
  numeroComprovante?: string | null
}

export interface IUpdateVendasArgs extends ICreateVendasArgs {
  id: string
}

export interface ICreateVendasResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, ICreateVendasArgs, unknown>;
}

export interface IUpdateVendasResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, IUpdateVendasArgs, unknown>;
}

export interface IDeleteVendasResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, string, unknown>;
}

