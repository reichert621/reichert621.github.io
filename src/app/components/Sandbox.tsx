import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Flex } from './common/common';

type SandboxProps = RouteComponentProps<{}> & {};
type SandboxState = {};

class Sandbox extends React.Component<SandboxProps, SandboxState> {
  constructor(props: SandboxProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Flex p={4} flexDirection="column">
        Hello world!
      </Flex>
    );
  }
}

export default Sandbox;
