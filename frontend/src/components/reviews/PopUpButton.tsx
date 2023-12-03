import { useState, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function PopUpButton() {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setInputValue(value);
  };

  return (
    <Stack spacing={5} ml={10}>
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
      {inputValue && (
        <Button
          color="secondary"
          sx={{ width: 250, mt: 4 }}
          variant="contained"
        >
          Submit Review
        </Button>
      )}
    </Stack>
  );
}

export default PopUpButton;
