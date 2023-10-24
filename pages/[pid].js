import { Home } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function getServerSideProps(req) {
  const { pid } = req.query;
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();

  const longUrl = await redis.get(pid);
  await redis.disconnect();

  // if (longUrl) {
  //   return {
  //     redirect: {
  //       destination: longUrl,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { longUrl: longUrl ? longUrl : null },
  };
}

const RedirectPage = ({ longUrl }) => {
  useEffect(() => {
    if (longUrl) {
      window.location.href = longUrl;
    }
  }, []);
  return (
    !longUrl && (
      <div>
        <Head>
          <title>URL Shortener</title>
        </Head>
        <Container>
          <Grid
            container
            alignContent={"center"}
            justifyContent="center"
            style={{
              minHeight: "100vh",
            }}
          >
            <Grid item xs={12} lg={12} xl={12}>
              <Typography variant="h3" align="center" component={"div"}>
                URL not found
              </Typography>
            </Grid>
            <Grid item xs={12} lg={12} xl={12} style={{ textAlign: "center" }}>
              <Link href="/">
                <Button variant="contained" startIcon={<Home />}>
                  BACK TO HOME
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  );
};

export default RedirectPage;
