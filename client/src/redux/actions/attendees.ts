import { ADDATTENDEE, REMOVEATTENDEE, REMOVEALLATTENDEE } from "../constant";

export const addAttendee = (data) => ({ type: ADDATTENDEE, data })
export const removeAttendee = (data) => ({ type: REMOVEATTENDEE, data })
export const removeAllAttendees = () => ({type: REMOVEALLATTENDEE, data: []})