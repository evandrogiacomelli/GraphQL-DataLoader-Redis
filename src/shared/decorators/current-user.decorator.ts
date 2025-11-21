import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { userContext } from '../context/user.context';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return userContext.getCurrentUser();
  },
);