import { useState } from "react";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { PageWrapper } from "src/components/layout";
import { useAuth } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { AdminSettings } from "./Admin";
import { UserSettings } from "./components";
import { CubeSettings } from "./Cube";

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
  const { isAdmin } = useAuth();

  const [selectedTab, setSelectedTab] = useState("0");

  return (
    <PageWrapper title="Configuración">
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
              {Boolean(isAdmin) && (
                <Tab label="Admin" value="2" {...getTabProps("2")} />
              )}
            </TabList>
          </Box>
          <TabPanel value={"0"} sx={{ p: 2 }}>
            <UserSettings />
          </TabPanel>
          <TabPanel value={"1"} sx={{ p: 2 }}>
            <CubeSettings />
          </TabPanel>
          <TabPanel value={"2"} sx={{ p: 2 }}>
            <AdminSettings />
          </TabPanel>
        </TabContext>
      </Box>
    </PageWrapper>
  );
};

export default Page;
