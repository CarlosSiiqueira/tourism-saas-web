/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import usePacotes from "../../../../hooks/usePacotes";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import ReactSelect from "react-select";
import { useGlobal } from "../../../../contexts/UserContext";
import FormInput from "../../../../components/FormInput";
import useProduct from "../../../../hooks/useProducts";
import SelectForm from "../../../../components/SelectForm";
import SelectImageOption from "../../../../components/SelectImageOption";
import useImagem from "../../../../hooks/useImagem";
import RichText from "../../../../components/RichText";

const handleSubmitRegisterSchema = z.object({
  nome: z
    .string()
    .min(1, {
      message: fieldRequired("nome"),
    }),
  descricao: z
    .string()
    .min(1, {
      message: fieldRequired("Descrição")
    }),
  urlImagem: z
    .string()
    .optional(),
  urlImgEsgotado: z
    .string()
    .optional(),
  origem: z
    .number()
    .min(1, {
      message: fieldRequired("origem"),
    }),
  tipoTransporte: z
    .number()
    .min(1, {
      message: fieldRequired("tipo de transporte"),
    }),
  opcionais: z
    .array(z.string())
    .optional(),
  galeria: z
    .array(z.string())
    .optional()
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalRecordCollaborator {
  handleClose: () => void;
}

const ModalRegisterPacote = ({
  handleClose,
}: IModalRecordCollaborator) => {
  const { user } = useGlobal();
  const { createPacotes } = usePacotes();
  const { getAllProducts } = useProduct()
  const { getAllImagem } = useImagem()

  const { data: dataProduto, isLoading: isLoadingProduto } = getAllProducts()
  const { data: dataImage, isLoading: isLoadingImage } = getAllImagem();

  const {
    setValue,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
  });
  const { mutate, isLoading } = createPacotes(reset, handleClose);

  const dataOrigens = [
    {
      id: 1,
      nome: "Fortaleza, Ceará"
    },
    {
      id: 2,
      nome: "Tianguá, Ceará"
    }
  ]

  const dataTipoTransporte = [
    {
      id: 1,
      nome: "Terrestre"
    },
    {
      id: 2,
      nome: "Aéreo"
    }
  ]

  const handleSubmitRegister = (data: IhandleSubmitRegister) => {
    mutate({
      ...data,
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
          <span>Descrição <Asterisk /></span>

          <RichText
            setValue={setValue}
            name="descricao"
          />
        </FieldWrap>

        <SelectForm
          name="urlImagem"
          label="Foto"
          minW="135px"
          isSearchable
          isLoading={isLoadingImage}
          handleChange={(option) => {
            setValue("urlImagem", option?.value);
          }}
          options={dataImage
            ?.map((foto) => ({
              label: foto?.nome,
              value: foto?.id,
              imageUrl: `${foto.url}`
            }))}
          CustomOption={SelectImageOption}
          errors={errors.urlImagem}
        />

        <SelectForm
          name="urlImgEsgotado"
          label="Foto Esgotado"
          minW="135px"
          isSearchable
          isLoading={isLoadingImage}
          handleChange={(option) => {
            setValue("urlImgEsgotado", option?.value);
          }}
          options={dataImage
            ?.map((foto) => ({
              label: foto?.nome,
              value: foto?.id,
              imageUrl: `${foto.url}`
            }))}
          CustomOption={SelectImageOption}
          errors={errors.urlImgEsgotado}
        />

        <SelectForm
          name="galeria"
          label="Galeria do Destino"
          minW="135px"
          isSearchable
          isLoading={isLoadingImage}
          isMulti
          handleChange={(option) => {
            setValue("galeria", option.map((opt: { value: string, label: string, imageUrl: string }) => opt.value));
          }}
          options={dataImage
            ?.map((foto) => ({
              label: foto?.nome,
              value: foto?.id,
              imageUrl: `${foto.url}`
            }))}
          CustomOption={SelectImageOption}
          errors={errors.galeria}
        />

        <FieldWrap>
          <span>Origem</span>

          <Box display="flex" gap="10px">
            <ReactSelect
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("origem")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há origem cadastrado"}
              options={dataOrigens
                ?.map((origem) => ({
                  label: origem?.nome,
                  value: origem?.id,
                }))}
              name="origem"
              id="origem"
              onChange={(option) => {
                setValue("origem", option?.value || 1);
              }}
            />
          </Box>
        </FieldWrap>

        <FieldWrap>
          <span>Tipo de Transporte</span>

          <Box display="flex" gap="10px">
            <ReactSelect
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("tipoTransporte")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há tipo de transporte cadastrado"}
              options={dataTipoTransporte
                ?.map((tipoTransporte) => ({
                  label: tipoTransporte?.nome,
                  value: tipoTransporte?.id,
                }))}
              name="tipoTransporte"
              id="tipoTransporte"
              onChange={(option) => {
                setValue("tipoTransporte", option?.value || 1);
              }}
            />
          </Box>
        </FieldWrap>

        <FieldWrap>
          <span>Opcionais</span>

          <Box display="flex" gap="10px">
            <ReactSelect
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("opcionais")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há opcional cadastrado"}
              isLoading={isLoadingProduto}
              isMulti
              onChange={(option) => {
                setValue("opcionais", option.map((opt) => opt.value));
              }}
              options={dataProduto
                ?.map((produto) => ({
                  label: `${produto?.nome}`,
                  value: produto?.id,
                }))}
            />
          </Box>
        </FieldWrap>

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
  );
};

export default ModalRegisterPacote;
