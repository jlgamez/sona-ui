import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Switch } from "@/components/ui/switch.tsx";

type ToggleSettingProps = {
  name: string;
  description?: string | React.ReactNode;
  onChange?: (checked: boolean) => void;
  enabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
};

export const ToggleSetting = (props: ToggleSettingProps) => {
  const {
    name,
    description,
    onChange,
    enabled = true,
    defaultChecked = false,
    checked,
  } = props;

  const textOpacity = enabled ? 1 : 0.5;
  const switchOpacity = enabled ? 1 : 0.9;
  return (
    <Stack direction={"column"}>
      <Stack direction="row" spacing={12} align="start">
        <Text
          as={"h2"}
          tone={"default"}
          weight={"normal"}
          style={{ opacity: textOpacity }}
        >
          {name}
        </Text>
        <Switch
          onCheckedChange={onChange}
          disabled={!enabled}
          style={{ opacity: switchOpacity }}
          defaultChecked={defaultChecked}
          checked={checked}
        />
      </Stack>
      <Text
        as={"p"}
        tone={"muted"}
        size={"sm"}
        style={{ opacity: textOpacity }}
      >
        {description}
      </Text>
    </Stack>
  );
};
