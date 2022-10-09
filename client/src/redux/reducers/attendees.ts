import { ADDATTENDEE, REMOVEATTENDEE, REMOVEALLATTENDEE } from "../constant";

const initState = []
export default function attendeesReducer(prevState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case ADDATTENDEE:
      return [data, ...prevState]
    case REMOVEATTENDEE:
      const attendees = prevState.filter(attendee => attendee.email !== data.email)
      return attendees
    case REMOVEALLATTENDEE:
      return []
    default:
      return prevState
  }
}