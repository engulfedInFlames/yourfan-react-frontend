import React from "react";
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

interface IForumTabs {
  channel: string;
}

export default function ForumTabs({ channel }: IForumTabs) {
  const { pathname } = useLocation();
  const [tabIndex, setTabIndex] = React.useState(1);

  React.useEffect(() => {
    const splited = pathname.split("/").filter(Boolean);
    const curLocation = splited.pop();
    if (curLocation === "insight") setTabIndex(0);
    else if (curLocation === "consortium") setTabIndex(1);
    else setTabIndex(2);
  }, [pathname]);

  return (
    <Tabs index={tabIndex} mb={8} userSelect={"none"}>
      <TabList>
        <Link to={`/${channel}/insight`}>
          <Tab fontSize={"xl"} color={"primary"} borderTopRadius={"lg"}>
            인사이트
          </Tab>
        </Link>
        <Link to={`/${channel}/consortium`}>
          <Tab fontSize={"xl"} color={"primary"} borderTopRadius={"lg"}>
            컨소시움
          </Tab>
        </Link>
        <Link to={`/${channel}/colloquium`}>
          <Tab fontSize={"xl"} color={"primary"} borderTopRadius={"lg"}>
            콜로키움
          </Tab>
        </Link>
      </TabList>
    </Tabs>
  );
}