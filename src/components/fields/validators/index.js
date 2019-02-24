import moment from 'moment'

export const validateDateRange = ({ 
  startDate, 
  endDate 
}) => {
  const startMoment = moment(startDate)
  const endMoment = moment(endDate)

  if (endMoment.isBefore(startMoment)) {
    return 'End date must be after start date.'
  }

  return undefined
}