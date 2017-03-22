import moment from 'moment'
import store from './store'

const weekdays = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']


/**
 * Compare date day of two date.
 * 0 = same day
 * < 0 = date2 is before date1
 * < 0 = date2 is after date1
 * @param  {Date} date1
 * @param  {Date} date2
 * @return {number}
 */
export const compareDays = (date1, date2) => {
    date1 = new Date(date1)
    date2 = new Date(date2)
    const day1 = parseInt(date1.getFullYear() + ('0' + date1.getMonth()).slice(-2) + ('0' + date1.getDate()).slice(-2), 10)
    const day2 = parseInt(date2.getFullYear() + ('0' + date2.getMonth()).slice(-2) + ('0' + date2.getDate()).slice(-2), 10)
    const diff = day1 - day2
    
    return diff
}


/**
 * check if a user is logged in and can edit given match
 * @param {object} match
 * @return {boolean}
 */
export const isAdminForMatch = (match) => {
    const date = moment(match.datetime).diff(moment(), 'minutes') 
    const user = store.getState().auth

    return (user.team && user.team.ids && match && match.id
        && !(user.team.ids.indexOf(match.team_home.id) === -1
            && user.team.ids.indexOf(match.team_away.id) === -1)
        && (date < 16)
        && (!match.set_points || match.score_unconfirmed)
    ) ? true : false
}


/**
 * format timestamp to date string (Mo. dd.mm.yyyy)
 * @param {number} timestamp
 * @return {string}
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth() + 1}`.slice(-2)

    return `${weekdays[date.getDay()]} ${day}.${month}.${(''+date.getFullYear()).slice(-2)}`
}


/**
 * format timestamp to time string (HH:MM)
 * @param {number} timestamp
 * @return {string}
 */
export const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)

    return `${hours}:${minutes}`
}