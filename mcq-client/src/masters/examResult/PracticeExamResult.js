import { Icon } from "@iconify/react";
import androidFilled from "@iconify/icons-ant-design/android-filled";
import bugFilled from "@iconify/icons-ant-design/bug-filled";
import appleFilled from "@iconify/icons-ant-design/apple-filled";
import windowsFilled from "@iconify/icons-ant-design/windows-filled";
import SendIcon from '@mui/icons-material/Send';
// material
import { alpha, styled } from "@mui/material/styles";
import { Button, Card, Typography, Grid, Container } from "@mui/material";
// utils
import { fShortenNumber } from "../../utils/formatNumber";
import Page from "../../components/Page";
import { Link as RouterLink } from "react-router-dom";
// ----------------------------------------------------------------------

const RootStyleMark = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

const RootStyleNoQuestion = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter,
}));

const RootStyleAttend = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter,
}));
const RootStyleStatus = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter,
}));
const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

export default function PracticeExamResult({ data }) {
  console.log(data);
  return (
    <Page title="Result">
      <Container maxWidth="xl">
        <Grid container spacing={3} justifyContent="center" sx={{ my: 15 }}>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyleNoQuestion>
              <IconWrapperStyle>
                <Icon icon={androidFilled} width={24} height={24} />
              </IconWrapperStyle>
              <Typography variant="h3">
                {fShortenNumber(data.numberOfQuestions)}
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                No of Questions
              </Typography>
            </RootStyleNoQuestion>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyleAttend>
              <IconWrapperStyle>
                <Icon icon={appleFilled} width={24} height={24} />
              </IconWrapperStyle>
              <Typography variant="h3">
                {fShortenNumber(data.attendedQuestions)}
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                Attended Questions
              </Typography>
            </RootStyleAttend>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyleMark>
              <IconWrapperStyle>
                <Icon icon={windowsFilled} width={24} height={24} />
              </IconWrapperStyle>
              <Typography variant="h3">{fShortenNumber(data.marks)}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                (Positive Mark :{fShortenNumber(data.positiveMarks)} Negative
                Mark :{fShortenNumber(data.negativeMarks)})
              </Typography>
            </RootStyleMark>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyleStatus>
              <IconWrapperStyle>
                <Icon icon={bugFilled} width={24} height={24} />
              </IconWrapperStyle>
              <Typography variant="h3">{data.status}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                Result
              </Typography>
            </RootStyleStatus>
          </Grid>          
        </Grid>
        <Grid container justifyContent="center">
            <Button
              variant="contained"
              type="button"
              component={RouterLink}
              to={-1}
              size="large"
              color="secondary"
              endIcon={<SendIcon />}
            >
              Goto List
            </Button>
          </Grid>
      </Container>
    </Page>
  );
}
