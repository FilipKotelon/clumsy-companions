/**
 * List of all possible tasks that make the app go into the state of global loading
 */
export type LoadingTask = 
 'AUTH_PROCESS'
 | 'AUTH_PASSWORD_RESET_REQUEST'
 | 'PLAYER_OPEN_PACK'
 | 'PLAYER_RECEIVE_GIFT'
 | 'END_GAME';