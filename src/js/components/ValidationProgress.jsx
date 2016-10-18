import React, { PropTypes } from 'react'

const ValidationProgress = (props) => {
  const code = props.status.code

  let uploadComplete = 'Uploading...'
  let parsingStatus = null
  let validationStatus = null

  if(code > 2) uploadComplete = 'Upload complete'
  if(code > 3) parsingStatus = 'Parsing started...'
  if(code > 4) parsingStatus = 'Parsing complete'
  if(code > 6) validationStatus = 'Validation started...'
  if(code > 7) validationStatus = 'Validation complete'

  return (
    <ul className="ValidationProgress usa-unstyled-list">
      <li>{uploadComplete}</li>
      <li>{parsingStatus}</li>
      <li>{validationStatus}</li>
    </ul>
  )
}

ValidationProgress.propTypes = {
  code: PropTypes.number
}

ValidationProgress.defaultProps = {
  status: {}
}

export default ValidationProgress
