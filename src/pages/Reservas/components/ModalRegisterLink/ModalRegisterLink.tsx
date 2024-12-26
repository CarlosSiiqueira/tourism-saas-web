import { Box, Button, Flex, FormControl, FormErrorMessage, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useTransacao from "../../../../hooks/useTransacao";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import FormInputNumber from "../../../../components/FormInputNumber";
import SelectForm from "../../../../components/SelectForm";
import useExcursoes from "../../../../hooks/useExcursao";
import { useState } from "react";
import ReactSelect from "react-select";
import { IExcursao } from "../../../../models/excursao.model";
import { formattingDate } from "../../../../utils/formattingDate";
import Opcionais from "../Opcionais";
import SelectAsyncPaginate from "../../../../components/SelectAsyncPaginate";
import usePessoas from "../../../../hooks/usePessoas";

const opcionalSchema = z.object({
  id: z.string(),
  quantidade: z.number().min(0),
  valor: z.number().min(0),
  nome: z.string()
});

const handleSubmitRegisterSchema = z.object({
  cliente: z
    .string()
    .min(1, {
      message: fieldRequired("passageiro"),
    }),
  idExcursao: z
    .string()
    .min(1, {
      message: fieldRequired('Excursão')
    }),
  desconto: z
    .number()
    .optional(),
  quantidade: z
    .number()
    .min(1, {
      message: fieldRequired("Quantidade")
    }),
  subtotal: z
    .number()
    .optional(),
  total: z
    .number()
    .optional(),
  valorDesconto: z
    .number()
    .optional(),
  valorOpcionais: z
    .number()
    .optional(),
  opcionais: z
    .array(opcionalSchema)
    .optional(),
  paymentMethods: z
    .array(z.string())
    .min(1, {
      message: fieldRequired('Formas de Pagamento')
    }),
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalRegisterReserva {
  handleClose: () => void;
}

const ModalRegisterLink = ({
  handleClose,
}: IModalRegisterReserva) => {
  const { pessoaPromiseOptions } = usePessoas();
  const { getExcursoes, findExcursao } = useExcursoes()
  const { createLink } = useTransacao()

  const { data: dataExcursoes, isLoading: loadingExcursoes } = getExcursoes({ page: 1, size: 100 });
  const { mutate: mutateToGetExcursao, isLoading: isLoadingExcursao } = findExcursao();
  const [produtoData, setProdutoData] = useState<Array<{ id: string, nome: string, valor: number }>>()
  const [subTotal, setSubtotal] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [total, setTotal] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorOpcionais, setValorOpcionais] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupData, setPopupData] = useState<{ url: string }>()

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
  });
  const { mutate, isLoading } = createLink(
    () => {
      setIsPopupOpen(true);
    }, (response) => {
      setPopupData(response)
      setIsPopupOpen(true)
    });

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData
    })
  };

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

  const onChangeQtd = async (qtd: number) => {
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

  const copyLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): boolean => {
    event.preventDefault()

    let url = event.currentTarget.href

    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Link Copiado!");
        return false
      })
      .catch((err) => {
        console.error("Falha ao copiar link: ", err);
        return false
      });

    return false
  }

  const formasPagamento = [
    {
      id: 'credit_card',
      nome: 'Cartão de Crédito'
    },
    {
      id: 'pix',
      nome: 'PIX'
    },
  ]

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
            name="cliente"
            placeholder="Selecione"
            label="Cliente"
            minW="200px"
            isRequired
            isSearchable
            promiseOptions={pessoaPromiseOptions}
            handleChange={(option) => {
              setValue("cliente", option?.value.toString());
            }}
            errors={errors.cliente}
          />

          <FieldWrap>
            <span>Formas de Pagamento <Asterisk /></span>
            <ReactSelect
              {...register('paymentMethods')}
              name="paymentMethods"
              className="select-fields"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              isSearchable={true}
              isMulti
              placeholder="Selecionar"
              noOptionsMessage={() => "Nenhum local encontrado"}
              required
              onChange={(item) => {
                setValue('paymentMethods', item?.map((payment) => { return payment.value }))
              }}
              options={formasPagamento.map((payment) => {
                return { value: payment.id, label: `${payment.nome}` }
              })}
            />

          </FieldWrap>

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

            <FormControl
              isInvalid={errors.quantidade?.message ? true : false}
            >
              <FieldWrap>
                <span>Quantidade <Asterisk /></span>
                <Input
                  height="40px"
                  minW="250px"
                  // maxWidth="50%"
                  {...register("quantidade", { valueAsNumber: true })}
                  placeholder="Quantidade"
                  onChange={(event) => {
                    let newValue = parseInt(event.target.value)

                    if ((Number(newValue) && !isNaN(Number(newValue)))) {
                      setValue('quantidade', newValue);
                    } else {
                      setValue('quantidade', 0);
                    }
                  }}
                  onBlur={(event) => {
                    setQuantidade(parseInt(event.currentTarget.value))
                    onChangeQtd(parseInt(event.currentTarget.value))
                    calculateTotal(parseInt(event.currentTarget.value), subTotal, getValues("desconto") || 0)
                  }}
                  flex="1.01"
                  maxLength={25}
                  name="quantidade"
                  defaultValue={1}
                />
                <FormErrorMessage>{errors.quantidade?.message}</FormErrorMessage>
              </FieldWrap>
            </FormControl>
          </Flex>


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
              Gerar
            </Button>
          </Flex>
        </Box>
      </form>
      <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Link</ModalHeader>
          <ModalBody>
            {popupData ? (
              <a href={popupData.url} onClick={(event) => { copyLink(event) }}>Clique aqui para copiar</a>
            ) : (
              <p>Loading...</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsPopupOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalRegisterLink;
