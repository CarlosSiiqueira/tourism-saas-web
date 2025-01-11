import { useMutation, useQuery } from "react-query";
import { useToastStandalone } from "./useToastStandalone";
import { apiPrados } from "../services/api";
import {
  IExcursaoArgs,
  IExcursaoResponse,
  ICreateExcursaoArgs,
  ICreateExcursaoResponse,
  IUpdateExcursaoArgs,
  IUpdateExcursaoResponse,
  IExcursaoListResponse,
  IExcursao
} from "../models/excursao.model";
import { Warning } from "../errors";
import { keys, queryClient } from "../services/query";

const getExcursoes = (
  { page,
    size,
    nome,
    dataInicio,
    dataFim,
    status,
    ativo
  }: IExcursaoArgs): IExcursaoResponse => {

  const { data, isLoading } = useQuery(
    [
      keys.excursao,
      page,
      nome,
      dataInicio,
      dataFim,
      status
    ],
    async () => {
      const path = 'excursao/index';

      dataInicio = dataInicio ? dataInicio : null
      dataFim = dataFim ? dataFim : null

      try {
        const { data } = await apiPrados.get(path, {
          params: {
            page,
            size,
            nome,
            dataInicio,
            dataFim,
            status,
            ativo
          },
        });

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  )

  return {
    data: data?.rows || [],
    count: data?.count || 0,
    isLoading
  };
}

const getExcursao = (id: string): IExcursaoListResponse => {

  const { data, isLoading } = useQuery(
    [
      keys.excursao,
      id
    ],
    async () => {
      const path = `excursao/find/${id}`
      try {
        const { data } = await apiPrados.get(path)

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  )

  return {
    data: data || [],
    isLoading
  };

}

const createExcursao = (
  reset: () => void,
  handleClose: () => void
): ICreateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: ICreateExcursaoArgs) => {
      const urlPath = 'excursao/create'

      try {
        await apiPrados.post(urlPath, data).then(() => {
          reset()
          handleClose()

          queryClient.invalidateQueries([keys.excursao])

          useToastStandalone({
            title: "Cadastro concluído!",
            status: "success",
          });
        })
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const updateExcursao = (
  reset: () => void,
  handleClose: () => void
): IUpdateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: IUpdateExcursaoArgs) => {
      const urlPath = `excursao/update/${data.id}`;

      try {
        await apiPrados.put(urlPath, data).then(() => {
          reset()
          handleClose()
          queryClient.invalidateQueries([keys.excursao])

          useToastStandalone({
            title: "Atualizado com sucesso!",
            status: "success"
          })
        })
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const deleteExcursao = (): IUpdateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao/delete/${id}`

      try {
        await apiPrados.patch(urlPath).then(function () {
          queryClient.invalidateQueries([keys.excursao])

          useToastStandalone({
            title: "Excluída com sucesso!",
            status: "success"
          })
        })
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const findExcursao = (): IUpdateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao/find/${id}`

      try {
        const { data } = await apiPrados.get(urlPath)
        queryClient.invalidateQueries([keys.excursao])

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const publicarExcursao = (): IUpdateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao/publish/${id}`

      try {
        await apiPrados.patch(urlPath).then(function () {
          queryClient.invalidateQueries([keys.excursao])

          useToastStandalone({
            title: "Excursão publicada com sucesso!",
            status: "success"
          })
        })
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const concluirExcursao = (): IUpdateExcursaoResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao/concluir/${id}`

      try {
        await apiPrados.patch(urlPath).then(function () {
          queryClient.invalidateQueries([keys.excursao])

          useToastStandalone({
            title: "Excursão concluída com sucesso!",
            status: "success"
          })
        })
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    isLoading,
    mutate
  }
}

const excursaoPromiseOptions = async (search: string, _loadedOptions: any, { page }: any) => {

  const path = 'excursao/index';
  const itensPerPage = 20;

  const { data } = await apiPrados.get(path, {
    params: {
      page,
      size: itensPerPage,
      nome: search,
      orderBy: 'nome'
    },
  });

  return {
    options: data.rows.map((item: IExcursao) => ({
      label: item.nome,
      value: item.id
    })),
    hasMore: data.count > (page * itensPerPage),
    additional: {
      page: page + 1,
    }
  }
}

export default function useExcursoes() {
  return {
    getExcursoes,
    getExcursao,
    createExcursao,
    updateExcursao,
    deleteExcursao,
    publicarExcursao,
    findExcursao,
    concluirExcursao,
    excursaoPromiseOptions
  }
}
