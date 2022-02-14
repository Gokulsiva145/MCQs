import { Link as RouterLink, Outlet } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
// components
import Logo from "../components/Logo";
import { getUserTypeId } from "../utils/Common";
import { AppBar, Stack, Toolbar } from "@mui/material";
import { createTheme, alpha } from "@mui/material/styles";
// import { alpha, styled } from '@mui/material/styles';
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import AccountPopoverStudent from "./AccountPopoverStudent";

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3, 3, 0),
  },
}));

// ----------------------------------------------------------------------
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
      sx={{ alignItems: "end" }}
    >
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  // boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function LogoOnlyLayout(props) {
  return (
    <>
      {getUserTypeId() === 3 ? (
        <>
          <HideOnScroll {...props}>
            <RootStyle>
              <HeaderStyle>
                <RouterLink to="/">
                  <Logo />
                </RouterLink>
              </HeaderStyle>
              <ToolbarStyle>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{ xs: 0.5, sm: 1.5 }}
                >
                  <AccountPopoverStudent />
                </Stack>
              </ToolbarStyle>
            </RootStyle>
          </HideOnScroll>

          <Outlet />
        </>
      ) : (
        <>
          <HeaderStyle>
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </HeaderStyle>
          <Outlet />
        </>
      )}
    </>
  );
}
