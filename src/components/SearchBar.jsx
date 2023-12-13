import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  return (
    <InputGroup mb={4}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input type="text" placeholder="Search" />
    </InputGroup>
  );
};

export default SearchBar;
