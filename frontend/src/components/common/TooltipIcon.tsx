import { Tooltip, Box } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

type TooltipIconProps = {
  label: string;
};

const TooltipIcon = ({ label }: TooltipIconProps) => (
  <Tooltip label={label} hasArrow>
    <Box as="span" display="inline-flex" alignItems="center">
      <QuestionIcon boxSize={4} color="gray.500" cursor="help" />
    </Box>
  </Tooltip>
);

export default TooltipIcon;
