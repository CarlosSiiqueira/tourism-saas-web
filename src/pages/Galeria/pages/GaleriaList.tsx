import { Box, Button, Flex, Img, SimpleGrid, TableContainer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import FieldSearch from "../../../components/FieldSearch";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";

// Styled Components
import { Content, SectionTop } from "./styled";

// Hooks and utils
import SimpleModal from "../../../components/SimpleModal";
import { ISelect } from "../../../models/generics.model";
import ModalUploadImagem from "../components/ModalUploadImagem";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import AlertModal from "../../../components/AlertModal";
import useImagem from "../../../hooks/useImagem";
import ButtonIcon from "../../../components/ButtonIcon";
import { FiTrash } from "react-icons/fi";

const GaleriaList = () => {
    const { getImagem, deleteImagem } = useImagem();
    const [statusSelected, setStatusSelected] = useState<ISelect | null>();
    const [resetFilter, setResetFilter] = useState(false);
    const [modalUploadImagem, setModalUploadImagem] = useState(false);
    const [modalRemoveImagem, setModalRemoveImagem] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nome, setNome] = useState('')
    const [deleteItemId, setDeleteItemId] = useState('')
    const registerPerPage = 10;

    const { data, count, isLoading } = getImagem({
        size: registerPerPage,
        page: currentPage,
        nome
    });

    const { mutate: mutateToDeleteImagem } = deleteImagem()

    const onConfirmRemoveImagem = () => {
        mutateToDeleteImagem(deleteItemId || "");
        setModalRemoveImagem(false);
    };

    return (
        <>
            <Flex>
                <SectionTop className="contentTop" gap="30px">
                    <Flex gap="10px" flexWrap="wrap">
                        <Text fontSize="2xl" fontWeight="bold">
                            Galeria
                        </Text>
                    </Flex>
                </SectionTop>

                <SectionTop className="contentTop">
                    <Button
                        leftIcon={<IoIosAdd />}
                        onClick={() => {
                            setModalUploadImagem(true);
                        }}
                    >
                        Upload de Imagem
                    </Button>
                </SectionTop>
            </Flex>

            <Content className="contentMain">
                <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
                    <div className="searchWrap">
                        <span>Buscar Imagem</span>
                        <FieldSearch
                            placeholder="Nome"
                            handleSearch={(event) => {
                                setResetFilter(false);
                                setCurrentPage(1);
                                setNome(event)
                            }}
                            reset={resetFilter}
                        />
                    </div>
                    <Button
                        borderRadius="5px"
                        variant="outline"
                        onClick={() => {
                            setResetFilter(true);
                            setStatusSelected(null);
                        }}
                    >
                        Limpar Filtros
                    </Button>
                </Flex>

                {isLoading && (
                    <Flex h="100%" alignItems="center">
                        <Loading />
                    </Flex>
                )}

                {!isLoading && (
                    <>
                        {data.length > 0 && (
                            <>
                                <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>

                                    {data.map((item) => (
                                        <Box borderRadius="md" overflow="hidden" boxShadow="lg" key={item.id}>
                                            <Img height="300px" width="450px" src={item.url} objectFit="cover" />
                                            <Text textAlign="center" mt={2} fontSize="sm">{item.nome}</Text>
                                            <ButtonIcon tooltip="Excluir Imagem">
                                                <Button
                                                    variant="unstyled"
                                                    display="flex"
                                                    alignItems="center"
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        setDeleteItemId(item.id)
                                                        setModalRemoveImagem(true)
                                                    }}
                                                >
                                                    <FiTrash />
                                                </Button>
                                            </ButtonIcon>
                                        </Box>
                                    ))}

                                </SimpleGrid>
                                <Pagination
                                    registerPerPage={registerPerPage}
                                    totalRegisters={count}
                                    currentPage={currentPage}
                                    handleChangePage={(page) => setCurrentPage(page)}
                                />
                            </>
                        )
                        }

                        {
                            data.length === 0 && (
                                <AlertNoDataFound title="Nenhuma imagem encontrada" />
                            )
                        }
                    </>
                )}
            </Content >

            <SimpleModal
                title="Galeria"
                size="6xl"
                isOpen={modalUploadImagem}
                handleModal={setModalUploadImagem}
            >
                <ModalUploadImagem
                    handleClose={() => setModalUploadImagem(false)}
                />
            </SimpleModal>

            {modalRemoveImagem && (
                <AlertModal
                    title="Remover Imagem"
                    question="Deseja realmente remover essa imagem?"
                    request={onConfirmRemoveImagem}
                    showModal={modalRemoveImagem}
                    setShowModal={setModalRemoveImagem}
                    size="md"
                ></AlertModal>
            )
            }
        </>
    );
};

export default GaleriaList;
