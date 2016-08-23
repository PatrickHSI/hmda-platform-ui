import {
  getInstitution,
  getInstitutions,
  getLatestSubmission,
  getSubmission,
  getUploadUrl
} from '../api'
import * as types from '../constants'

let latestSubmissionId

export function requestInstitutions() {
  return {
    type: types.REQUEST_INSTITUTIONS
  }
}

export function receiveInstitutions(data) {
  return {
    type: types.RECEIVE_INSTITUTIONS,
    institutions: data.institutions
  }
}

export function requestInstitution() {
  return {
    type: types.REQUEST_INSTITUTION
  }
}

export function receiveInstitution(data) {
  return {
    type: types.RECEIVE_INSTITUTION,
    institution: data
  }
}

export function requestSubmission() {
  return {
    type: types.REQUEST_SUBMISSION
  }
}

export function receiveSubmission(data) {
  latestSubmissionId = data.id
  return {
    type: types.RECEIVE_SUBMISSION,
    submission: data
  }
}

export function clearFilings() {
  return {
    type: types.CLEAR_FILINGS
  }
}

export function selectFile(file) {
  return {
    type: types.SELECT_FILE,
    file
  }
}

export function uploadStart() {
  return {
    type: types.UPLOAD_START
  }
}

export function uploadProgress(xhrProgressEvent) {
  return {
    type: types.UPLOAD_PROGRESS,
    xhrProgressEvent
  }
}

export function uploadComplete(xhrLoadEvent) {
  return {
    type: types.UPLOAD_COMPLETE,
    xhrLoadEvent
  }
}

export function uploadError() {
  return {
    type: types.UPLOAD_ERROR
  }
}

/*
 * Wire upload together with xhr so progress can be tracked
 */
export function requestUpload(file) {
  return dispatch => {
    var xhr = new XMLHttpRequest()

    xhr.addEventListener('load', e => {
      if(e.target.status !== 202) return dispatch(uploadError())
      dispatch(uploadComplete(e))
      dispatch(pollForProgress())
    })

    xhr.upload.addEventListener('progress', e => {
      dispatch(uploadProgress(e))
    })

    xhr.open('POST', getUploadUrl());
    xhr.setRequestHeader('Content-Type', 'text/data');
    xhr.setRequestHeader('Content-Disposition', 'inline; filename="' + file.name + '"');
    xhr.setRequestHeader('CFPB-HMDA-Institutions', 'fakeinstitution');
    xhr.setRequestHeader('CFPB-HMDA-Username', 'fakeuser');
    xhr.send(file);

    dispatch(uploadStart())
    return Promise.resolve()
  }
}

/*
 * Get the latest submission via the api and dispatch an action with the results
 */
export function fetchSubmission() {
  return dispatch => {
    dispatch(requestSubmission())
    return getLatestSubmission()
      .then(json => dispatch(receiveSubmission(json)))
      .catch(err => console.log(err))
  }
}

export function pollForProgress() {
  const poller = dispatch => {
    return getSubmission(latestSubmissionId)
      .then(json => dispatch(receiveSubmission(json)))
      .then(json => {
        if(json.submission.status.code < 7){
          setTimeout(() => poller(dispatch), 500)
        }
      })
      .catch(err => console.log(err))
  }
  return poller
}

/*
 * Get progress by fetching submission data at /institution/<id>/filings/<id>/submissions/<id>
 * This may be replaced by a call for just the status and not all of the submission data
 */
export function fetchProgress(id) {
  return dispatch => {
    return getSubmission(id)
      .then(json => dispatch(receiveSubmission(json)))
      .catch(err => console.log(err))
  }
}

/*
 * Get high level institution data at /institutions
 * Then get filing data for each institution at /institutions/<id>
 */
export function fetchInstitutions() {
  return dispatch => {
    dispatch(requestInstitutions())
    return getInstitutions()
      .then(json => dispatch(receiveInstitutions(json)))
      .then(receiveAction => dispatch(fetchEachInstitution(receiveAction.institutions)))
      .catch(err => console.log(err))
  }
}

/*
 * Given a list of institutions, dispatch fetch instructions for each of them
 */
export function fetchEachInstitution(institutions) {
  return dispatch => {
    dispatch(clearFilings())
    return Promise.all(
      institutions.map( institution => {
        dispatch(fetchInstitution(institution))
      })
    )
  }
}

/*
 * Fetch an institution via the api and dispatch an action with the results
 */
export function fetchInstitution(institution) {
  return dispatch => {
    dispatch(requestInstitution())
    return getInstitution(institution.id)
      .then(json => dispatch(receiveInstitution(json)))
      .catch(err => console.log(err))
  }
}