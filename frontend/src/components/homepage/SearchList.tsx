import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import api from "../../api";

interface MovieOption {
  id: number;
  title: string;
}

/**
 *
 * A search list that fetches movies from the backend (about 5000)
 */
const SearchList = () => {
  const navigate = useNavigate();
  const fetchAllMovies = async () => {
    const response = await api<{ dicc_arr: MovieOption[] }>(
      "GET",
      "/movie/all",
      null,
      null
    );

    return response.data.dicc_arr;
  };

  const filterOptions = createFilterOptions({
    limit: 50,
    stringify: (option: MovieOption) => option.title,
  });

  const { data, status } = useQuery({
    queryKey: ["movie", "all"],
    queryFn: fetchAllMovies,
  });

  if (status === "pending") {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Loading...
      </Typography>
    );
  }

  return (
    status === "success" && (
      <Autocomplete
        disablePortal
        blurOnSelect="mouse"
        options={data}
        autoHighlight={true}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.id}
            onClick={() =>
              navigate(`reviews/${option.id}`, {
                state: { name: option.title },
              })
            }
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     navigate(`reviews/${option.id}`);
            //   }
            // }}
          >
            {option.title}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select a Movie..." />
        )}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ mt: 4 }}
      />
    )
  );
};

export default SearchList;
