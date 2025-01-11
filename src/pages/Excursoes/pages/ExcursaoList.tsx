import { Button, Flex, Input, TableContainer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosAdd, IoIosPeople, IoMdBus, IoMdPaper, IoMdTrash } from "react-icons/io";
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
import ModalRecordExcursao from "../components/ModalRegisterExcursao";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import useExcursoes from "../../../hooks/useExcursao";
import { MdEdit, MdPublish } from "react-icons/md";
import ModalUpdateExcursao from "../components/ModalUpdateExcursao";
import { IExcursao } from "../../../models/excursao.model";
import ButtonIcon from "../../../components/ButtonIcon";
import AlertModal from "../../../components/AlertModal";
import { IoBed, IoCheckmarkCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { dateFormat } from "../../../utils";
import { currencyBRLFormat } from "../../../utils/currencyBRLFormat";

const ExcursaoList = () => {
  const navigate = useNavigate();
  const { getExcursoes, deleteExcursao, publicarExcursao, concluirExcursao } = useExcursoes();

  const [statusSelected, setStatusSelected] = useState<ISelect | null>();
  const [resetFilter, setResetFilter] = useState(false);
  const [modalRecordExcursao, setModalRecordExcursao] = useState(false);
  const [modalUpdateExcursao, setModalUpdateExcursao] = useState(false);
  const [modalRemoveExcursao, setModalRemoveExcursao] = useState(false);
  const [modalPublishExcursao, setModalPublishExcursao] = useState(false);
  const [modalFinishExcursao, setModalFinishExcursao] = useState(false);
  const [nome, setNome] = useState('')
  const [excursaoData, setExcursaoData] = useState<IExcursao | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const registerPerPage = 10;

  const { data, count, isLoading } = getExcursoes({
    size: registerPerPage,
    page: currentPage,
    status: statusSelected?.value,
    nome,
    dataInicio,
    dataFim
  });

  const { mutate: mutateToDeleteExcursao, isLoading: isLoadingDelete } = deleteExcursao();
  const [deleteItemId, setDeleteExcursaoId] = useState('');

  const { mutate: mutateToPublishExcursao, isLoading: isLoadingPublish } = publicarExcursao();
  const [publishItemId, setPublishExcursaoId] = useState('');

  const { mutate: mutateToFinishExcursao, isLoading: isLoadingFinish } = concluirExcursao();
  const [finishItemId, setFinishExcursaoId] = useState('');

  const onConfirmRemoveExcursao = () => {
    mutateToDeleteExcursao(deleteItemId || "");
    setModalRemoveExcursao(false);
  };

  const onConfirmPublishExcursao = () => {
    mutateToPublishExcursao(publishItemId || "");
    setModalPublishExcursao(false);
  };

  const onConfirmFinishExcursao = () => {
    mutateToFinishExcursao(finishItemId || "");
    setModalFinishExcursao(false);
  };

  return (
    <>
      <Flex>
        <SectionTop className="contentTop" gap="30px">
          <Flex gap="10px" flexWrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              Excursões
            </Text>
          </Flex>
        </SectionTop>

        <SectionTop className="contentTop">
          <Button
            leftIcon={<IoIosAdd />}
            onClick={() => {
              setModalRecordExcursao(true);
            }}
          >
            Cadastrar excursão
          </Button>
        </SectionTop>
      </Flex>

      <Content className="contentMain">
        <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
          <div className="searchWrap">
            <span>Buscar excursão</span>
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

          <Flex flexDirection="column" gap="5px" width="160px">
            <span>Data Início</span>
            <Input
              type="date"
              placeholder="dd/mm/aaaa"
              max="2099-12-31"
              maxLength={10}
              value={dataInicio}
              onChange={(event) => {
                setDataInicio(event.target.value)
              }}
            />
          </Flex>

          <Flex flexDirection="column" gap="5px" width="160px">
            <span>Data Fim</span>
            <Input
              type="date"
              placeholder="dd/mm/aaaa"
              value={dataFim}
              max="2099-12-31"
              maxLength={10}
              onChange={(event) => {
                setDataFim(event.target.value)
              }}
            />
          </Flex>

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
                  label: "Todas",
                  value: 'all'
                },
                {
                  label: "Concluída",
                  value: 1,
                },
                {
                  label: "Em andamento",
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
              setDataInicio('')
              setDataFim('')
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
                      <TD>Excursão</TD>
                      <TD>Destino</TD>
                      <TD>Período</TD>
                      <TD>Valor</TD>
                      <TD>Status</TD>
                      <TD>Vagas</TD>
                      <TD>Publicada Loja</TD>
                      <TD></TD>
                    </THead>

                    <TBody>
                      {data.map((item) => (
                        <TR key={item.id}>
                          <TD>
                            {item.nome}
                          </TD>
                          <TD>
                            {item.Pacotes.nome}
                          </TD>
                          <TD>
                            {dateFormat(new Date(item.dataInicio))} à {dateFormat(new Date(item.dataFim))}
                          </TD>
                          <TD>
                            {currencyBRLFormat(item.valor)}
                          </TD>
                          <TD>
                            {item.ativo ? "Ativa" : "Inativa"} {item.destacado ? '/ Em Destaque' : ''}
                          </TD>
                          <TD>
                            {item.vagas}
                          </TD>
                          <TD>
                            {item.publicadoSite ? "Publicada" : "Aguardando Publicação"}
                          </TD>
                          <TD gap={3}>

                            {!item.publicadoSite && !isLoadingPublish && (
                              <ButtonIcon tooltip="Publicar">
                                <MdPublish
                                  size={20}
                                  cursor="pointer"
                                  onClick={() => {
                                    setPublishExcursaoId(item.id)
                                    setModalPublishExcursao(true)
                                  }}
                                />
                              </ButtonIcon>
                            )}

                            <ButtonIcon tooltip="Editar">
                              <MdEdit
                                size={20}
                                // color={customTheme.colors.brandSecond.first}
                                cursor="pointer"
                                onClick={() => {
                                  setExcursaoData(item)
                                  setModalUpdateExcursao(true)
                                }}
                              />
                            </ButtonIcon>

                            {!item.concluida && !isLoadingFinish && (
                              <ButtonIcon tooltip="Concluir Excursão">
                                <IoCheckmarkCircle
                                  size={20}
                                  onClick={() => {
                                    setFinishExcursaoId(item.id)
                                    setModalFinishExcursao(true)
                                  }}
                                />
                              </ButtonIcon>
                            )}

                            <ButtonIcon tooltip="Ônibus">
                              <IoMdBus
                                size={20}
                                onClick={() => navigate(`/excursoes/${item.id}/onibus`)}
                              />
                            </ButtonIcon>

                            <ButtonIcon tooltip="Embarque">
                              <IoMdPaper
                                size={20}
                                onClick={() => navigate(`/excursoes/${item.id}/embarque`)}
                              />
                            </ButtonIcon>

                            <ButtonIcon tooltip="Quartos">
                              <IoBed
                                size={20}
                                onClick={() => navigate(`/excursoes/${item.id}/quartos`)}
                              />
                            </ButtonIcon>

                            <ButtonIcon tooltip="Passageiros">
                              <IoIosPeople
                                size={20}
                                onClick={() => navigate(`/excursoes/${item.id}/passageiros`)}
                              />
                            </ButtonIcon>

                            {item.ativo && (
                              <ButtonIcon tooltip="Excluir Excursao">
                                <IoMdTrash
                                  size={20}
                                  onClick={() => {
                                    setModalRemoveExcursao(true)
                                    setDeleteExcursaoId(item.id)
                                  }
                                  }
                                />
                              </ButtonIcon>
                            )}
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
              <AlertNoDataFound title="Nenhuma excursão encontrado" />
            )}
          </>
        )}
      </Content >

      <SimpleModal
        title="Excursão"
        size="xl"
        isOpen={modalRecordExcursao}
        handleModal={setModalRecordExcursao}
      >
        <ModalRecordExcursao
          handleClose={() => setModalRecordExcursao(false)}
        />
      </SimpleModal>

      {
        excursaoData && (
          <SimpleModal
            title="Excursão"
            size="xl"
            isOpen={modalUpdateExcursao}
            handleModal={setModalUpdateExcursao}
          >
            <ModalUpdateExcursao
              handleClose={() => setModalUpdateExcursao(false)}
              data={excursaoData}
            />
          </SimpleModal>
        )
      }

      {
        !isLoadingDelete && (
          <>
            {modalRemoveExcursao && (
              <AlertModal
                title="Remover Excursão"
                question="Deseja realmente remover esta excursão?"
                request={onConfirmRemoveExcursao}
                showModal={modalRemoveExcursao}
                setShowModal={setModalRemoveExcursao}
                size="md"
              ></AlertModal>
            )}
          </>
        )
      }

      {!isLoadingPublish && (
        <>
          {modalPublishExcursao && (
            <AlertModal
              title="Publicar Excursão"
              question="Deseja realmente publicar esta excursão?"
              request={onConfirmPublishExcursao}
              showModal={modalPublishExcursao}
              setShowModal={setModalPublishExcursao}
              size="md"
            ></AlertModal>
          )}
        </>
      )}

      {!isLoadingFinish && (
        <>
          {modalFinishExcursao && (
            <AlertModal
              title="Concluir Excursão"
              question="Deseja realmente concluir esta excursão?"
              request={onConfirmFinishExcursao}
              showModal={modalFinishExcursao}
              setShowModal={setModalFinishExcursao}
              size="md"
            ></AlertModal>
          )}
        </>
      )}
    </>
  );
};

export default ExcursaoList;
