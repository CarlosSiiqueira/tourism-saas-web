import { Box, Button, Flex, Grid, TableContainer, Text } from "@chakra-ui/react";
import Loading from "../../../components/Loading";

// Styled Components
import { Content, SectionTop } from "./styled";

// Hooks and utils
import useConfiguracao from "../../../hooks/useConfiguracao";
import useUsuario from "../../../hooks/useUsuarios";
import SelectForm from "../../../components/SelectForm";
import useCategoriaTransacao from "../../../hooks/useCategoriaTransacao";
import { IConfiguracao } from "../../../models/configuracao.model";
import { useGlobal } from "../../../contexts/UserContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fieldRequired } from "../../../utils/messagesError";
import { zodResolver } from "@hookform/resolvers/zod";
import useImagem from "../../../hooks/useImagem";
import SelectImageOption from "../../../components/SelectImageOption";
import useFormaPagamento from "../../../hooks/useFormaPagamento";

const handleSubmitRegisterSchema = z.object({
  defaultUser: z
    .string()
    .min(1, {
      message: fieldRequired("Usuário"),
    }),
  defaultCategory: z
    .string()
    .min(1, {
      message: fieldRequired("Categoria")
    }),
  defaultFormaPagamento: z
    .string()
    .min(1, {
      message: fieldRequired("Forma de Pagamento")
    }),
  defaultSlideImages: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .min(1, {
      message: fieldRequired('Imagens Slide')
    })

});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

