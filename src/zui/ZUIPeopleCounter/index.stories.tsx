import { ComponentMeta, ComponentStory } from '@storybook/react';
import ZUIPeopleCounter, { COUNT_STATUS } from '.';

export default {
  component: ZUIPeopleCounter,
  title: 'Import/ZUIPeopleCounter',
} as ComponentMeta<typeof ZUIPeopleCounter>;

const Template: ComponentStory<typeof ZUIPeopleCounter> = (args) => (
  <ZUIPeopleCounter count={args.count} status={args.status} />
);

export const create = Template.bind({});
create.args = {
  count: 341,
  status: COUNT_STATUS.CREATED,
};

export const update = Template.bind({});
update.args = {
  count: 4312,
  status: COUNT_STATUS.UPDATED,
};
