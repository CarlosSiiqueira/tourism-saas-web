import { Button, Flex, TableContainer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import FieldSearch from "../../../components/FieldSearch";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import { TBody, TD, THead, TR, Table } from "../../../components/Table";

// Styled Components
import { Content, SectionTop } from "./styled";

// Hooks and utils
import ReactSelect from "react-select";
import SimpleModal from "../../../components/SimpleModal";
import { ISelect } from "../../../models/generics.model";
import ModalRegisterFormaPagamento from "../components/ModalRegisterFormaPagamento";
import ModalUpdateFormaPagamento from "../components/ModalUpdateFormaPagamento";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import { MdEdit } from "react-icons/md";
import ButtonIcon from "../../../components/ButtonIcon";
import { FiTrash } from "react-icons/fi";
import AlertModal from "../../../components/AlertModal";
import useFormaPagamento from "../../../hooks/useFormaPagamento";
import { IFormaPagamento } from "../../../models/forma-pagamento.model";

const FormaPagamentoList = () => {
    const { getFormaPagamento, deleteFormaPagamento } = useFormaPagamento();
    const [statusSelected, setStatusSelected] = useState<ISelect | null>();
    const [resetFilter, setResetFilter] = useState(false);
    const [modalRegisterFormaPagamento, setModalRegisterFormaPagamento] = useState(false);
    const [modalUpdateFormaPagamento, setModalUpdateFormaPagamento] = useState(false);
    const [modalRemoveFormaPagamento, setModalRemoveFormaPagamento] = useState(false);
    const [formaPagamentoData, setFormaPagamentoData] = useState<IFormaPagamento | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [nome, setNome] = useState('')
    const registerPerPage = 10;

    const { mutate: mutateToDeleteFormaPagamento } = deleteFormaPagamento();
    const [deleteItemId, setDeleteFormaPagamentoId] = useState('');

    const { data, count, isLoading } = getFormaPagamento({
        size: registerPerPage,
        page: currentPage,
        nome,
        status: statusSelected?.value
    });

    const onConfirmRemoveFormaPagamento = () => {
        mutateToDeleteFormaPagamento(deleteItemId || "");
        setModalRemoveFormaPagamento(false);
    };

    return (
        <>
            <Flex>
                <SectionTop className="contentTop" gap="30px">
                    <Flex gap="10px" flexWrap="wrap">
                        <Text fontSize="2xl" fontWeight="bold">
                            Formas de Pagamento
                        </Text>
                    </Flex>
                </SectionTop>

                <SectionTop className="contentTop">
                    <Button
                        leftIcon={<IoIosAdd />}
                        onClick={() => {
                            setModalRegisterFormaPagamento(true);
                        }}
                    >
                        Cadastrar Forma Pagamento
                    </Button>
                </SectionTop>
            </Flex>

            <Content className="contentMain">
                <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
                    <div className="searchWrap">
                        <span>Buscar Forma Pagamento</span>
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
                    <Flex flexDirection="column" gap="5px" width="300px">
                        <span>Status</span>

                        <ReactSelect
                            className="select-fields"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                            isSearchable={true}
                            value={statusSelected}
                            placeholder="Selecionar"
                            noOptionsMessage={() => "Nenhum Status encontrado"}
                            onChange={(item) => {
                                setStatusSelected(item);
                            }}
                            options={[
                                {
                                    label: 'Todos',
                                    value: 'all'
                                },
                                {
                                    label: "Ativo",
                                    value: 1,
                                },
                                {
                                    label: "Inativo",
                                    value: 0,
                                },
                            ]}
                        />
                    </Flex>
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
                                <TableContainer marginBottom="10px">
                                    <Table>
                                        <THead padding="0 30px 0 30px">
                                            <TD>Nome</TD>
                                            <TD>Status</TD>
                                            <TD>Taxa</TD>
                                            <TD>Dias para recebimento</TD>
                                            <TD>Cartão de Crédito</TD>
                                            <TD></TD>
                                        </THead>

                                        <TBody>
                                            {data.map((item) => (
                                                <TR key={item.id}>
                                                    <TD>
                                                        {item.nome}
                                                    </TD>
                                                    <TD>
                                                        {item.ativo ? 'Ativo' : 'Inativo'}
                                                    </TD>
                                                    <TD>
                                                        {item.taxa}%
                                                    </TD>
                                                    <TD>
                                                        {item.qtdDiasRecebimento} Dia(s)
                                                    </TD>
                                                    <TD>
                                                        {item.creditCard ? 'Sim' : 'Não'}
                                                    </TD>
                                                    <TD gap={3}>
                                                        <MdEdit
                                                            size={20}
                                                            // color={customTheme.colors.brandSecond.first}
                                                            cursor="pointer"
                                                            onClick={() => {
                                                                setFormaPagamentoData(item)
                                                                setModalUpdateFormaPagamento(true)
                                                            }}
                                                        />

                                                        <ButtonIcon tooltip="Excluir Forma Pagamento">
                                                            <Button
                                                                variant="unstyled"
                                                                display="flex"
                                                                alignItems="center"
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    setModalRemoveFormaPagamento(true)
                                                                    setDeleteFormaPagamentoId(item.id)
                                                                }}
                                                            >
                                                                <FiTrash />
                                                            </Button>
                                                        </ButtonIcon>
                                                    </TD>
                                                </TR>
                                            ))}
                                        </TBody>
                                    </Table>
                                </TableContainer>

                                <Pagination
                                    registerPerPage={registerPerPage}
                                    totalRegisters={count}
                                    currentPage={currentPage}
                                    handleChangePage={(page) => setCurrentPage(page)}
                                />
                            </>
                        )}

                        {data.length === 0 && (
                            <AlertNoDataFound title="Nenhuma conta encontrada" />
                        )}
                    </>
                )}
            </Content>

            <SimpleModal
                title="Forma Pagamento"
                size="xl"
                isOpen={modalRegisterFormaPagamento}
                handleModal={setModalRegisterFormaPagamento}
            >
                <ModalRegisterFormaPagamento
                    handleClose={() => setModalRegisterFormaPagamento(false)}
                />
            </SimpleModal>

            {formaPagamentoData && (
                <SimpleModal
                    title="Forma Pagamento"
                    size="xl"
                    isOpen={modalUpdateFormaPagamento}
                    handleModal={setModalUpdateFormaPagamento}
                >
                    <ModalUpdateFormaPagamento
                        handleClose={() => setModalUpdateFormaPagamento(false)}
                        data={formaPagamentoData}
                    />
                </SimpleModal>
            )}

            {modalRemoveFormaPagamento && (
                <AlertModal
                    title="Remover Forma Pagamento"
                    question="Deseja realmente remover essa forma pagamento?"
                    request={onConfirmRemoveFormaPagamento}
                    showModal={modalRemoveFormaPagamento}
                    setShowModal={setModalRemoveFormaPagamento}
                    size="md"
                ></AlertModal>
            )}
        </>
    );
};

export default FormaPagamentoList;
