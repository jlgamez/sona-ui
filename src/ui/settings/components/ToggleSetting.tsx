import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Switch } from "@/components/ui/switch.tsx";

type ToggleSettingProps = {
  name: string;
  description?: string | React.ReactNode;
  onChange?: (checked: boolean) => void;
  enabled?: boolean;
  comingSoon?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
};

export const ToggleSetting = (props: ToggleSettingProps) => {
  const {
    name,
    description,
    onChange,
    enabled = true,
    comingSoon = false,
    defaultChecked = false,
    checked,
  } = props;

  const isEnabled = enabled && !comingSoon;
  const textOpacity = isEnabled ? 1 : 0.5;
  const switchOpacity = isEnabled ? 1 : 0.9;
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
          {comingSoon && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Coming soon
            </span>
          )}
        </Text>
        <Switch
          onCheckedChange={onChange}
          disabled={!isEnabled}
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
