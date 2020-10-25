import * as React from "react";

interface Props {
  text: string;
}

export const ExampleComponent = ({ text }: Props) => {
  return <div>Test 2: {text}</div>;
};
