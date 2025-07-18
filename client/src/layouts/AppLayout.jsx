import * as React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SearchIcon from "@mui/icons-material/Search";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import DrinkTrackerPage from "../pages/DrinkTrackerPage";
import DrinkStaticsPage from "../pages/DrinkStaticsPage";

const NAVIGATION = [
  {
    kind: "header",
    title: "도구",
  },
  {
    segment: "drinktracker",
    title: "수분 충전소",
    icon: <WaterDropIcon />,
    children: [
      {
        segment: "drink",
        title: "물 마시기",
        icon: <LocalDrinkIcon />,
      },
      {
        segment: "statics",
        title: "통계",
        icon: <EqualizerIcon />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  let content;

  switch (pathname) {
    case "/drinktracker/drink":
      content = <DrinkTrackerPage />;
      break;
    case "/drinktracker/statics":
      content = <DrinkStaticsPage />;
      break;
    default:
      content = <Typography>페이지를 찾을 수 없습니다: {pathname}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
      {content}
    </Container>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
      <ThemeSwitcher />
      <Account />
    </Stack>
  );
}

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
    >
      {mini ? "© huibaekim" : `© ${new Date().getFullYear()} Made by huibaekim`}
    </Typography>
  );
}
SidebarFooter.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <RocketLaunchIcon fontSize="large" color="primary" />
      <Typography variant="h6">NyanSpace</Typography>
      <Chip size="small" label="BETA" color="info" />
    </Stack>
  );
}

function AppLayout(props) {
  const { window } = props;

  const router = useDemoRouter("drinktracker/drink");

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            toolbarActions: ToolbarActionsSearch,
            sidebarFooter: SidebarFooter,
          }}
        >
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

export default AppLayout;