const ConfiguracaoList = () => {
  const { getAllConfiguracao, createConfiguracao, updateConfiguracao } = useConfiguracao();
  const { getAllUsuario } = useUsuario()
  const { getAllCategoriaTransacao } = useCategoriaTransacao()
  const { getAllImagem } = useImagem()
  const { getAllFormaPagamentos } = useFormaPagamento()
  const { user } = useGlobal();
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema)
  });

  const { data, count, isLoading } = getAllConfiguracao();
  const { data: dataUsuario, isLoading: isLoadingUsuario } = getAllUsuario()
  const { data: dataCategoria, isLoading: isLoadingCategoria } = getAllCategoriaTransacao()
  const { mutate: mutateToCreateConfig, isLoading: isLoadingCreate } = createConfiguracao()
  const { mutate: mutateToUpdateConfig, isLoading: isLoadingUpdate } = updateConfiguracao()
  const { data: dataImage, isLoading: isLoadingImage } = getAllImagem();
  const { data: dataFormaPagamentos, isLoading: loadingFormaPagamentos } = getAllFormaPagamentos();


  let configUser: IConfiguracao | undefined
  let configCategory: IConfiguracao | undefined
  let configSlideImages: IConfiguracao | undefined
  let configFormaPagamento: IConfiguracao | undefined

  if (data.length) {
    configUser = data.find((config => config.tipo == 'default-user'))
    configCategory = data.find((config => config.tipo == 'default-category'))
    configSlideImages = data.find((config => config.tipo == 'default-slide-images'))
    configFormaPagamento = data.find((config => config.tipo == 'default-forma-pagamento'))
  }

  let defaultImages = configSlideImages?.configuracao ? JSON.parse(configSlideImages.configuracao) : []
  let defaultCategory = configCategory?.configuracao ? JSON.parse(configCategory.configuracao) : {}
  let defaultUser = configUser?.configuracao ? JSON.parse(configUser.configuracao) : {}
  let defaultFormaPagamento = configFormaPagamento?.configuracao ? JSON.parse(configFormaPagamento.configuracao) : {}

  const setConfigUser = async (usuario: { id: string, nome: string }) => {

    if (configUser) {
      mutateToUpdateConfig({
        id: configUser.id,
        tipo: 'default-user',
        configuracao: JSON.stringify(usuario),
        idUsuario: user?.id
      })

      return
    }

    mutateToCreateConfig({
      tipo: 'default-user',
      configuracao: JSON.stringify(usuario),
      idUsuario: user?.id
    })

  }

  const setConfigCategory = async (usuario: { id: string, nome: string }) => {

    if (configCategory) {
      mutateToUpdateConfig({
        id: configCategory.id,
        tipo: 'default-category',
        configuracao: JSON.stringify(usuario),
        idUsuario: user?.id
      })

      return
    }
    mutateToCreateConfig({
      tipo: 'default-category',
      configuracao: JSON.stringify(usuario),
      idUsuario: user?.id
    })
  }

  const setConfigSlide = async (images: Array<{ id: string, label: string }>) => {

    if (configSlideImages) {
      mutateToUpdateConfig({
        id: configSlideImages.id,
        tipo: 'default-slide-images',
        configuracao: JSON.stringify(images),
        idUsuario: user?.id
      })

      return
    }
    mutateToCreateConfig({
      tipo: 'default-slide-images',
      configuracao: JSON.stringify(images),
      idUsuario: user?.id
    })
  }

  const setConfigFormaPagamento = async (usuario: { id: string, nome: string }) => {

    if (configFormaPagamento) {
      mutateToUpdateConfig({
        id: configFormaPagamento.id,
        tipo: 'default-forma-pagamento',
        configuracao: JSON.stringify(usuario),
        idUsuario: user?.id
      })

      return
    }
    mutateToCreateConfig({
      tipo: 'default-forma-pagamento',
      configuracao: JSON.stringify(usuario),
      idUsuario: user?.id
    })
  }

  return (
    <>
      <Flex>
        <SectionTop className="contentTop" gap="30px">
          <Flex gap="10px" flexWrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              Configurações
            </Text>
          </Flex>
        </SectionTop>
        <SectionTop className="contentTop">
        </SectionTop>
      </Flex>

      <Content className="contentMain">
        {isLoading && (
          <Flex h="100%" alignItems="center">
            <Loading />
          </Flex>
        )}
        {!isLoading && (
          <>
            <Box as='span' flex='1' textAlign='left'>
              <SelectForm
                name="defaultUser"
                label="Usuário Padrão"
                maxW='100px'
                isRequired
                isLoading={isLoadingUsuario}
                handleChange={(option) => {
                  setValue("defaultUser", option?.value);
                  setConfigUser({ id: option?.value, nome: option?.label })
                }}
                options={dataUsuario.map((user) => {
                  return { value: user.id, label: user.nome }
                })}
                defaultValue={{
                  value: defaultUser?.id,
                  label: defaultUser?.nome
                }}
              />

              <br />

              <SelectForm
                name="defaultCategory"
                label="Categoria Padrão"
                maxW='100px'
                isRequired
                isLoading={isLoadingCategoria}
                handleChange={(option) => {
                  setValue("defaultCategory", option?.value);
                  setConfigCategory({ id: option?.value, nome: option?.label })
                }}
                options={dataCategoria.map((categoria) => {
                  return { value: categoria.id, label: `${categoria.nome}/${categoria.SubCategoria.nome}` }
                })}
                defaultValue={{
                  value: defaultCategory?.id,
                  label: defaultCategory?.nome
                }}
              />

              <br />

              <SelectForm
                name="defaultFormaPagamento"
                label="Forma Pagamento Padrão"
                maxW='100px'
                isRequired
                isLoading={loadingFormaPagamentos}
                handleChange={(option) => {
                  setValue("defaultFormaPagamento", option?.value);
                  setConfigFormaPagamento({ id: option?.value, nome: option?.label })
                }}
                options={dataFormaPagamentos.map((pagamento) => {
                  return { value: pagamento.id, label: `${pagamento.nome}` }
                })}
                defaultValue={{
                  value: defaultFormaPagamento?.id,
                  label: defaultFormaPagamento?.nome
                }}
              />

              <br />


              <Flex
                display="flex"
                gap="10px"
              >
                <SelectForm
                  name="defaultSlideImages"
                  label="Galeria do Slide(site)"
                  minW="135px"
                  maxW="250px"
                  isSearchable
                  isLoading={isLoadingImage}
                  isMulti
                  handleChange={(option) => {
                    setValue("defaultSlideImages",
                      option.map((opt: { value: string, label: string, imageUrl: string }) => {
                        return { id: opt.value, label: opt.label }
                      }));
                  }}
                  options={dataImage
                    ?.map((foto) => ({
                      label: foto?.nome,
                      value: foto?.id,
                      imageUrl: `${foto.url}`
                    }))}
                  CustomOption={SelectImageOption}
                  errors={errors.defaultSlideImages}
                  defaultValue={
                    defaultImages.map((img: { id: string, label: string }) => {
                      return {
                        value: img.id,
                        label: img.label
                      }
                    })
                  }
                />

                <Button
                  onClick={() => {

                    let images = getValues('defaultSlideImages')

                    if (images.length) {
                      setConfigSlide(images)
                    }

                  }}
                  style={{ marginTop: '50px' }}
                >
                  Salvar imagens
                </Button>

              </Flex>

            </Box>
          </>
        )}
      </Content >
    </>
  );
};

export default ConfiguracaoList;
