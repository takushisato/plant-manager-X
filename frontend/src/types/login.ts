import { InputProps } from "@chakra-ui/react";

export type InputWithTooltipProps = {
  label: string;
  name: string;
  tooltip: string;
  isRequired?: boolean;
} & InputProps;
