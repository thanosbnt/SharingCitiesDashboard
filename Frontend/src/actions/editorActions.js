import { axiosInstance } from './../api/axios';
import {
  EDITOR_CLOSE,
  EDITOR_OPEN,
  EDITOR_SAVE_WIDGET,
  EDITOR_SAVE_WIDGET_FULFILLED,
  EDITOR_SAVE_WIDGET_REJECTED,
  EDITOR_SET_WIDGET_PROPERTY,
  EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  EDITOR_SET_WIDGET_QUERY_PROPERTY,
  HIDE_NOTIFICATION,
  WIDGET_TYPE_ALERT,
  WIDGET_TYPE_FORECAST,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from "../constants";

export const closeEditor = () => ({
  type: EDITOR_CLOSE,
});

export const openEditor = (mode, widgetProperties=null) => ({
  type: EDITOR_OPEN,
  payload: {
    mode,
    widgetProperties,
  },
});

export const saveWidget = (mode, widget) => {
  return (dispatch, getState) => {
    dispatch({
      type: EDITOR_SAVE_WIDGET,
    });

    // remove data if it's a plot
    if (widget.type === WIDGET_TYPE_PLOT) {
      widget.config.data = { values: [] };
    }

    // ToDO :: check if we're adding a new widget or updating an existing one

    console.log(mode);
    return;

    const currentState = getState();

    const requestData = {
      userID: currentState.user.user.id,
      data: widget,
    };

    axiosInstance.post('widgets/create_widget', requestData).then((response) => {
      dispatch({
        type: EDITOR_SAVE_WIDGET_FULFILLED,
        payload: response.data,
      });

      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
      .catch((error) => {
        dispatch({
          type: EDITOR_SAVE_WIDGET_REJECTED,
          payload: error.statusText,
        })
      });

      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 5000)
  };
};

export const setWidgetProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetConfigProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetQueryProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_QUERY_PROPERTY,
  payload: {
    property,
    value,
  },
});
