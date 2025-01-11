/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useReservas from "../../../../hooks/useReservas";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import { useGlobal } from "../../../../contexts/UserContext";
import FormInputNumber from "../../../../components/FormInputNumber";
import SelectForm from "../../../../components/SelectForm";
import useExcursoes from "../../../../hooks/useExcursao";
import { FormEvent, useState } from "react";
import { cpfMask } from "../../../../utils";
import ReactSelect from "react-select";
import { IOption } from "../../../../components/SelectForm/types";
import useFormaPagamento from "../../../../hooks/useFormaPagamento";
import useContaBancaria from "../../../../hooks/useContaBancaria";
import { IExcursao } from "../../../../models/excursao.model";
import useLocalEmbarque from "../../../../hooks/useLocalEmbarque";
import { formattingDate } from "../../../../utils/formattingDate";
import Opcionais from "../Opcionais";
import SelectAsyncPaginate from "../../../../components/SelectAsyncPaginate";
import usePessoas from "../../../../hooks/usePessoas";
import { ISelect } from "../../../../models/generics.model";

const opcionalSchema = z.object({
  id: z.string(),
  quantidade: z.number().min(0),
  valor: z.number().min(0),
  nome: z.string()
});

const handleSubmitRegisterSchema = z.object({
  passageiros: z
    .array(z.string())
    .min(1, {
      message: fieldRequired("passageiro"),
    }),
  idExcursao: z
    .string()
    .min(1, {
      message: fieldRequired('Excursão')
    }),
  codigoFormaPagamento: z
    .string()
    .min(1, {
      message: fieldRequired('Forma Pagamento')
    }),
  codigoContaBancaria: z
    .string()
    .optional(),
  desconto: z
    .number()
    .optional(),
  criancasColo: z
    .number()
    .optional(),
  quantidade: z
    .number()
    .optional(),
  subtotal: z
    .number()
    .optional(),
  total: z
    .number()
    .optional(),
  valorDesconto: z
    .number()
    .optional(),
  localEmbarqueId: z
    .string()
    .min(1, {
      message: fieldRequired('Local de embarque')
    }),
  valorOpcionais: z
    .number()
    .optional(),
  opcionais: z
    .array(opcionalSchema)
    .optional(),
  passengerLink: z
    .string()
    .optional()
})

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalRegisterReserva {
  handleClose: () => void;
}

