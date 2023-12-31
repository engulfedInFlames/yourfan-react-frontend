import { Divider, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { IPost } from "../../type";

interface IProps {
  channel?: string;
  postList: IPost[];
  page: number;
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

export default function PostList({ page, channel, postList }: IProps) {
  return (
    <>
      {channel ? (
        <Heading textAlign={"center"} py={8}>
          {channel}
        </Heading>
      ) : null}
      <Grid
        userSelect={"none"}
        minH={"760px"}
        gridAutoFlow={"row"}
        gridTemplateRows={"repeat(15, 1fr)"}
        p={8}
      >
        <GridItem>
          <Grid
            gridAutoFlow={"column"}
            templateColumns={"0.5fr 3fr 1fr 1fr"}
            gap={4}
            fontSize={"xl"}
            fontWeight={"bold"}
            py={2}
          >
            <Text textAlign={"center"} whiteSpace={"nowrap"}>
              번호
            </Text>
            <Text
              textAlign={"center"}
              whiteSpace={"nowrap"}
              overflow={"hidden"}
            >
              제목
            </Text>
            <Text
              textAlign={"center"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              작성자
            </Text>
            <Text textAlign={"center"} whiteSpace={"nowrap"}>
              게시 날짜
            </Text>
          </Grid>
          <Divider />
        </GridItem>
        {postList.map((post, i) => {
          const dateTime = new Date(post.created_at);
          return (
            <GridItem key={i}>
              <Link to={`${post.id}`}>
                <Grid
                  gridAutoFlow={"column"}
                  templateColumns={"0.5fr 3fr 1fr 1fr"}
                  gap={4}
                  fontSize={"xl"}
                  py={2}
                >
                  <Text textAlign={"center"} whiteSpace={"nowrap"}>
                    {post.id}
                  </Text>
                  <Text textAlign={"center"} whiteSpace={"nowrap"}>
                    {post.title}
                  </Text>
                  <Text textAlign={"center"} whiteSpace={"nowrap"}>
                    {post.user?.nickname}
                  </Text>
                  <Text textAlign={"center"} whiteSpace={"nowrap"}>
                    {dateTime
                      .toLocaleString("en-US", options)
                      .replace(",", " ")}
                  </Text>
                </Grid>
              </Link>
              <Divider />
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
}
