import React from "react"
import { ITransacaoCategoriasResponse } from "../../../models/transacao.model"
import { ISelect } from "../../../models/generics.model"

export interface IRelatorioCategoriasList {
  categoriasResponse: ITransacaoCategoriasResponse
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  codigoCategoria: ISelect | null
  setCategoria: React.Dispatch<React.SetStateAction<ISelect | null>>
  codigoSubCategoria: ISelect | null
  setSubCategoria: React.Dispatch<React.SetStateAction<ISelect | null>>
  dataInicio: string
  setDataInicio: React.Dispatch<React.SetStateAction<string>>
  dataFim: string
  setDataFim: React.Dispatch<React.SetStateAction<string>>
}
