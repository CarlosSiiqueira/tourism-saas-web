export interface IImagemArgs {
  page: number;
  size: number;
  nome: string
}

export interface IImagem {
  id: string,
  nome: string
  url: string
}

export interface IImagemResponse {
  data: IImagem[];
  count: number;
  isLoading: boolean;
}

export interface ICreateImagemArgs {
  nome: string;
  image: string
  userId: string
}

export interface IUpdateImagemArgs extends ICreateImagemArgs {
  id: string
}

export interface ICreateImagemResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, ICreateImagemArgs, unknown>;
}

export interface IUpdateImagemResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, IUpdateImagemArgs, unknown>;
}

export interface IDeleteImagemResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, string, unknown>;
}

