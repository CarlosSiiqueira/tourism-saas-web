/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input, FormControl, FormLabel, FormErrorMessage, Checkbox } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import usePacotes from "../../../../hooks/usePacotes";
import useExcursoes from "../../../../hooks/useExcursao";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import ReactSelect from "react-select";
// import { useGlobal } from "../../../../contexts/UserContext";
import FormInputNumber from "../../../../components/FormInputNumber";
import FormInput from "../../../../components/FormInput";
import { useState } from "react";
import { isDateLessThan150YearsAgo } from "../../../../utils/formattingDate";
import { useGlobal } from "../../../../contexts/UserContext";
import { IExcursao } from "../../../../models/excursao.model";
import useLocalEmbarque from "../../../../hooks/useLocalEmbarque";
import { IOption } from "../../../../components/SelectForm/types";

const handleSubmitRegisterSchema = z.object({
  nome: z
    .string()
    .min(1, {
      message: fieldRequired("nome"),
    }),
  codigoPacote: z
    .string()
    .min(1, {
      message: fieldRequired("pacote"),
    }),
  dataInicio: z
    .string()
    .min(1, {
      message: fieldRequired("data de início"),
    }),
  dataFim: z
    .string()
    .min(1, {
      message: fieldRequired("data de fim"),
    }),
  vagas: z
    .number()
    .min(1, {
      message: fieldRequired("vagas"),
    }),
  valor: z
    .number()
    .min(1, {
      message: fieldRequired("valor")
    }),
  observacoes: z
    .string()
    .optional(),
  qtdMinVendas: z
    .number()
    .min(0, {
      message: fieldRequired('Defina o valor minimo de vendas')
    }),
  localEmbarque: z
    .array(z.string())
    .min(1, {
      message: fieldRequired('Defina os locais de embarque')
    }),
  destacado: z
    .boolean()
    .optional()
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalRecordCollaborator {
  handleClose: () => void;
  data: IExcursao
}

const ModalUpdateExcursao = ({
  handleClose,
  data
}: IModalRecordCollaborator) => {
  const { user } = useGlobal();
  const { updateExcursao } = useExcursoes();
  const { getAllPacotes } = usePacotes();
  const { getLocalEmbarque } = useLocalEmbarque()

  const [errorBornDate, setErrorDate] = useState({
    message: "",
  });

  const {
    setValue,
    getValues,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
    defaultValues: {
      nome: data.nome,
      vagas: data.vagas,
      valor: data.valor,
      observacoes: data.observacoes || '',
      dataInicio: data.dataInicio.split('T')[0],
      dataFim: data.dataFim.split('T')[0],
      codigoPacote: data.codigoPacote,
      localEmbarque: data.LocalEmbarque.map((local) => { return local.id }),
      qtdMinVendas: data.qtdMinVendas,
      destacado: data.destacado
    }
  });

  const { mutate, isLoading } = updateExcursao(reset, handleClose);
  const { data: dataPacotes, isLoading: loadingpacotees } = getAllPacotes();
  const { data: localEmbarqueData, isLoading: isLoadingLocalEmbarque } = getLocalEmbarque()
  const [isCheckedDestacado, setCheckDestacado] = useState(data.destacado || false)

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData,
      id: data.id,
      ativo: true,
      usuarioCadastro: user?.id
    })
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitRegister)}
      style={{ width: "100%" }}
    >
      <Box display="flex" flexDirection="column" gap="25px" padding="30px">
        <span>
          (<Asterisk />) indica os campos obrigatórios
        </span>

        <FieldWrap>
          <span>
            Nome <Asterisk />
          </span>

          <Input
            placeholder="Digite o nome"
            id="nome"
            type="text"
            {...register("nome")}
          />
          {errors.nome && <p className="error">{errors.nome.message}</p>}
        </FieldWrap>

        <FieldWrap>
          <span>Pacote <Asterisk /></span>

          <Box display="flex" gap="10px">
            <ReactSelect
              isLoading={loadingpacotees}
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("codigoPacote")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há pacote cadastrado"}
              options={dataPacotes
                ?.map((pacote) => ({
                  label: pacote?.nome,
                  value: pacote?.id,
                }))}
              name="codigoPacote"
              id="codigoPacote"
              onChange={(option) => {
                setValue("codigoPacote", option?.value.toString() || "");
              }}
              defaultValue={{
                label: data.Pacotes.nome,
                value: data.Pacotes.id
              }}
            />
          </Box>
        </FieldWrap>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >
          <FormControl
            isRequired
            isInvalid={errorBornDate?.message ? true : false}
          >
            <FormLabel>Data de início</FormLabel>
            <Input
              name="dataInicio"
              type="date"
              placeholder="dd/mm/aaaa"
              value={getValues("dataInicio")}
              onChange={({ target: { value } }) => {
                const dataAtual = new Date();
                const data = new Date(value);

                if (data < dataAtual) {
                  setErrorDate({
                    message:
                      "A data de início não pode ser inferior a data atual",
                  });
                } else if (isDateLessThan150YearsAgo(data)) {
                  setErrorDate({
                    message:
                      "A data de início não pode ser inferior há 150 anos atrás",
                  });
                } else {
                  setErrorDate({
                    message: ''
                  })
                }
                setValue("dataInicio", value);
              }}

              max="2099-12-31"
              maxLength={10}
            />
            <FormErrorMessage>{errorBornDate?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={errorBornDate?.message ? true : false}
          >
            <FormLabel>Data de fim</FormLabel>
            <Input
              name="dataFim"
              type="date"
              placeholder="dd/mm/aaaa"
              value={getValues("dataFim")}
              onChange={({ target: { value } }) => {
                const dataAtual = new Date();
                const data = new Date(value);

                if (data < dataAtual) {
                  setErrorDate({
                    message:
                      "A data de fim não pode ser inferior a data atual",
                  });
                } else if (isDateLessThan150YearsAgo(data)) {
                  setErrorDate({
                    message:
                      "A data de fim não pode ser inferior há 150 anos atrás",
                  });
                } else {
                  setErrorDate({
                    message: ''
                  })
                }
                setValue("dataFim", value);
              }}
              max="2099-12-31"
              maxLength={10}
            />
            <FormErrorMessage>{errorBornDate?.message}</FormErrorMessage>
          </FormControl>
        </Flex>

        <FormInputNumber
          height="40px"
          label="Vagas"
          setValue={setValue}
          value={getValues("vagas")}
          name="vagas"
          maxLength={25}
          isRequired
          errors={errors.vagas}
        />

        <FormInputNumber
          height="40px"
          label="Valor"
          {...register("valor")}
          setValue={setValue}
          isMoneyValue
          flex="1.01"
          name="valor"
          maxLength={25}
          isRequired
          errors={errors.valor}
          value={getValues('valor')}
        />

        <FormInputNumber
          height='40px'
          label='Quantidade minima para venda'
          {...register('qtdMinVendas')}
          setValue={setValue}
          flex='1.01'
          name='qtdMinVendas'
          isRequired
          errors={errors.qtdMinVendas}
          value={getValues('qtdMinVendas')}
        />

        <FormInput
          id="observacoes"
          label="Observações"
          type="text"
          {...register?.("observacoes")}
          inputArea={true}
          errors={errors.observacoes}
          name="observacoes"
          defaultValue={
            data.observacoes || ''
          }
          onChangeTextarea={(event) => {
            setValue("observacoes", event.target.value || '');
          }}
        />

        <FieldWrap>
          <span>Locais De Embarque <Asterisk /></span>
          <ReactSelect
            {...register('localEmbarque')}
            name="localEmbarqueId"
            className="select-fields"
            classNamePrefix="select"
            closeMenuOnSelect={true}
            isSearchable={true}
            placeholder="Selecionar"
            noOptionsMessage={() => "Nenhum local encontrado"}
            isLoading={isLoadingLocalEmbarque}
            required
            isMulti
            onChange={(item) => {
              setValue('localEmbarque', item?.map((item: IOption) => item?.value.toString()) || [])
            }}
            options={localEmbarqueData.map((local) => {
              return { value: local.id, label: `${local.horaEmbarque} - ${local.nome}` }
            })}
            defaultValue={
              data.LocalEmbarque.map((local) => {
                return {
                  value: local.id, label: `${local.horaEmbarque} ${local.nome}`
                }
              })
            }
          />

        </FieldWrap>

        <Checkbox
          borderColor="#909090"
          isChecked={isCheckedDestacado}
          {...register('destacado')}
          _checked={{
            ".chakra-checkbox__control": {
              bgColor: "brand.500",
              borderColor: "brand.500",
              boxShadow: "none",
            },
            ".chakra-checkbox__control:hover": {
              bgColor: "brand.500",
              borderColor: "brand.500",
              boxShadow: "none",
            },
          }}
          onChange={(event) => {
            setValue('destacado', event.target.checked ? true : false)
            setCheckDestacado(event.target.checked ? true : false)
          }}
        >
          Destacar Excursão no Site?
        </Checkbox>

        <Flex justifyContent="flex-end" gap="15px">
          <Button
            isDisabled={
              isLoading
            }
            isLoading={isLoading}
            type="submit"
          >
            Salvar
          </Button>
        </Flex>
      </Box>
    </form>
  );
};

export default ModalUpdateExcursao;
