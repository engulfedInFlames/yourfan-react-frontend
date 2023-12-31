import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import SearchForumForm from "../Form/SearchForumForm";
import CreateForumForm from "../Form/CreateForumForm";
import { apiGetSimilarChannels, apiPostChannel } from "../../api";
import { IChannel } from "../../type";
import { useSetRecoilState } from "recoil";
import { createForumBtnAtom } from "../../atom";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiStepFormModal({ isOpen, onClose }: IProps) {
  const toast = useToast();
  const [step, setStep] = React.useState(1);
  const [progress, setProgress] = React.useState(50);
  const [channelHandle, setChannelHandle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [channels, setChannels] = React.useState<IChannel[]>([]);
  const [channel, setChannel] = React.useState("");
  const setAtomValue = useSetRecoilState(createForumBtnAtom);
  const queryClient = useQueryClient();
  const reset = () => {
    onClose();
    setStep(1);
    setProgress(50);
    setChannels([]);
    setChannel("");
    setChannelHandle("");
  };
  const searchMutation = useMutation(apiGetSimilarChannels, {
    onSuccess: (data: IChannel[]) => {
      if (data !== undefined) {
        const filteredChannels = data.filter(
          (channel) => channel.subscriber >= 10000
        );
        setChannels(filteredChannels);
      } else {
        toast({
          title: "채널 검색에 실패했습니다",
          description:
            "검색어가 유효하지 않거나 일일 검색 횟수를 초과했습니다.",
          status: "error",
          position: "top",
          duration: 5000,
        });
      }
      setIsLoading(false);
    },
    onError: (data: AxiosError) => {
      toast({
        title: "채널 검색에 실패했습니다",
        status: "error",
        position: "top",
        duration: 3000,
      });
      setIsLoading(false);
    },
  });

  const createMutation = useMutation(apiPostChannel, {
    onSuccess: (data: any) => {
      if (data !== undefined) {
        toast({
          title: "포럼이 생성됐습니다",
          status: "success",
          position: "top",
          duration: 5000,
        });
        queryClient.refetchQueries(["boards"]);
      } else {
        toast({
          title: "포럼이 생성되지 않았습니다",
          description:
            "이미 존재하는 포럼이거나 존재하지 않는 유튜브 채널입니다.",
          status: "warning",
          position: "top",
          duration: 3000,
        });
      }
      setAtomValue(false);
    },
    onError: () => {
      toast({
        title: "포럼이 생성되지 않았습니다",
        description:
          "이미 존재하는 포럼이거나 존재하지 않는 유튜브 채널입니다.",
        status: "error",
        position: "top",
        duration: 3000,
      });
      setAtomValue(false);
    },
  });

  const onClickPrev = () => {
    setStep(1);
    setProgress(50);
  };

  const onClickNext = async () => {
    if (channelHandle.length < 2) {
      toast({
        title: "최소 두 글자를 입력해야 합니다.",
        status: "warning",
        position: "top",
        duration: 3000,
      });
      return;
    }
    if (step === 1) {
      setIsLoading(true);
      searchMutation.mutate(channelHandle);
    }
    setStep(2);
    setProgress(100);
  };

  const onClickSubmit = async () => {
    if (step === 2) {
      setAtomValue(true);
      createMutation.mutate(channel);
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
      }}
    >
      <ModalOverlay />
      <ModalContent userSelect={"none"}>
        <Box
          rounded="lg"
          maxWidth={800}
          aspectRatio={1 / 1}
          p={6}
          m="10px auto"
          as="form"
        >
          <ModalHeader pt={0} mb={4}>
            <Progress
              hasStripe
              value={progress}
              w={80}
              mb="10%"
              mx="auto"
              borderRadius={"lg"}
              colorScheme={"red"}
              isAnimated
            />
            <Box position={"relative"}>
              <Heading textAlign={"center"} fontWeight={"normal"}>
                {step === 1 ? "채널 검색하기" : "채널 선택하기"}
              </Heading>
              <ModalCloseButton
                top={"50%"}
                right={0}
                transform={"auto"}
                translateY={"-50%"}
              />
            </Box>
          </ModalHeader>
          {isLoading ? (
            <VStack w={"full"} justifyContent={"center"} py={12}>
              <Spinner size={"xl"} />
            </VStack>
          ) : step === 1 ? (
            <SearchForumForm
              channelHandle={channelHandle}
              setChannelHandle={setChannelHandle}
            />
          ) : (
            <CreateForumForm channels={channels} setChannel={setChannel} />
          )}

          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={onClickPrev}
                  isDisabled={step === 1}
                  variant="solid"
                  w="6rem"
                  mr="5%"
                >
                  이전
                </Button>
                <Button
                  onClick={onClickNext}
                  isDisabled={step === 2}
                  w="6rem"
                  variant="solid"
                >
                  다음
                </Button>
              </Flex>
              <Button
                onClick={onClickSubmit}
                isDisabled={step === 1}
                w="6rem"
                colorScheme="red"
                variant="solid"
              >
                신청
              </Button>
            </Flex>
          </ButtonGroup>
        </Box>
      </ModalContent>
    </Modal>
  );
}
