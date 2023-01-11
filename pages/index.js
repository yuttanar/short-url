import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [urlPath, setUrlPath] = useState();
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      longUrl: "",
    },
    mode: "all",
  });
  const onSubmit = async (data) => {
    setOpen(true);
    const result = await axios.post("/api/short-url", {
      longUrl: data.longUrl,
    });
    if (result.data.type === "success") {
      setUrlPath(result.data);
    }
    setOpen(false);
  };

  const handleCopy = (textToCopy) => {
    let copyText = document.createElement("input");
    document.body.appendChild(copyText);
    // copyText.setAttribute("type", "hidden");
    copyText.value = textToCopy;
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 1000); // For mobile devices

    navigator.clipboard.writeText(copyText.value).then(
      () => {
        /* clipboard successfully set */
        document.body.removeChild(copyText);
        toast.success(`Copied`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
      (e) => {
        try {
          document.body.removeChild(copyText);
          var input = document.createElement("input");
          document.body.appendChild(input);
          input.value = textToCopy;
          input.select();
          const result = document.execCommand("copy");
          document.body.removeChild(input);
          if (!result) {
            throw new Error("document.execCommand failed");
          }
          toast.success(`Copied`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return true;
        } catch (err) {
          toast.error(`คัดลอกไม่ได้`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return false;
        }
      }
    );
  };

  return (
    <>
      <Head>
        <title>URL Shortener App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by paste&nbsp;
            <code className={styles.code}>your long url</code>
          </p>
          <div>
            <a
              href="https://github.com/yuttanar"
              target="_blank"
              rel="noopener noreferrer"
            >
              By Yuttanar
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Container>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "80vw",
                minWidth:345
              }}
              elevation={10}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="longUrl"
                control={control}
                rules={{
                  required: { value: true, message: "This field is required" },
                  pattern: {
                    value:
                      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/,
                    message: "Long URL not matching url pattern",
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Your Long URL Ex: https://github.com/yuttanar"
                      inputProps={{
                        "aria-label":
                          "Your Long URL EX: https://github.com/yuttanar",
                      }}
                      fullWidth
                      {...field}
                    />
                  </>
                )}
              />

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Button
                size="small"
                variant="contained"
                type="submit"
                disabled={!isDirty || !isValid}
                startIcon={<ContentCutIcon />}
              >
                Shorten
              </Button>
            </Paper>
            <br />
            {errors && errors.longUrl && (
              <Typography variant="subtitle1" align="center">
                <Chip
                  variant="contained"
                  color="error"
                  size="small"
                  label={errors.longUrl.message}
                ></Chip>
              </Typography>
            )}
            <br />
            {urlPath && (
              <Grid container justifyContent={"center"} >
                <Card sx={{ maxWidth: 345 }} elevation={10}>
                  <CardContent>
                    <Typography
                      noWrap
                      gutterBottom
                      variant="body2"
                      color="text.secondary"
                    >
                      {urlPath.longUrl}
                    </Typography>
                    <Divider />
                    <Typography variant="body2" color="primary">
                      {`${urlPath.urlPath}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        handleCopy(
                          `${urlPath.urlPath}`
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )}
          </Container>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
