import updateStatus from './updateStatus.js'
import receiveSignaturePost from './receiveSignaturePost.js'
import receiveError from './receiveError.js'
import hasHttpError from './hasHttpError.js'
import { getId } from './Submission.js'
import requestSignaturePost from './requestSignaturePost.js'
import { postSignature } from '../api/api.js'

export default function updateSignature(signed) {
  return dispatch => {
    dispatch(requestSignaturePost())
    return postSignature(getId(), signed)
      .then(json => {
        if(hasHttpError(json)) throw new Error(JSON.stringify(dispatch(receiveError(json))))
        dispatch(receiveSignaturePost(json))
        return dispatch(updateStatus(
          {
            code: json.status.code,
            message: json.status.message
          }
        ))
      })
      .catch(err => console.error(err))
  }
}
