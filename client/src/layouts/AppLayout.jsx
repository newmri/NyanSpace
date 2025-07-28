import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, SvgIcon, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CalculateIcon from "@mui/icons-material/Calculate";
import PercentIcon from "@mui/icons-material/Percent";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import PercentageCalculatorPage from "../pages/PercentageCalculatorPage";
import DrinkTrackerPage from "../pages/DrinkTrackerPage";
import DrinkStaticsPage from "../pages/DrinkStaticsPage";
import SignInModal from "../components/modals/SignInModal";
import SignUpModal from "../components/modals/SignUpModal";
import { signout } from "../api/account/SignoutApi";
import { getSessionAccount } from "../api/account/SessionApi";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";
import { ReactComponent as LogoSvg } from "../assets/images/logo/logo.svg";
import QuotePage from "../pages/QuotePage";

function LogoIcon(props) {
  return (
    <SvgIcon
      component={LogoSvg}
      viewBox="0 0 1024.000000 1024.000000"
      {...props}
    />
  );
}

const NAVIGATION = [
  {
    kind: "header",
    title: "도구",
  },
  {
    segment: "quote",
    title: "명언",
    icon: <FormatQuoteIcon />,
  },
  {
    segment: "calculator",
    title: "계산기",
    icon: <CalculateIcon />,
    children: [
      {
        segment: "percentage",
        title: "퍼센트 계산기",
        icon: <PercentIcon />,
      },
    ],
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
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function DemoPageContent({ pathname, account }) {
  let content;

  switch (pathname) {
    case "/quote":
      content = <QuotePage />;
      break;
    case "/calculator/percentage":
      content = <PercentageCalculatorPage />;
      break;
    case "/drinktracker/drink":
      if (!account) {
        content = <Typography>로그인이 필요합니다.</Typography>;
      } else {
        content = <DrinkTrackerPage />;
      }
      break;
    case "/drinktracker/statics":
      if (!account) {
        content = <Typography>로그인이 필요합니다.</Typography>;
      } else {
        content = <DrinkStaticsPage />;
      }
      break;
    default:
      content = <Typography>페이지를 찾을 수 없습니다</Typography>;
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
    <Stack direction="row" alignItems="center" spacing={1}>
      <LogoIcon
        fontSize="large"
        sx={{
          transform: "scale(2)",
          transformOrigin: "center",
        }}
      />
      <Typography variant="h6">NyanSpace</Typography>
    </Stack>
  );
}

function AppLayout(props) {
  const { window } = props;

  const router = useDemoRouter("quote");

  const demoWindow = window !== undefined ? window() : undefined;

  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [account, setAccount] = useState(undefined);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await getSessionAccount();
        setAccount(res.data.account);
      } catch (err) {
        setAccount(null);
      }
    };

    fetchAccount();
  }, []);

  function ToolbarActions() {
    if (undefined === account) {
      return <div style={{ height: "64px" }} />;
    }

    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        {account ? (
          <>
            {!isSmall && account?.nickname && (
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                {account.nickname}님
              </Typography>
            )}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              sx={{ borderRadius: "20px", textTransform: "none" }}
              onClick={() => handleSignOut()}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<LoginIcon />}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            onClick={() => setSignInModalOpen(true)}
          >
            로그인
          </Button>
        )}

        <ThemeSwitcher />
        <Account />
      </Stack>
    );
  }

  const handleSignOut = async () => {
    try {
      await signout();
      setAccount(null);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

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
            toolbarActions: ToolbarActions,
            sidebarFooter: SidebarFooter,
          }}
        >
          <DemoPageContent pathname={router.pathname} account={account} />
        </DashboardLayout>
      </AppProvider>
      <SignInModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSignUp={() => setSignUpModalOpen(true)}
        onSignInSuccess={(account) => {
          alert(`${account.nickname}님 환영합니다!`);
          setAccount(account);
        }}
        onResetPassword={() => setResetPasswordModalOpen(true)}
      />
      <SignUpModal
        open={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSignIn={() => setSignInModalOpen(true)}
        onSignupSuccess={(nickname) => {
          alert(`${nickname}님 환영합니다!`);
          setSignInModalOpen(true);
        }}
        onResetPassword={() => setResetPasswordModalOpen(true)}
      />
      <ResetPasswordModal
        open={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        onSignUp={() => setSignUpModalOpen(true)}
        onSignIn={() => setSignInModalOpen(true)}
        onResetPasswordSuccess={() => {
          alert("비밀번호 변경 완료!");
        }}
      />
    </DemoProvider>
  );
}

export default AppLayout;