const ModalRegisterReservas = ({
  handleClose,
}: IModalRegisterReserva) => {
  const { user } = useGlobal();
  const { pessoaPromiseOptions } = usePessoas();
  const { createReserva } = useReservas()
  const { getExcursoes, findExcursao } = useExcursoes()
  const { getAllFormaPagamentos } = useFormaPagamento()
  const { getAllContaBancaria } = useContaBancaria()
  const { getLocalEmbarque } = useLocalEmbarque()

  const { data: dataExcursoes, isLoading: loadingExcursoes } = getExcursoes({ page: 1, size: 100 });
  const { data: dataFormaPagamentos, isLoading: loadingFormaPagamentos } = getAllFormaPagamentos();
  const { data: dataContaBancaria, isLoading: isLoadingContaBancaria } = getAllContaBancaria();
  const { mutate: mutateToGetExcursao, isLoading: isLoadingExcursao } = findExcursao();
  const { data: localEmbarqueData, isLoading: isLoadingLocalEmbarque } = getLocalEmbarque()
  const [produtoData, setProdutoData] = useState<Array<{ id: string, nome: string, valor: number }>>()
  const [subTotal, setSubtotal] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [total, setTotal] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorOpcionais, setValorOpcionais] = useState(0);
  const [showPassageiroLink, setShowPassageiroLink] = useState(false)
  const [isPassageiroLinkRequired, setPassageiroLinkRequired] = useState(false)
  const [opcoesPassageiroLink, setOpcoesPassageiroLink] = useState<ISelect[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const {
    setValue,
    getValues,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
  });
  const { mutate, isLoading } = createReserva(reset, handleClose);

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {

    if (showPassageiroLink && !getValues('passengerLink')) {
      setIsPopupOpen(true)
      return
    }

    mutate({
      ...submitData,
      codigoUsuario: user?.id
    })
  };

  const cpfMasked = (event: FormEvent<HTMLInputElement>) => {

    event.currentTarget.value = cpfMask(
      event.currentTarget.value,
    );

    /*
        if (cellphoneValidation(event.currentTarget.value)) {
          setErrorPhone(false);
        } else {
          setErrorPhone(true);
        }
          */
  }

  const onSelectExcursao = async (excursao: string) => {
    if (excursao) {
      mutateToGetExcursao(excursao, {
        onSuccess: (data: IExcursao) => {
          setProdutoData(data.Pacotes.Produto)
          setSubtotal(data.valor)
          calculateTotal(quantidade, data.valor, desconto)
          calculateDesconto(getValues("desconto") || 0)
        }
      });
    }
  };

  const onSelectPassageiros = async (option: Array<{ label: string, value: string }>) => {
    const qtd = option.length ? option.length : 0
    setQuantidade(qtd)
    setValue('quantidade', qtd)
    calculateTotal(qtd, subTotal, desconto)
    calculateDesconto(desconto)
  }

  const calculateTotal = async (qtd: number, valorPacote: number, discount: number, totalOpcionais?: number) => {
    let result = (((qtd || 1) * valorPacote) + (totalOpcionais || 0)) - (discount)
    setTotal(result)
    setValue('total', result)
  }

  const calculateDesconto = async (desconto: number) => {
    let valorDesconto = desconto
    setValorDesconto(valorDesconto)
    setValue('valorDesconto', valorDesconto)
  }

  const handleOpcionaisTotalChange = (totalOpcionais: number) => {
    setValorOpcionais(totalOpcionais);
    setValue('valorOpcionais', totalOpcionais);
    calculateTotal(quantidade, subTotal, desconto, totalOpcionais)
  };

  const handleQuantitiesChange = (quantities: { id: string; quantidade: number; valor: number, nome: string }[]) => {
    setValue('opcionais', quantities);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitRegister)}
        style={{ width: "100%" }}
      >
        <Box display="flex" flexDirection="column" gap="25px" padding="30px">
          <span>
            (<Asterisk />) indica os campos obrigatórios
          </span>


          <SelectForm
            name="idExcursao"
            label="Excursão"
            minW="200px"
            isRequired
            isLoading={loadingExcursoes}
            handleChange={(option) => {
              setValue("idExcursao", option?.value);
              onSelectExcursao(option?.value || '')
              calculateTotal(quantidade, subTotal, desconto)
              calculateDesconto(getValues("desconto") || 0)
            }}
            options={dataExcursoes
              ?.map((codigoExcursao) => ({
                label: `${formattingDate(codigoExcursao.dataInicio)} à ${formattingDate(codigoExcursao.dataFim)} - ${codigoExcursao?.nome}`,
                value: codigoExcursao?.id,
              }))}
            errors={errors.idExcursao}
          />

          <SelectAsyncPaginate
            name="passageiros"
            placeholder="Selecione"
            label="Passageiros"
            minW="200px"
            isRequired
            isMulti
            isSearchable
            promiseOptions={pessoaPromiseOptions}
            handleChange={(option) => {
              setValue("passageiros", option?.map((item: IOption) => item?.value.toString()) || []);
              onSelectPassageiros(option)
              setOpcoesPassageiroLink(option)
            }}
            errors={errors.passageiros}
          />

          <Flex
            gap="15px"
            flexDirection={{
              base: "column",
              lg: "row",
            }}
          >

            <SelectForm
              name="codigoFormaPagamento"
              label="Forma de Pagamento"
              minW="135px"
              isRequired
              isSearchable
              isLoading={loadingFormaPagamentos}
              handleChange={(option) => {
                setValue("codigoFormaPagamento", option?.value);

                if (option?.creditCard) {
                  setPassageiroLinkRequired(true)
                  setShowPassageiroLink(true)
                  return
                }

                setPassageiroLinkRequired(false)
                setShowPassageiroLink(false)

              }}
              options={dataFormaPagamentos
                ?.map((codigoFormaPagamento) => ({
                  label: codigoFormaPagamento?.nome,
                  value: codigoFormaPagamento?.id,
                  creditCard: codigoFormaPagamento?.creditCard
                }))}
              errors={errors.codigoFormaPagamento}
            />

            <SelectForm
              name="codigoContaBancaria"
              label="Conta Bancária"
              minW="135px"
              isSearchable
              isLoading={isLoadingContaBancaria}
              handleChange={(option) => {
                setValue("codigoContaBancaria", option?.value);
              }}
              options={dataContaBancaria
                ?.map((codigoContaBancaria) => ({
                  label: codigoContaBancaria?.nome,
                  value: codigoContaBancaria?.id,
                }))}
              errors={errors.codigoContaBancaria}
            />
          </Flex>

          <Flex
            gap="15px"
            flexDirection={{
              base: "column",
              lg: "row",
            }}
          >

            <FieldWrap>
              <span>Desconto (R$)</span>
              <Input
                height="40px"
                {...register("desconto", { valueAsNumber: true })}
                placeholder="Desconto (R$)"
                flex="1.01"
                type="number"
                prefix="percentual"
                onChange={(event) => {
                  let newValue = parseInt(event.target.value)

                  if ((Number(newValue) && !isNaN(Number(newValue)))) {
                    setValue('desconto', newValue);
                  } else {
                    setValue('desconto', 0);
                  }
                }}
                onBlur={() => {
                  setDesconto(getValues("desconto") || 0)
                  calculateDesconto(getValues("desconto") || 0)
                  calculateTotal(quantidade, subTotal, getValues("desconto") || 0)
                }}
                minW="250px"
                defaultValue={0}
              />
            </FieldWrap>

            <FormInputNumber
              height="40px"
              label="Crianças de colo"
              minWidth="100px"
              // maxWidth="50%"
              {...register("criancasColo", { valueAsNumber: true })}
              setValue={setValue}
              placeholder="Quantidade"
              flex="1.01"
              maxLength={25}
              dontAllowNegative={true}
              name="criancasColo"
              errors={errors.criancasColo}
              defaultValue={0}
            />
          </Flex>

          <FieldWrap>
            <span>Local De Embarque <Asterisk /></span>
            <ReactSelect
              {...register('localEmbarqueId')}
              name="localEmbarqueId"
              className="select-fields"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              isSearchable={true}
              placeholder="Selecionar"
              noOptionsMessage={() => "Nenhum local encontrado"}
              isLoading={isLoadingLocalEmbarque}
              required
              onChange={(item) => {
                setValue('localEmbarqueId', item?.value || '')
              }}
              options={localEmbarqueData.map((local) => {
                return { value: local.id, label: `${local.horaEmbarque} - ${local.nome}` }
              })}
            />

          </FieldWrap>

          {showPassageiroLink && (
            <Flex
              gap="15px"
              flexDirection={{
                base: "column",
                lg: "row",
              }}
            >
              <SelectForm
                name="passengerLink"
                label="Enviar Link de Pagamento Para:"
                isRequired={isPassageiroLinkRequired}
                handleChange={(option) => {
                  setValue("passengerLink", option?.value);
                }}
                options={opcoesPassageiroLink
                  ?.map((passageiro) => ({
                    label: passageiro?.label,
                    value: passageiro?.value
                  }))}
                errors={errors.passengerLink}
              />

            </Flex>
          )}

          {!isLoadingExcursao && produtoData && (
            <Opcionais
              produtoData={produtoData}
              onTotalChange={handleOpcionaisTotalChange}
              onQuantitiesChange={handleQuantitiesChange}
            />
          )}

          <Flex
            gap="15px"
            flexDirection={{
              base: "column",
              lg: "row",
            }}>

            <FormInputNumber
              height="40px"
              label="SubTotal"
              minWidth="100px"
              {...register("subtotal")}
              setValue={setValue}
              value={subTotal}
              isMoneyValue={true}
              flex="1.01"
              maxLength={25}
              dontAllowNegative={true}
              readOnly={true}
            />

            <FieldWrap>
              <span>Qtd</span>
              <Input
                height="40px"
                type="number"
                minWidth="50px"
                {...register("quantidade")}
                flex="1.01"
                value={quantidade}
                maxLength={25}
                readOnly={true}
                sx={{
                  border: 'none',
                  backgroundColor: '',
                  color: 'black'
                }}
              />
            </FieldWrap>

            <FieldWrap>
              <FormInputNumber
                height="40px"
                type="number"
                label="Desconto"
                minWidth="100px"
                {...register("valorDesconto")}
                setValue={setValue}
                flex="1.01"
                value={valorDesconto}
                readOnly={true}
                isMoneyValue={true}
                dontAllowNegative={true}
              />
            </FieldWrap>

            <FieldWrap>
              <FormInputNumber
                height="40px"
                type="number"
                label="Opcionais"
                minWidth="100px"
                {...register("valorOpcionais")}
                setValue={setValue}
                flex="1.01"
                value={valorOpcionais}
                readOnly={true}
                isMoneyValue={true}
                dontAllowNegative={true}
              />
            </FieldWrap>

            <FormInputNumber
              height="40px"
              label="Total"
              minWidth="100px"
              {...register("total")}
              setValue={setValue}
              isMoneyValue={true}
              flex="1.01"
              value={total}
              maxLength={25}
              dontAllowNegative={true}
              readOnly={true}
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
              Cadastrar
            </Button>
          </Flex>
        </Box>
      </form>
      <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Erro!</ModalHeader>
          <ModalBody>
            <p>Selecione um passageiro para enviar o link</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsPopupOpen(false)}>Fechar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalRegisterReservas;
