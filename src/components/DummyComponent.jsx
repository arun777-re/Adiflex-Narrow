import {
  Grid,
  Paper,
  Skeleton,
} from "@mui/material";

const DummyComponent = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <Grid
          key={item}
          size={{ xs: 12, sm: 6, lg: 3 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Skeleton
              variant="text"
              width="60%"
              height={25}
            />

            <Skeleton
              variant="text"
              width="40%"
              height={50}
            />
          </Paper>
        </Grid>
      ))}
    </>
  );
};

export default DummyComponent;