import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SurveyStats } from './rpc/getSurveyStats';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyElementOrder,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface SurveysStoreSlice {
  submissionList: RemoteList<ZetkinSurveySubmission>;
  statsBySurveyId: Record<number, RemoteItem<SurveyStats>>;
  surveyList: RemoteList<ZetkinSurveyExtended>;
}

const initialState: SurveysStoreSlice = {
  statsBySurveyId: {},
  submissionList: remoteList(),
  surveyList: remoteList(),
};

const surveysSlice = createSlice({
  initialState,
  name: 'surveys',
  reducers: {
    elementAdded: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, newElement] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements.push(newElement);
      }
    },
    elementDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [surveyId, elemId] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements = surveyItem.data.elements.filter(
          (elem) => elem.id !== elemId
        );
      }
    },
    elementOptionAdded: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, newOption] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options?.push(newOption);
        }
      }
    },
    elementOptionDeleted: (
      state,
      action: PayloadAction<[number, number, number]>
    ) => {
      const [surveyId, elemId, optionId] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options = elementItem.question.options?.filter(
            (option) => option.id !== optionId
          );
        }
      }
    },
    elementOptionUpdated: (
      state,
      action: PayloadAction<[number, number, number, ZetkinSurveyOption]>
    ) => {
      const [surveyId, elemId, optionId, updatedOption] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        const elementItem = surveyItem.data.elements.find(
          (element) => element.id === elemId
        );

        if (
          elementItem &&
          elementItem.type === ELEMENT_TYPE.QUESTION &&
          elementItem.question.response_type === RESPONSE_TYPE.OPTIONS
        ) {
          elementItem.question.options = elementItem.question.options?.map(
            (oldOption) =>
              oldOption.id == optionId ? updatedOption : oldOption
          );
        }
      }
    },
    elementOptionsReordered: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyElementOrder]>
    ) => {
      const [surveyId, elemId, newOrder] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      const element = surveyItem?.data?.elements.find(
        (elem) => elem.id == elemId
      );

      if (
        element?.type == ELEMENT_TYPE.QUESTION &&
        element.question.response_type == RESPONSE_TYPE.OPTIONS
      ) {
        element.question.options = element.question.options
          ?.concat()
          .sort(
            (o0, o1) =>
              newOrder.default.indexOf(o0.id) - newOrder.default.indexOf(o1.id)
          );
      }
    },
    elementUpdated: (
      state,
      action: PayloadAction<[number, number, ZetkinSurveyElement]>
    ) => {
      const [surveyId, elemId, updatedElement] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem && surveyItem.data) {
        surveyItem.data.elements = surveyItem.data.elements.map((oldElement) =>
          oldElement.id == elemId ? updatedElement : oldElement
        );
      }
    },
    elementsReordered: (
      state,
      action: PayloadAction<[number, ZetkinSurveyElementOrder]>
    ) => {
      const [surveyId, newOrder] = action.payload;
      const surveyItem = state.surveyList.items.find(
        (item) => item.id == surveyId
      );
      if (surveyItem?.data?.elements) {
        surveyItem.data.elements = surveyItem.data.elements
          .concat()
          .sort(
            (el0, el1) =>
              newOrder.default.indexOf(el0.id) -
              newOrder.default.indexOf(el1.id)
          );
      }
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const surveyId = action.payload;
      state.statsBySurveyId[surveyId] = remoteItem<SurveyStats>(surveyId, {
        isLoading: true,
      });
    },
    statsLoaded: (state, action: PayloadAction<[number, SurveyStats]>) => {
      const [surveyId, stats] = action.payload;
      state.statsBySurveyId[surveyId].data = stats;
      state.statsBySurveyId[surveyId].isLoading = false;
      state.statsBySurveyId[surveyId].loaded = new Date().toISOString();
      state.statsBySurveyId[surveyId].isStale = false;
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.submissionList.items.find((item) => item.id == id);
      state.submissionList.items = state.submissionList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    submissionLoaded: (
      state,
      action: PayloadAction<ZetkinSurveySubmission>
    ) => {
      // TODO: Segregate submission content from submission list
      const submission = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submission.id
      );
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = submission;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    surveyCreate: (state) => {
      state.surveyList.isLoading = true;
    },
    surveyCreated: (state, action: PayloadAction<ZetkinSurveyExtended>) => {
      const survey = action.payload;
      state.surveyList.isLoading = false;
      state.surveyList.items.push(remoteItem(survey.id, { data: survey }));
    },
    surveyLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.surveyList.items.find((item) => item.id == id);
      state.surveyList.items = state.surveyList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    surveyLoaded: (state, action: PayloadAction<ZetkinSurveyExtended>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = survey;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
    },
    surveySubmissionUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [submissionId, mutating] = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submissionId
      );
      if (item) {
        item.mutating = mutating;
      }
    },
    surveySubmissionUpdated: (
      state,
      action: PayloadAction<ZetkinSurveySubmission>
    ) => {
      const submission = action.payload;
      const item = state.submissionList.items.find(
        (item) => item.id == submission.id
      );
      if (item) {
        item.data = { ...item.data, ...submission };
        item.mutating = [];
        state.statsBySurveyId[submission.survey.id].isStale = true;
      }
    },
    surveysLoad: (state) => {
      state.surveyList.isLoading = true;
    },
    surveysLoaded: (state, action: PayloadAction<ZetkinSurveyExtended[]>) => {
      const surveys = action.payload;
      const timestamp = new Date().toISOString();
      state.surveyList = remoteList(surveys);
      state.surveyList.loaded = timestamp;
      state.surveyList.items.forEach((item) => (item.loaded = timestamp));
    },
    /* eslint-disable-next-line */
    surveySubmissionsLoad: (state, action: PayloadAction<number>) => {
      // TODO: Segregate submissions by survey ID
      state.submissionList.isLoading = true;
    },
    surveySubmissionsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinSurveySubmission[]]>
    ) => {
      // TODO: Segregate submissions by survey ID
      const [, submissions] = action.payload;
      state.submissionList = remoteList(submissions);
      state.submissionList.loaded = new Date().toISOString();
    },
    surveyUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [surveyId, mutating] = action.payload;
      const item = state.surveyList.items.find((item) => item.id == surveyId);
      if (item) {
        item.mutating = mutating;
      }
    },
    surveyUpdated: (state, action: PayloadAction<ZetkinSurvey>) => {
      const survey = action.payload;
      const item = state.surveyList.items.find((item) => item.id == survey.id);
      if (item) {
        item.data = { ...item.data, ...survey } as ZetkinSurveyExtended;
        item.mutating = [];
      }
    },
  },
});

export default surveysSlice;
export const {
  elementAdded,
  elementDeleted,
  elementOptionAdded,
  elementOptionDeleted,
  elementOptionUpdated,
  elementOptionsReordered,
  elementUpdated,
  elementsReordered,
  submissionLoad,
  submissionLoaded,
  statsLoad,
  statsLoaded,
  surveyCreate,
  surveyCreated,
  surveyLoad,
  surveyLoaded,
  surveySubmissionUpdate,
  surveySubmissionUpdated,
  surveySubmissionsLoad,
  surveySubmissionsLoaded,
  surveysLoad,
  surveysLoaded,
  surveyUpdate,
  surveyUpdated,
} = surveysSlice.actions;
