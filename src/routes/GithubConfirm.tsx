import { Heading, Spinner, VStack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGithubLogin } from "../api";
import { AxiosError } from "axios";
import { useNotUserOnly } from "../hooks/userHooks";

export default function GithubConfirm() {
  useNotUserOnly();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mutation = useMutation(apiGithubLogin, {
    onSuccess: () => {
      toast({
        title: "로그인에 성공했습니다",
        status: "success",
        position: "bottom-right",
        duration: 3000,
      });
      queryClient.refetchQueries(["me"]);
      navigate("/");
    },
    onError: (err: AxiosError) => {
      const { status } = err?.response!;
      if (status === 403) {
        toast({
          title: "탈퇴된 회원입니다",
          status: "warning",
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        toast({
          title: "로그인에 실패했습니다",
          status: "error",
          position: "bottom-right",
          duration: 3000,
        });
      }
      navigate("/");
    },
  });

  const confirmGithub = async () => {
    const code = searchParams.get("code");
    if (code) {
      mutation.mutate(code);
    }
  };
  useEffect(() => {
    confirmGithub();
  }, []);

  return (
    <VStack minH={"768px"} py={36}>
      <Heading>깃허브 계정으로 로그인 하는 중...</Heading>
      <Spinner size="lg" />
    </VStack>
  );
}
