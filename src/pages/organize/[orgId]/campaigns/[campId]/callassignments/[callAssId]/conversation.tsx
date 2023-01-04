import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerInstructions from 'features/callAssignments/components/CallerInstructions';
import ConversationSettings from 'features/callAssignments/components/ConversationSettings';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'misc.breadcrumbs',
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

interface ConversationPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const ConversationPage: PageWithLayout<ConversationPageProps> = ({
  assignmentId,
  orgId,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={8} md={6} sm={12}>
        <CallerInstructions
          assignmentId={parseInt(assignmentId)}
          orgId={parseInt(orgId)}
        />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <ConversationSettings
          assignmentId={parseInt(assignmentId)}
          orgId={parseInt(orgId)}
        />
      </Grid>
    </Grid>
  );
};

ConversationPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default ConversationPage;
