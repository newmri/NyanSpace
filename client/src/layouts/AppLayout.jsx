import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, SvgIcon, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TableChartIcon from "@mui/icons-material/TableChart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CalculateIcon from "@mui/icons-material/Calculate";
import PercentIcon from "@mui/icons-material/Percent";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
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
import ExcelConveterToPage from "../pages/ExcelConveterToPage";
import ExcelConveterFromPage from "../pages/ExcelConveterFromPage";
import YoutubeSearchPage from "../pages/YoutubeSearchPage";
import EmotionDiaryPage from "../pages/EmotionDiaryPage";
import { useNotification } from "../components/Notification";

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
    segment: "excel-converter",
    title: "엑셀 변환기",
    icon: <TableChartIcon />,
    children: [
      {
        segment: "to",
        title: "TO JSON & CSV",
        icon: <ArrowForwardIosIcon />,
      },
      {
        segment: "from",
        title: "FROM JSON & CSV",
        icon: <ArrowBackIosIcon />,
      },
    ],
  },
  {
    segment: "youtube",
    title: "유튜브",
    icon: <YouTubeIcon />,
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
    segment: "drink-tracker",
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
  {
    segment: "emotion-diary",
    title: "감정 일기장",
    icon: <EmojiEmotionsIcon />,
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
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          cursor: url("/cursor_normal.png") 32 32, auto !important;
        }

        /* 모든 상호작용 요소에 발바닥 적용 */
        button, a, input, select, label, 
        .MuiButtonBase-root, .MuiListItemButton-root,
        .MuiFormControlLabel-root, .MuiToggleButton-root,
        .MuiSvgIcon-root, [role="button"], [role="checkbox"],
        [role="radio"], [role="tab"], [role="menuitem"] {
          cursor: url("/cursor_hover.png") 32 32, pointer !important;
        }

        /* 체크박스/라디오 버튼 내부의 실제 input 커서 상속 */
        .MuiButtonBase-root input {
          cursor: inherit !important;
        }

        /* 상호작용 요소들의 공통 트랜지션 (솜방망이처럼 부드럽게) */
        .MuiButtonBase-root, .MuiFormControlLabel-root {
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        /* 텍스트 입력창은 고양이가 '글씨를 가리지 않게' 기본 커서 유지 */
        input[type="text"], input[type="password"], textarea, .MuiInputBase-input {
          cursor: text !important;
        }
          
        /* 클릭 시 전체적인 피드백 (active 상태) */
        .MuiButtonBase-root:active {
          transform: scale(0.9) rotate(-1deg) !important;
          filter: brightness(0.9) contrast(1.1); /* 젤리를 꾹 누른 듯한 색감 */
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            transform: "scale(1.03)",
            letterSpacing: "0.5px",
            // 핑크색 젤리 광택 효과 추가
            boxShadow: "0 4px 12px rgba(255, 182, 193, 0.3)", 
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&:hover": {
            transform: "scale(1.1) rotate(-5deg)",
          },
          // 체크될 때 '냥!' 하고 커지는 애니메이션
          "&.Mui-checked": {
            animation: "paw-punch 0.3s ease-in-out",
          },
        },
      },
    },
  },
});


function DemoPageContent({ pathname, account }) {
  let content;

  switch (pathname) {
    case "/quote":
      content = <QuotePage />;
      break;
    case "/excel-converter/to":
      content = <ExcelConveterToPage />;
      break;
    case "/excel-converter/from":
      content = <ExcelConveterFromPage />;
      break;
    case "/youtube":
      content = <YoutubeSearchPage />;
      break;
    case "/calculator/percentage":
      content = <PercentageCalculatorPage />;
      break;
    case "/drink-tracker/drink":
      if (!account) {
        content = <Typography>로그인이 필요합니다.</Typography>;
      } else {
        content = <DrinkTrackerPage />;
      }
      break;
    case "/drink-tracker/statics":
      if (!account) {
        content = <Typography>로그인이 필요합니다.</Typography>;
      } else {
        content = <DrinkStaticsPage />;
      }
      break;
    case "/emotion-diary":
      if (!account) {
        content = <Typography>로그인이 필요합니다.</Typography>;
      } else {
        content = <EmotionDiaryPage />;
      }
      break;
    default:
      content = <Typography>페이지를 찾을 수 없습니다</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, textAlign: "center" }}>
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
  const { showMessage } = useNotification();

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
      showMessage(err.response.data.error, "error");
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
          showMessage(`${account.nickname}님 환영합니다!`);
          setAccount(account);
        }}
        onResetPassword={() => setResetPasswordModalOpen(true)}
      />
      <SignUpModal
        open={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSignIn={() => setSignInModalOpen(true)}
        onSignupSuccess={(nickname) => {
          showMessage(`${nickname}님 환영합니다!`);
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
          showMessage("비밀번호 변경 완료!");
        }}
      />
    </DemoProvider>
  );
}

export default AppLayout;
