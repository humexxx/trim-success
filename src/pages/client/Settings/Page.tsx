import { Box, Tab } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import { useState } from "react";
import { UserSettings } from "./components";
import { CubeSettings } from "./Cube";
import { useAuth } from "src/context/auth";
import { AdminSettings } from "./Admin";

export interface DataSet {
  id?: number;
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number;
}

function getTabProps(id: string) {
  return {
    id: `tab-${id}`,
    "aria-controls": `tabpanel-${id}`,
  };
}

const Page = () => {
  useDocumentMetadata(`Settings - Champions`);
  const user = useAuth();

  const [selectedTab, setSelectedTab] = useState("0");

  return (
    <Box mb={2}>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} mb={2}>
          <TabList
            onChange={(_, tab) => setSelectedTab(tab)}
            aria-label="compound interest calculator tabs"
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab label="Usuario" value="0" {...getTabProps("0")} />
            <Tab label="Cube" value="1" {...getTabProps("1")} />
            {Boolean(user.currentUser?.isAdmin) && (
              <Tab label="Admin" value="2" {...getTabProps("2")} />
            )}
          </TabList>
        </Box>
        <SwipeableViews
          index={Number(selectedTab)}
          onChangeIndex={(i) => setSelectedTab(i.toString())}
          containerStyle={{
            transition: "transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s",
          }}
        >
          <TabPanel value={"0"} sx={{ p: 2 }}>
            <UserSettings />
          </TabPanel>
          <TabPanel value={"1"} sx={{ p: 2 }}>
            <CubeSettings />
          </TabPanel>
          <TabPanel value={"2"} sx={{ p: 2 }}>
            <AdminSettings />
          </TabPanel>
        </SwipeableViews>
      </TabContext>
    </Box>
  );
};

export default Page;
