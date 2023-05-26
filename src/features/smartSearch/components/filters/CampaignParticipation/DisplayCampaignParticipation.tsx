import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import DisplayTimeFrame from '../DisplayTimeFrame';
import getActivity from 'features/smartSearch/fetching/getActivity';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getLocation from 'features/smartSearch/fetching/getLocation';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  CampaignParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledMsg from '../../StyledMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.campaignParticipation;

interface DisplayCampaignParticipationProps {
  filter: SmartSearchFilterWithId<CampaignParticipationConfig>;
}

const DisplayCampaignParticipation = ({
  filter,
}: DisplayCampaignParticipationProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const {
    operator,
    state,
    campaign: campId,
    activity: activityId,
    location: locationId,
  } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId as string, campId?.toString() as string),
    { enabled: !!campId }
  );
  const activityQuery = useQuery(
    ['activity', orgId, activityId],
    getActivity(orgId as string, activityId?.toString() as string),
    { enabled: !!activityId }
  );
  const locationQuery = useQuery(
    ['location', orgId, locationId],
    getLocation(orgId as string, locationId?.toString() as string),
    { enabled: !!locationId }
  );

  const campaignTitle = campaignQuery?.data?.title || null;
  const activityTitle = activityQuery?.data?.title || null;
  const locationTitle = locationQuery?.data?.title || null;

  return (
    <Msg
      id={messageIds.filters.campaignParticipation.inputString}
      values={{
        activitySelect: activityTitle ? (
          <StyledMsg
            id={localMessageIds.activitySelect.activity}
            values={{
              activity: <UnderlinedText text={activityTitle} />,
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.activitySelect.any} />
        ),
        addRemoveSelect: <StyledMsg id={localMessageIds.addRemoveSelect[op]} />,
        bookedSelect: <StyledMsg id={localMessageIds.bookedSelect[state]} />,
        campaignSelect: campaignTitle ? (
          <StyledMsg
            id={localMessageIds.campaignSelect.campaign}
            values={{
              campaign: <UnderlinedText text={campaignTitle} />,
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.campaignSelect.any} />
        ),
        haveSelect: <Msg id={localMessageIds.haveSelect[operator]} />,
        locationSelect: locationTitle ? (
          <StyledMsg
            id={localMessageIds.locationSelect.location}
            values={{
              location: <UnderlinedText text={locationTitle} />,
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.locationSelect.any} />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayCampaignParticipation;
