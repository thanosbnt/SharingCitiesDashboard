import {
  SAVE_LAYOUT_FULFILLED,
  SAVE_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  HIDE_NOTIFICATION,
  CREATE_NEW_USER_FULFILLED,
  DELETE_USER_FULFILLED,
  SAVE_WIDGET_FULFILLED,
  SAVE_WIDGET_REJECTED,
  RERUN_IMPORTER_FULFILLED,
  RERUN_IMPORTER_REJECTED
} from "./../constants";
import {RERUN_IMPORTER} from "../constants";

const initialState = {
  message: 'Testing',
  showAlert: false,
  variant: 'defaultNotification',
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case SAVE_LAYOUT_FULFILLED: {
      return {
        ...state,
        message: 'Layout Saved',
        showAlert: true,
        variant: 'successNotification',
        error: ''
      }
    }

    case SAVE_LAYOUT_REJECTED: {
      return {
        ...state,
        message: 'Problem Saving Layout',
        showAlert: true,
        variant: 'failureNotification',
      }
    }

    case CREATE_NEW_USER_FULFILLED: {
      return {
        ...state,
        message: 'User Added',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case DELETE_USER_FULFILLED: {
      return {
        ...state,
        message: 'User Deleted',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case SAVE_WIDGET_FULFILLED: {
      return {
        ...state,
        message: 'Widget Saved and Added to Dashboard',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case SAVE_WIDGET_REJECTED: {
      return {
        ...state,
        message: 'Problem Saving Widget',
        showAlert: true,
        variant: 'failureNotification',
      }
    }

    case RERUN_IMPORTER: {
      return {
        ...state,
        message: 'Importer Started',
        showAlert: true,
        variant: 'infoNotification'
      }
    }

    case RERUN_IMPORTER_FULFILLED: {
      return {
        ...state,
        message: 'Importer Completed Successfully',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case RERUN_IMPORTER_REJECTED: {
      return {
        ...state,
        message: 'Importer Failed ',
        showAlert: true,
        variant: 'failureNotification'
      }
    }

    case HIDE_NOTIFICATION: {
      return {
        ...state,
        showAlert: false,
      }
    }

  }
  return state;
}
