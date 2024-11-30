/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Icon, Img, Input, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useImagem from "../../../../hooks/useImagem";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import { useGlobal } from "../../../../contexts/UserContext";
import { ChangeEvent, useState } from "react";
import { FaDownload } from "react-icons/fa";

const handleSubmitRegisterSchema = z.object({
  image: z
    .string()
    .min(1, {
      message: fieldRequired("Imagem é obrigatória"),
    })
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalUploadImagem {
  handleClose: () => void;
}

const ModalUploadImagem = ({
  handleClose,
}: IModalUploadImagem) => {
  const { user } = useGlobal();
  const { createImagem } = useImagem();

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
  });

  const { mutate, isLoading } = createImagem(reset, handleClose);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('')

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    setImageName(event.target.files?.[0].name || '')

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
          setValue('image', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    };
  }

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData,
      userId: user?.id,
      nome: imageName
    })
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitRegister)}
      style={{ width: "100%" }}
    >
      <Box display="flex" flexDirection="column" gap="25px" padding="30px">
        <FieldWrap>
          <label htmlFor="image-upload">
            <Box
              border="1px dashed #ccc"
              borderRadius="5px"
              p="20px"
              textAlign="center"
              position="relative"
            >
              <Text>Solte suas imagens aqui ou clique para fazer o upload.</Text>
              <br />
              <Icon
                as={FaDownload}
                position="absolute"
                bottom="10px"
                left="50%"
                transform="translateX(-50%)"
              />
            </Box>
            <Input
              type="file"
              id="image-upload"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
            />
          </label>
          {selectedImage && (
            <Box mt="10px" width="300px" height="200px" overflow="hidden" border="1px solid #ccc">
              <Img src={selectedImage} width="100%" height="100%" alt="Imagem selecionada" objectFit="cover" />
            </Box>
          )}
        </FieldWrap>

        <Flex justifyContent="flex-end" gap="15px">
          <Button
            isDisabled={
              isLoading
            }
            isLoading={isLoading}
            type="submit"
          >
            Enviar
          </Button>
        </Flex>
      </Box>
    </form>
  );
}

export default ModalUploadImagem;
