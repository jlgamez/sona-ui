import Text from "@/common-components/Text.tsx";
import DropDown from "@/common-components/DropDown.tsx";
import Stack from "@/common-components/Stack.tsx";

type Props = {
  name: string;
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

export const SelectableSetting = (props: Props) => {
  const { name, options, placeholder, onChange } = props;

  return (
    <Stack direction="column" spacing={2} align="start">
      <Text as={"h2"} tone={"default"} weight={"normal"}>
        {name}
      </Text>
      <DropDown
        options={options}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Stack>
  );
};
