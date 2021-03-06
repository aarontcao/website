import fetch from 'isomorphic-fetch';

import { 
  CONTEST_POST,
  CONTEST_GET,
  CONTEST_TEST_POST,
  CONTEST_TEST_GET,
  CONTEST_TEST_PROB,
  CONTEST_RM_PROB,
  CONTEST_REORDER_PROBS,
  CONTEST_REQUEST_TS,
  CONTEST_JOIN_TS,
  requestStatuses,
  requestPayloads
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';
import { authenticate, APIAction, authAPIAction } from './utilities';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const {
  successPayload,
  errorPayload,
  idlePayload,
  pendingPayload
} = requestPayloads;

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function postContest({ competition_id, name, date, locations }) {
  let action = { type: CONTEST_POST };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/contests', {
        method: 'post',
        body: JSON.stringify({ competition_id, name, date, locations }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload()));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          err.message || 'Failed to communicate with server.'
        )))
      );
    });    
  }
}

export function getContest(contest_id) {
  return authAPIAction({
    type: CONTEST_GET,
    url: `/api/contests/${contest_id}`,
    opts: { 
      method: 'get',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    },
    formatData: ({ success, message, contest }) => ({ success, message, content: contest })  
  });
}

export function postTest({ name, num_problems, contest_id }) {
  return authAPIAction({
    type: CONTEST_TEST_POST,
    url: `/api/contests/${contest_id}/tests`,
    opts: {
      method: 'post',
      body: JSON.stringify({ name, num_problems }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, test }) => ({ success, message, content: test })
  });
}

export function getTest(test_id) {
  return authAPIAction({
    type: CONTEST_TEST_GET,
    url: `/api/contests/tests/${test_id}`,
    opts: { 
      method: 'get',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    },
    formatData: ({ success, message, test }) => ({ success, message, content: test })  
  });
}

export function addTestProb(test_id, problem_id) {
  return authAPIAction({
    type: CONTEST_TEST_PROB,
    url: `/api/contests/tests/${test_id}`,
    opts: { 
      method: 'post',
      body: JSON.stringify({ problem_id }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    },
    formatData: ({ success, message, problem }) => ({ success, message, content: problem })  
  });
}

export function removeTestProb(test_id, problem_id) {
  return authAPIAction({
    type: CONTEST_RM_PROB,
    url: `/api/contests/tests/${test_id}`,
    opts: { 
      method: 'delete',
      body: JSON.stringify({ problem_id }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    },
    formatData: ({ success, message }) => ({ success, message })  
  });
}

export function reorderTestProbs(test_id, problem_ids) {
  return authAPIAction({
    type: CONTEST_REORDER_PROBS,
    url: `/api/contests/tests/${test_id}`,
    opts: { 
      method: 'put',
      body: JSON.stringify({ problem_ids }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    },
    formatData: ({ success, message }) => ({ success, message })  
  });
}

export function requestTS(contest_id, num) {
  return authAPIAction({
    type: CONTEST_REQUEST_TS,
    url: `/api/contests/${contest_id}/test-solvers`,
    opts: { 
      method: 'post',
      body: JSON.stringify({ requested_test_solvers: num }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    },
    formatData: ({ success, message }) => ({ success, message })  
  });
}

export function joinTestSolve(contest_id) {
  return authAPIAction({
    type: CONTEST_JOIN_TS,
    url: '/api/contests/test-solve',
    opts: {
      method: 'post',
      body: JSON.stringify({ 
        type: requestTypes.REQUEST, 
        action_type: CONTEST_JOIN_TS,
        contest_id
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message }) => ({ success, message })
  });
}

