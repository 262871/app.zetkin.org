import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import AddPersonButton from 'features/events/components/AddPersonButton';
import EventDataModel from 'features/events/models/EventDataModel';
import EventLayout from 'features/events/layout/EventLayout';
import EventParticipantsFilter from 'features/events/components/EventParticipantsFilter';
import EventParticipantsList from 'features/events/components/EventParticipantsList';
import { PageWithLayout } from 'utils/types';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, eventId } = ctx.params!;

    return {
      props: {
        campId,
        eventId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,

    localeScope: [],
  }
);

interface ParticipantsProps {
  campId: string;
  eventId: string;
  orgId: string;
}

const ParticipantsPage: PageWithLayout<ParticipantsProps> = ({
  eventId,
  orgId,
}) => {
  const dataModel = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  return (
    <ZUIFuture future={dataModel.getData()}>
      {(data) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <ParticipantSummaryCard model={dataModel} />
              </Grid>
              {/* <Grid container item justifyContent="flex-end" md={12}></Grid> */}
            </Grid>
            <Grid container item justifyContent="flex-end" md={12}>
              <EventParticipantsFilter model={dataModel} />
              <AddPersonButton model={dataModel} />
            </Grid>
            <EventParticipantsList
              data={data}
              model={dataModel}
              orgId={parseInt(orgId)}
            />
          </>
        );
      }}
    </ZUIFuture>
  );
};

ParticipantsPage.getLayout = function getLayout(page, props) {
  return (
    <EventLayout
      campaignId={props.campId}
      eventId={props.eventId}
      orgId={props.orgId}
    >
      {page}
    </EventLayout>
  );
};

export default ParticipantsPage;
