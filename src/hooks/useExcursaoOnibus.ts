import { useMutation, useQuery } from "react-query";
import { useToastStandalone } from "./useToastStandalone";
import { apiPrados } from "../services/api";
import {
  ICreateExcursaoOnibusArgs,
  ICreateExcursaoOnibusResponse,
  IDeleteExcursaoOnibusArgs,
  IExcursaoOnibus,
  IExcursaoOnibusAcentosResponse,
  IExcursaoOnibusArgs,
  IExcursaoOnibusResponse,
  IOnibusAcentos,
  IPassageiroExcursaoOnibusResponse,
} from "../models/excursao.onibus.model";
import { Warning } from "../errors";
import { keys, queryClient } from "../services/query";

const createExcursaoOnibus = (): ICreateExcursaoOnibusResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: ICreateExcursaoOnibusArgs) => {
      const urlPath = 'excursao-onibus/create'

      try {
        await apiPrados.post(urlPath, data).then(() => {

          queryClient.invalidateQueries([keys.excursaoOnibus])
          
          useToastStandalone({
            title: "Assento Registrado!",
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

const getAcentos = ({ page, size }: IExcursaoOnibusArgs, idExcursao: string): IExcursaoOnibusAcentosResponse => {
  const { data, isLoading } = useQuery(
    [
      keys.excursaoOnibus,
      page
    ],
    async () => {
      try {
        queryClient.invalidateQueries([keys.excursaoOnibus])
        const acentos = new Array<IExcursaoOnibus>(64)
        acentos.fill({
          id: '',
          numeroCadeira: '',
          codigoPassageiro: '',
          codigoExcursao: '',
          usuarioCadastro: '',
          Passageiro: {
            Pessoa: {
              id: '',
              nome: ''
            }
          }
        }, 0, 63)
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;

        const path = `excursao-onibus/index/${idExcursao}`;

        const { data } = await apiPrados.get(path, {
          params: {
            page,
            size,
            orderBy: 'numeroCadeira',
            order: 'asc'
          },
        });

        if (data.rows.length) {
          data.rows.map((value: IExcursaoOnibus) => {
            acentos[parseInt(value.numeroCadeira) - 1] = {
              id: value.id,
              numeroCadeira: '',
              codigoPassageiro: '',
              codigoExcursao: '',
              usuarioCadastro: '',
              Passageiro: {
                Pessoa: {
                  id: value.Passageiro.Pessoa.id,
                  nome: value.Passageiro.Pessoa.nome
                }
              }
            }
          })
        }

        return acentos;
      } catch (error: any) {
        throw new Warning(error.response.data.message, error.response.status);
      }
    }
  );

  return {
    data: data || [],
    count: 63,
    isLoading
  };
}

const getExcursaoOnibus = (idExcursao?: string): IExcursaoOnibusResponse => {
  const { data, isLoading } = useQuery(
    [
      keys.excursaoOnibus,
      idExcursao
    ],
    async () => {
      if (!idExcursao) {
        return []
      }

      const urlPath = `excursao-onibus/findAll/${idExcursao}`

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

const listExcursaoPassageirosNoChair = (idExcursao: string, action: number): IPassageiroExcursaoOnibusResponse => {
  const { data, isLoading } = useQuery(
    [
      keys.excursaoOnibus,
      action,
      idExcursao
    ],
    async () => {
      const path = `excursao-passageiros/list-passageiros-no-chair/${idExcursao}`;
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

const removeAcentoOnibus = (): ICreateExcursaoOnibusResponse => {

  const { isLoading, mutate } = useMutation(
    async (data: IDeleteExcursaoOnibusArgs) => {
      const urlPath = `excursao-onibus/delete/${data.idPassageiro}/${data.excursaoId}`

      try {
        await apiPrados.delete(urlPath).then(() => {

          queryClient.invalidateQueries([keys.excursaoOnibus])

          useToastStandalone({
            title: "Assento removido!",
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

export default function useExcursaoOnibus() {
  return {
    createExcursaoOnibus,
    getAcentos,
    getExcursaoOnibus,
    listExcursaoPassageirosNoChair,
    removeAcentoOnibus
  }
}
