/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useFormaPagamento from "../../../../hooks/useFormaPagamento";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import { useGlobal } from "../../../../contexts/UserContext";
import FormInputNumber from "../../../../components/FormInputNumber";
import SelectForm from "../../../../components/SelectForm";
import { IFormaPagamento } from "../../../../models/forma-pagamento.model";

const handleSubmitRegisterSchema = z.object({
  nome: z
    .string()
    .min(1, {
      message: fieldRequired("nome"),
    }),
  taxa: z
    .number()
    .min(0, {
      message: fieldRequired('taxa')
    }),
  taxa1x: z
    .number()
    .optional(),
  taxa2x: z
    .number()
    .optional(),
  taxa3x: z
    .number()
    .optional(),
  taxa4x: z
    .number()
    .optional(),
  taxa5x: z
    .number()
    .optional(),
  taxa6x: z
    .number()
    .optional(),
  taxa7x: z
    .number()
    .optional(),
  taxa8x: z
    .number()
    .optional(),
  taxa9x: z
    .number()
    .optional(),
  taxa10x: z
    .number()
    .optional(),
  taxa11x: z
    .number()
    .optional(),
  taxa12x: z
    .number()
    .optional(),
  ativo: z
    .boolean()
    .refine(value => value != undefined, {
      message: fieldRequired('ativo')
    }),
  creditCard: z
    .boolean()
    .refine(value => value != undefined, {
      message: fieldRequired('Cartão de Crédito')
    }),
  qtdDiasRecebimento: z
    .number()
    .min(1, {
      message: fieldRequired('Dias Recebimento')
    })
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalUpdateFormaPagamento {
  handleClose: () => void
  data: IFormaPagamento
}

const ModalUpdateContaBancaria = ({
  handleClose,
  data
}: IModalUpdateFormaPagamento) => {
  const { user } = useGlobal();
  const { updateFormaPagamento } = useFormaPagamento();

  const {
    getValues,
    setValue,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
    defaultValues: {
      nome: data.nome,
      taxa: data.taxa || 0,
      taxa1x: data.taxa1x || 0,
      taxa2x: data.taxa2x || 0,
      taxa3x: data.taxa3x || 0,
      taxa4x: data.taxa4x || 0,
      taxa5x: data.taxa5x || 0,
      taxa6x: data.taxa6x || 0,
      taxa7x: data.taxa7x || 0,
      taxa8x: data.taxa8x || 0,
      taxa9x: data.taxa9x || 0,
      taxa10x: data.taxa10x || 0,
      taxa11x: data.taxa11x || 0,
      taxa12x: data.taxa12x || 0,
      qtdDiasRecebimento: data.qtdDiasRecebimento,
      ativo: data.ativo,
      creditCard: data.creditCard
    }
  });
  const { mutate, isLoading } = updateFormaPagamento(reset, handleClose);

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData,
      id: data.id,
      usuarioCadastro: user?.id
    })
  };

  const dataAtivo = [
    {
      id: true,
      nome: "Ativo"
    },
    {
      id: false,
      nome: "Inativo"
    }
  ]

  const dataCreditCard = [
    {
      id: true,
      nome: "Sim"
    },
    {
      id: false,
      nome: "Não"
    }
  ]


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

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >
          <FormInputNumber
            height="40px"
            label="Nº dias para recebimento"
            minWidth="200px"
            {...register("qtdDiasRecebimento", { valueAsNumber: true })}
            setValue={setValue}
            value={getValues("qtdDiasRecebimento")}
            flex="1.01"
            name="qtdDiasRecebimento"
            maxLength={25}
            isRequired
            dontAllowNegative
            errors={errors.qtdDiasRecebimento}
          />

          <SelectForm
            name="ativo"
            label="Status"
            isRequired
            handleChange={(option) => {
              setValue("ativo", option?.value);
            }}
            options={dataAtivo
              ?.map((ativo) => ({
                label: ativo?.nome,
                value: ativo?.id,
              }))}
            errors={errors.ativo}
            defaultValue={{
              label: data.ativo ? 'Ativo' : 'Inativo',
              value: data.ativo
            }}
          />
        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >

          <SelectForm
            name="creditCard"
            label="Cartão de Crédito?"
            isRequired
            handleChange={(option) => {
              setValue("creditCard", option?.value);
            }}
            options={dataCreditCard
              ?.map((data) => ({
                label: data?.nome,
                value: data?.id,
              }))}
            errors={errors.creditCard}
            defaultValue={{
              label: data.creditCard ? 'Sim' : 'Não',
              value: data.creditCard
            }}
          />

          <FormInputNumber
            value={getValues('taxa')}
            label="Taxa"
            {...register("taxa", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa"
            maxLength={25}
            isRequired
            dontAllowNegative
            errors={errors.taxa}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}>

          <FormInputNumber
            value={getValues('taxa1x')}
            label="Taxa 1x"
            {...register("taxa1x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa1x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa1x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa2x')}
            label="Taxa 2x"
            {...register("taxa2x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa2x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa2x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa3x')}
            label="Taxa 3x"
            {...register("taxa3x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa3x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa3x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />
        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}>

          <FormInputNumber
            value={getValues('taxa4x')}
            label="Taxa 4x"
            {...register("taxa4x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa4x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa4x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa5x')}
            label="Taxa 5x"
            {...register("taxa5x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa5x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa5x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa6x')}
            label="Taxa 6x"
            {...register("taxa6x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa6x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa6x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}>

          <FormInputNumber
            value={getValues('taxa7x')}
            label="Taxa 7x"
            {...register("taxa7x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa7x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa7x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa8x')}
            label="Taxa 8x"
            {...register("taxa8x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa8x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa8x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa9x')}
            label="Taxa 9x"
            {...register("taxa9x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa9x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa9x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}>

          <FormInputNumber
            value={getValues('taxa10x')}
            label="Taxa 10x"
            {...register("taxa10x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa10x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa10x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa11x')}
            label="Taxa 11x"
            {...register("taxa11x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa11x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa11x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

          <FormInputNumber
            value={getValues('taxa12x')}
            label="Taxa 12x"
            {...register("taxa12x", { valueAsNumber: true })}
            defaultValue={0}
            setValue={setValue}
            flex="1.01"
            name="taxa12x"
            maxLength={25}
            dontAllowNegative
            errors={errors.taxa12x}
            prefix="percentual"
            minWidth="90px"
            maxWidth="33%"
          />

        </Flex>


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

export default ModalUpdateContaBancaria;
