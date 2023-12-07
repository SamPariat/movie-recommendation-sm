import { useState, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import api from "../../api";

function PopUpButton() {
  const location = useLocation();
  // console.log(location.state.name);
  const sendReview = async () => {
    const response = await api(
      "post",
      `/sentiment/save-review/${location.state.name}`,
      null,
      { name: inputName, review: inputValue }
    );
    // console.log(response.data);
    return response.data;
  };

  const formMutation = useMutation({
    mutationFn: sendReview,
    mutationKey: ["Send Reviews"],
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [inputName, setInputName] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setInputValue(value);
  };

  const handleInputName = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setInputName(value);
  };

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("chutiya");
    formMutation.mutateAsync(
      { inputName, inputValue},
      {
        onSuccess: () => {
          setInputValue("");
          setInputName("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={5} mx={10}>
        <TextField
          placeholder="Name.."
          variant="outlined"
          color="secondary"
          label="Name"
          value={inputName}
          onChange={handleInputName}
          sx={{ width: { xs: 250, md: 500 } }}
        />
        <TextField
          placeholder="Type Your Review.."
          variant="outlined"
          color="secondary"
          label="Review"
          multiline
          rows={5}
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && inputName && (
          <Button
            color="secondary"
            sx={{ width: 250, mt: 4 }}
            variant="contained"
            type="submit"
            disabled={formMutation.isPending}
          >
            Submit Review
          </Button>
        )}
      </Stack>
    </form>
  );
}

export default PopUpButton;
