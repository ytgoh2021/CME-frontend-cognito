import { Button, HStack, Input, useNumberInput } from "@chakra-ui/react";

const NumberField = ({ onChange, max, maxWidth, defaultValue = 1 }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: defaultValue,
      min: 1,
      max: max,
      onChange: onChange,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW={maxWidth} py={4}>
      <Button {...inc}>+</Button>
      <Input textAlign="center" {...input} />
      <Button {...dec}>-</Button>
    </HStack>
  );
};

export default NumberField;
