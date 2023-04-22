import Box from '@mui/material/Box';
import useModel from 'core/useModel';
import CampaignActivitiesModel, { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import { useRouter } from 'next/router';
import ZUIFuture from 'zui/ZUIFuture';
import CalendarDayItem from './CalendarDayItem';
import { dateIsBefore } from 'utils/dateUtils';

export interface CalendarDayViewProps {
  focusDate: Date;
}

const CalendarDayView = ({
  focusDate
}: CalendarDayViewProps) => {
  const { orgId } = useRouter().query;
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={model.getAllActivities()}>
      {(data) => {
        const events = data.filter(a => a.kind == ACTIVITIES.EVENT);
        const laterEvents = events.filter(a => a.data.start_time != null && dateIsBefore(new Date(a.data.start_time), new Date(focusDate)));
        return (
          <Box
            sx={{
              flexDirection: 'row',
              marginTop: '1em',
            }}
          >
            {console.log("focusdate: "+focusDate.toISOString())}
            {console.log(events)}
            {console.log(laterEvents)}
            {console.log(events[0].data.start_time)}
            { laterEvents.length > 0 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(laterEvents[0].data.start_time)} />
            }
            { laterEvents.length > 1 && 
              <CalendarDayItem focusDate={new Date(focusDate)} date={new Date(laterEvents[1].data.start_time)} />
            }
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default CalendarDayView;
