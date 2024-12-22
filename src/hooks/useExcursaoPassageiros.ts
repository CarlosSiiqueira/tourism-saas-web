import { useMutation, useQuery } from "react-query";
import { useToastStandalone } from "./useToastStandalone";
import { apiPrados } from "../services/api";
import {
  ICreateExcursaoPassageiroArgs,
  ICreateExcursaoPassageiroResponse,
  IUpdateExcursaoPassageiroArgs,
  IUpdateExcursaoPassageiroResponse,
  IExcursaoPassageiroArgs,
  IExcursaoPassageiroResponse,
  IDeleteExcursaoPassageiroResponse
} from "../models/excursao-passageiro.model";
import { Warning } from "../errors";
import { keys, queryClient } from "../services/query";

const getAllPassageiros = ({ page, size, localEmbarque, nome }: IExcursaoPassageiroArgs, idExcursao: string): IExcursaoPassageiroResponse => {
  const { data, isLoading } = useQuery(
    [
      page,
      localEmbarque,
      idExcursao,
      nome
    ],
    async () => {
      const path = `excursao-passageiros/index/${idExcursao}`;

      try {
        const { data } = await apiPrados.get(path, {
          params: {
            page,
            size,
            localEmbarque,
            nome
          },
        });

        queryClient.removeQueries([keys.excursao])

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  );

  return {
    data: data?.passageiros?.rows || [],
    count: data?.passageiros?.count || 0,
    isLoading,
    summary: data?.summary || []
  };
};

const getExcursaoPassageiros = (idExcursao?: string): IExcursaoPassageiroResponse => {
  const { data, isLoading } = useQuery(
    [
      keys.excursaoPassageiro,
      idExcursao
    ],
    async () => {
      if (!idExcursao) {
        return []
      }

      const urlPath = `excursao-passageiros/find/${idExcursao}`

      try {
        const { data } = await apiPrados.get(urlPath)

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error?.response?.status);
      }
    }
  )

  return {
    data: data || [],
    count: data?.count || 0,
    isLoading
  }
}

const createExcursaoPassageiro = (
  reset: () => void,
  handleClose: () => void
): ICreateExcursaoPassageiroResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: ICreateExcursaoPassageiroArgs) => {
      const urlPath = 'excursao-passageiros/create'
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

const updateExcursaoPassageiro = (
  reset: () => void,
  handleClose: () => void
): IUpdateExcursaoPassageiroResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: IUpdateExcursaoPassageiroArgs) => {
      const urlPath = `excursao-passageiros/update/${data.id}`;

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

const deleteExcursaoPassageiro = (): IDeleteExcursaoPassageiroResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao-passageiros/delete/${id}`

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

export default function useExcursaoPassageiro() {
  return {
    getAllPassageiros,
    getExcursaoPassageiros,
    createExcursaoPassageiro,
    updateExcursaoPassageiro,
    deleteExcursaoPassageiro
  }
}
