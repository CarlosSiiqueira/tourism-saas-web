import { useMutation, useQuery } from "react-query";
import { useToastStandalone } from "./useToastStandalone";
import { apiPrados } from "../services/api";
import {
  IImagemArgs,
  IImagemResponse,
  ICreateImagemArgs,
  ICreateImagemResponse,
  IUpdateImagemArgs,
  IUpdateImagemResponse,
  IDeleteImagemResponse
} from "../models/imagem.model";
import { Warning } from "../errors";
import { keys, queryClient } from "../services/query";

const getImagem = ({ page, size, nome }: IImagemArgs): IImagemResponse => {

  const { data, isLoading } = useQuery(
    [
      keys.imagem,
      page,
      nome
    ],
    async () => {
      const path = 'imagens/index';

      try {
        const { data } = await apiPrados.get(path, {
          params: {
            page,
            size,
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
    data: data?.rows || [],
    count: data?.count || 0,
    isLoading
  };
}

const getAllImagem = (): IImagemResponse => {

  const { data, isLoading } = useQuery(
    [
      keys.imagem,
    ],
    async () => {
      const path = 'imagens/findAll';

      try {
        const { data } = await apiPrados.get(path);

        return data
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  )

  return {
    data: data || [],
    count: data?.count || 0,
    isLoading
  };
}

const createImagem = (
  reset: () => void,
  handleClose: () => void
): ICreateImagemResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: ICreateImagemArgs) => {
      const urlPath = 'imagens/create'

      debugger

      try {
        await apiPrados.post(urlPath, data).then(() => {
          reset()
          handleClose()

          queryClient.invalidateQueries([keys.imagem])

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

const updateImagem = (
  reset: () => void,
  handleClose: () => void
): IUpdateImagemResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: IUpdateImagemArgs) => {
      const urlPath = `imagens/update/${data.id}`;

      try {
        await apiPrados.put(urlPath, data).then(() => {
          reset()
          handleClose()
          queryClient.invalidateQueries([keys.imagem])

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

const deleteImagem = (): IDeleteImagemResponse => {

  const { isLoading, mutate } = useMutation(
    async (id: string) => {
      const urlPath = `imagens/delete/${id}`

      try {
        await apiPrados.delete(urlPath).then(function () {
          queryClient.invalidateQueries([keys.imagem])

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

export default function useImagem() {
  return {
    getImagem,
    getAllImagem,
    createImagem,
    updateImagem,
    deleteImagem
  }
}
