import { useMutation, useQuery } from "react-query";
import { useToastStandalone } from "./useToastStandalone";
import { apiPrados } from "../services/api";
import {
  IExcursaoQuartoArgs,
  IExcursaoQuartoResponse,
  ICreateExcursaoQuartoArgs,
  ICreateExcursaoQuartoResponse,
  IUpdateExcursaoQuartoArgs,
  IUpdateExcursaoQuartoResponse,
  IPassageiroExcursaoQuartoResponse
} from "../models/excursao-quarto.model";
import { Warning } from "../errors";
import { keys, queryClient } from "../services/query";


const listExcursaoPassageirosNoRoom = (idExcursao: string, numeroQuarto: string): IPassageiroExcursaoQuartoResponse => {
  const { data, isLoading } = useQuery(
    [
      keys.excursaoQuartoPassageiro,
      idExcursao,
      numeroQuarto
    ],
    async () => {
      const path = `excursao-passageiros/list-passageiros-no-room/${idExcursao}`;

      try {
        const { data } = await apiPrados.get(path);

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  );

  return {
    data: data || [],
    count: data?.count || 0,
    isLoading
  };
}

const getExcursaoQuarto = ({ page, size, idExcursao, idTipoQuarto, nome }: IExcursaoQuartoArgs): IExcursaoQuartoResponse => {

  const { data, isLoading } = useQuery(
    [
      keys.excursaoQuarto,
      page,
      idExcursao,
      idTipoQuarto,
      nome
    ],
    async () => {
      const path = 'excursao-quartos/index';

      try {
        const { data } = await apiPrados.get(path, {
          params: {
            page,
            size,
            idExcursao,
            idTipoQuarto,
            nome
          },
        });

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  )

  return {
    data: data?.quartos?.rows || [],
    count: data?.quartos?.count || 0,
    isLoading,
    summary: data?.summary || null
  };
}

const createExcursaoQuarto = (
  reset: () => void,
  handleClose: () => void
): ICreateExcursaoQuartoResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: ICreateExcursaoQuartoArgs) => {
      const urlPath = 'excursao-quartos/create'
      try {
        await apiPrados.post(urlPath, data).then(() => {

          queryClient.invalidateQueries([keys.excursaoQuarto])
          queryClient.invalidateQueries([keys.excursaoQuartoPassageiro])

          reset()
          handleClose()

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

const updateExcursaoQuarto = (
  reset: () => void,
  handleClose: () => void
): IUpdateExcursaoQuartoResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: IUpdateExcursaoQuartoArgs) => {
      const urlPath = `excursao-quartos/update/${data.id}`;
      try {
        await apiPrados.put(urlPath, data).then((data) => {
          reset()
          handleClose()
          queryClient.invalidateQueries([keys.excursaoQuarto])

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

const deleteExcursaoQuarto = (): IUpdateExcursaoQuartoResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `excursao-quartos/delete/${id}`

      try {
        await apiPrados.delete(urlPath).then(function (data) {
          queryClient.invalidateQueries([keys.excursaoQuarto])

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

export default function useExcursoes() {
  return {
    listExcursaoPassageirosNoRoom,
    getExcursaoQuarto,
    createExcursaoQuarto,
    updateExcursaoQuarto,
    deleteExcursaoQuarto
  }
}
