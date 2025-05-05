import { FormControl, FormLabel, Input, InputProps, Flex } from "@chakra-ui/react";
import TooltipIcon from "@/components/common/TooltipIcon";

type Props = {
  label: string;
  name: string;
  tooltip: string;
} & InputProps;

const LabeledInputWithTooltip = ({ label, name, tooltip, ...inputProps }: Props) => {
  return (
    <FormControl isRequired>
      <Flex align="center" gap={1}>
        <FormLabel mb={0} htmlFor={name}>
          {label}
        </FormLabel>
        <TooltipIcon label={tooltip} />
      </Flex>
      <Input id={name} name={name} {...inputProps} />
    </FormControl>
  );
};

export default LabeledInputWithTooltip;
