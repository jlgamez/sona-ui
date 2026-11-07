import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";

type LoadErrorProps = {
  message: string;
  onRetry: () => void;
};

export const LoadError = ({ message, onRetry }: LoadErrorProps) => (
  <Stack
    direction="column"
    spacing={4}
    align="center"
    justify="center"
    className="h-screen w-full px-8"
  >
    <Text as="h2" size="xl" weight="semibold">
      Can't load Sona
    </Text>
    <Text tone="muted" align="center">
      {message}. Make sure Sona is running, then try again.
    </Text>
    <Button onClick={onRetry}>Try again</Button>
  </Stack>
);
