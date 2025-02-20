import { useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchbarProps = {
    pptListData: Participant[]|null;
    resetOrder: () => void;
    searchFilter: (arg0: string) => void;
    placeholder: string;
}

const Searchbar = ({ pptListData, resetOrder, searchFilter, placeholder }: SearchbarProps) => {
    const [pptSearchTerm, setPptSearchTerm] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        if (e.target.value == "") {
            resetOrder();
        }
        setPptSearchTerm(e.target.value);
    }

    const handleSearchKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && pptSearchTerm != "") {
            searchFilter(pptSearchTerm);
        }
    }


    return (
        <Box display="flex" alignItems="center">
            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={pptSearchTerm}
                onChange={(e) => handleChange(e)}
                onKeyDown={handleSearchKeydown}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton onClick={() => searchFilter(pptSearchTerm)}>
                                <SearchIcon />
                            </IconButton>
                            </InputAdornment>
                        ),
                    }
                }}
            />
        </Box>
    )
}

export default Searchbar;