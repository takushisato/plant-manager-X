import { FormControl, FormLabel, Input, Flex } from "@chakra-ui/react";
import TooltipIcon from "@/components/common/TooltipIcon";
import { InputWithTooltipProps } from "@/types/login";

const InputWithTooltip = ({ label, name, tooltip, ...inputProps }: InputWithTooltipProps) => {
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

export default InputWithTooltip;
