import { Home } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
const redis = require("redis");

export async function getServerSideProps(req) {
  const { pid } = req.query;
  let client = redis.createClient({
    url: process.env.DATABASE_URL,
  });

  client.on("error", function (err) {
    throw err;
  });

  await client.connect();

  const longUrl = await client.get(pid);

  await client.disconnect();

  if (longUrl) {
    return {
      redirect: {
        destination: longUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const HashPage = () => {
  return (
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
  );
};

export default HashPage;
